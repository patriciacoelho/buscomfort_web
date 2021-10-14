<template>
	<v-sheet
		class="side-sheet pa-4"
		color="white"
		height="100%"
		width="395"
	>
		<div class="text-right">
			<box-icon class="cursor-pointer" name="x" color="#999999" @click="esc" />
		</div>
		<v-row class="justify-space-between">
			<v-col>
				<h2 class="primary--text pcs-title">ÔNIBUS {{ bus.prefixCode }}</h2>
				<h4 v-if="latest.currentSchedule" class="pcs-subtitle-3 my-1 side-sheet__subtitle">
					{{ `Rota: ${latest.currentSchedule.route.name} (${latest.currentSchedule.route.spec})` }} 
				</h4>
				<v-divider class="my-4" />
			</v-col>
		</v-row>
		<v-container :class="moduleStatus !== 'watching' ? 'fill-height' : ''">
			<div>
				<div
					v-if="moduleStatus === 'no-signal'"
					class="text-center"
				>
					<no-signal-icon style="width: 120px;" />
					<p style="color: #DC3545;">
						Não foi possível realizar comunicação com este ônibus. O módulo está offline.
					</p>
				</div>
				<div
					v-else-if="moduleStatus === 'in-yard'"
					class="text-center"
				>
					<in-yard-icon style="width: 120px;" />
					<p style="color: #8D8D8D;">
						Este ônibus se encontra na garagem, não está em operação no momento.
					</p>
				</div>
				<div
					v-else-if="loading"
					class="text-center"
				>
					<v-progress-circular
						:size="70"
						:width="3"
						color="#CCC"
						indeterminate
					/>
				</div>
				<div v-else>
					<v-row class="justify-center align-center">
						<v-col cols="3">
							<comfort-level-icon v-model="latest.comfortLevel" style="height: 70px;" />
						</v-col>
						<v-col cols="7">
							<p class="pcs-caption">NÍVEL {{ latest.comfortLevel }}</p>
							<p
								class="pcs-subtitle my-1 font-weight-bold"
								:style="`color: ${COMFORT_LEVELS_COLOR[latest.comfortLevel]};`"
							>
								{{ COMFORT_LEVELS_TEXT[latest.comfortLevel] }}
							</p>
							<p class="primary--text pcs-subtitle font-weight-light">
								{{ comfortDetailsText }}
							</p>
						</v-col>
					</v-row>
					<div>
						<p class="dark--text pcs-subtitle my-3">
							Ambiente
						</p>
						<v-row>
							<v-col
								class="text-center"
								cols="3"
							>
								<temperature-sensor-icon style="height: 40px;" />
								<p>{{ latest.temperature || '--' }} ºC</p>
							</v-col>
							<v-col
								class="text-center"
								cols="3"
							>
								<humidity-icon style="height: 40px;" />
								<p>{{ parseInt(latest.humidity * 100) || '--' }} %rH</p>
							</v-col>
							<v-col
								class="text-center"
								cols="3"
							>
								<noise-sensor-icon style="height: 40px;" />
								<p>{{ latest.maxNoise || '--' }} db(A)</p>
							</v-col>
							<v-col
								class="text-center"
								cols="3"
							>
								<jerk-meter-icon style="height: 40px;" />
								<p>{{ latest.jerk[1] || '--' }} m/s³</p>
							</v-col>
						</v-row>
					</div>
					<v-divider class="my-3" />
					<div>
						<p class="dark--text pcs-subtitle my-3">
							Localização
						</p>
						<!-- usar biblioteca para buscar por localização e retornar endereço -->
						<p class="pcs-subtitle-3">
							{{ latest.gpsLocation[0] || '--' }}, {{ latest.gpsLocation[1] || '--' }}
						</p>
					</div>
				</div>
				<v-row justify="center" class="mt-6">
					<v-btn
						class="my-4 px-8"
						rounded
						color="primary"
						dark
						@click="redirectToHistory"
					>
						Acessar histórico
					</v-btn>
				</v-row>
			</div>
		</v-container>
	</v-sheet>
</template>

