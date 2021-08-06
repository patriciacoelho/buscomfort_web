<template>
	<v-sheet
		class="pa-4"
		color="white"
		height="100%"
		width="395"
	>
		<div class="text-right">
			<box-icon class="cursor-pointer" name="x" color="#999999" @click="esc" />
		</div>
		<v-row class="justify-space-between">
			<v-col>
				<h2 class="primary--text pcs-title">ÔNIBUS U742-09</h2>
				<h4 class="pcs-subtitle-3">
					CAMPUS JUAZEIRO --> CAMPUS CCA (Av. Sete de Setembro)
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
					<no-signal-icon />
					<p style="color: #DC3545;">
						Não foi possível realizar comunicação com este ônibus. O módulo está offline.
					</p>
				</div>
				<div
					v-else-if="moduleStatus === 'in-yard'"
					class="text-center"
				>
					<in-yard-icon />
					<p style="color: #8D8D8D;">
						Este ônibus se encontra na garagem, não está em operação no momento.
					</p>
				</div>
				<div v-else>
					<v-row>
						<v-col cols="3">
							<comfort-level-icon style="height: 70px;" />
						</v-col>
						<v-col>
							<p>NÍVEL 3</p>
							<p>Pouco desconforto</p>
							<p>Níveis altos de temperatura e vibração</p>
						</v-col>
					</v-row>
					<div>
						<p>
							Ambiente
						</p>
						<v-row>
							<v-col cols="3">
								<temperature-sensor-icon style="height: 40px;" />
								<p>32 ºC</p>
							</v-col>
							<v-col cols="3">
								<moisture-icon style="height: 40px;" />
								<p>45 %rH</p>
							</v-col>
							<v-col cols="3">
								<noise-sensor-icon style="height: 40px;" />
								<p>60 db(A)</p>
							</v-col>
							<v-col cols="3">
								<jerk-meter-icon style="height: 40px;" />
								<p>1,6 m/s³</p>
							</v-col>
						</v-row>
					</div>
					<v-divider class="my-3" />
					<div>
						<p>
							Localização
						</p>
						<p>
							Av. Guararapes, 2114 - Centro
						</p>
						<p>
							Petrolina - PE, 56302-971
						</p>
						<p>
							-9.400000, -40.500000
						</p>
					</div>
					<v-divider class="my-3" />
					<div>
						<p>
							Movimento
						</p>
						<p>
							30.0 km/h em direção a leste
						</p>
						<p>
							Trecho entre a Catedral de Petrolina e a Auto Escola Petrolina
						</p>
						<p>
							Próxima parada a 3 min
						</p>
					</div>
				</div>
				<v-row justify="center" class="mt-auto">
					<v-btn
						rounded
						color="primary"
						dark
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
import MoistureIcon from './MoistureIcon.vue';
import JerkMeterIcon from './JerkMeterIcon.vue';
import TemperatureSensorIcon from './TemperatureSensorIcon.vue';
import ComfortLevelIcon from './ComfortLevelIcon.vue';

export default {
	components: {
		NoSignalIcon,
		InYardIcon,
		NoiseSensorIcon,
		MoistureIcon,
		JerkMeterIcon,
		TemperatureSensorIcon,
		ComfortLevelIcon,
	},

	data() {
		return {
			moduleStatus: 'watching',
		};
	},

	methods: {
		esc() {
			console.log('esc me');
			this.$emit('close', true);
		}
	}
};
</script>