<script>
import NoSignalIcon from './NoSignalIcon.vue';
import InYardIcon from './InYardIcon.vue';
import NoiseSensorIcon from './NoiseSensorIcon.vue';
import HumidityIcon from './HumidityIcon.vue';
import JerkMeterIcon from './JerkMeterIcon.vue';
import TemperatureSensorIcon from './TemperatureSensorIcon.vue';
import ComfortLevelIcon from './ComfortLevelIcon.vue';
import ReadingService from '../../../services/ReadingService';
import { COMFORT_LEVELS_TEXT, COMFORT_LEVELS_COLOR } from '../../../core/constants/comfortLevels';
import computedComfortLevel from '../../../core/utils/computedComfort';

export default {
	components: {
		NoSignalIcon,
		InYardIcon,
		NoiseSensorIcon,
		HumidityIcon,
		JerkMeterIcon,
		TemperatureSensorIcon,
		ComfortLevelIcon,
	},

	props: {
		bus: {
			type: Object,
			default: null,
			required: true,
		}
	},

	data() {
		return {
			COMFORT_LEVELS_TEXT,
			COMFORT_LEVELS_COLOR,
			moduleStatus: 'watching', // update w/ bus.status
			latest: {},
			loading: true,
			limitRef: {
				temperature: {
					upper: 27,
					lower: 21,
				},
				humidity: {
					upper: 0.8,
					lower: 0.3,
				},
				noise: {
					upper: 70,
				},
				jerk: {
					upper: 1.2,
				},
			},
			requestLatestClock: null,
		};
	},

	computed: {
		comfortDetailsText(){
			let comfortDetails = '';
			let upperLimit = [];
			let lowerLimit = [];
			if( this.latest.temperature > this.limitRef.temperature.upper )
				upperLimit.push('temperatura');
			if( this.latest.temperature < this.limitRef.temperature.lower )
				lowerLimit.push('temperatura');
			if( this.latest.humidity > this.limitRef.humidity.upper )
				upperLimit.push('umidade');
			if( this.latest.humidity < this.limitRef.humidity.lower )
				lowerLimit.push('umidade');
			if( this.latest.maxNoise > this.limitRef.noise.upper )
				upperLimit.push('ruído');
			if( this.latest.jerk > this.limitRef.jerk.upper )
				upperLimit.push('jerk');

			if (!upperLimit.length && !lowerLimit.length){
				comfortDetails += 'Ambiente com níveis dentro do padrão de conforto';
			} else {
				let upperString = '';
				for (let i = 0; i < upperLimit.length; i++) {
					if( i == (upperLimit.length - 1) ) {
						upperString += upperLimit[i]; 
					} else {
						if( i == (upperLimit.length - 2) )
							upperString += upperLimit[i] + ' e '; 
						else
							upperString += upperLimit[i] + ', '; 
					}
				}
				let lowerString = '';
				for (let i = 0; i < lowerLimit.length; i++) {
					if( i == (lowerLimit.length - 1) ) {
						lowerString += lowerLimit[i]; 
					} else {
						if( i == (lowerLimit.length - 2) )
							lowerString += lowerLimit[i] + ' e '; 
						else
							lowerString += lowerLimit[i] + ', '; 
					}
				}
				if(upperString !== '') {
					comfortDetails += 'Níveis altos de ' + upperString;
				} 
				if(lowerString !== '') {	
					if(upperString !== '') {
						comfortDetails += ', e baixa ' + lowerString;
					} else {
						comfortDetails += 'Níveis baixos de ' + lowerString;
					}
				}
			}
			return comfortDetails;
		},
	},

	mounted() {
		this.getReading();
		this.requestLatestClock = setInterval(this.getReading, 60000);
	},

	methods: {
		computedComfortLevel,

		getReading() {
			const bus_id = this.bus.id;
			this.loading = true;
			ReadingService.getLatest(bus_id)
				.then(({ data }) => {
					const comfortLevel = this.computedComfortLevel(data);
					this.latest = {
						...data,
						comfortLevel,
					};
					this.loading = false;
				})
				.catch(e => {
					this.loading = false;
					console.log(e);
				});
		},

		redirectToHistory() {
			this.$router.push(`/historico/detalhamento/${this.bus.id}`);
		},

		esc() {
			clearInterval(this.requestLatestClock);
			this.$emit('close', true);
		},
	}
};
</script>

<style lang="scss" scoped>
.side-sheet {
	&__subtitle {
		color: #4F4F4F;
	}

	&__caption {
		text-transform: none;
	}
}
</style>
