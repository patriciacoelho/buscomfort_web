<template>
	<v-col
		class="pa-0"
		cols="12"
	>
		<page-header
			title="ÔNIBUS N432-11"
		>
			<template v-slot:subtitle>
				<p v-html="pageHeaderSubtitle"></p>
			</template>
			<template v-slot:action>
				<v-btn
					class="px-8"
					color="primary"
					rounded
					outlined
					dark
					@click="showFiltersModal = true"
				>
					<box-icon class="mr-2" name="filter-alt" color="#2F2E3A" />
					Filtrar
				</v-btn>
			</template>
		</page-header>

		<v-dialog
			v-model="showFiltersModal"
			max-width="500px"
			@click:outside="closeFiltersModal"
		>
			<v-card>
				<v-card-title class="text-h6">Filtrar histórico por escala</v-card-title>
				<v-card-text>
					<!-- <v-row class="mt-2">
						<v-col cols="12">
							<v-checkbox
								v-model="setLatestScheduleActive"
								label="Filtrar por última escala ativa"
								hide-details
							/>
						</v-col>
					</v-row> -->
					<v-row class="mt-2">
						<v-col cols="12">
							<v-autocomplete
								v-model="selectedRoute"
								:items="routeOptions"
								label="Rota"
								placeholder="Selecione..."
								persistent-placeholder
								hide-details
								no-data-text="Nenhuma rota encontrada"
								clearable
								no-filter
								outlined
								dense
								@input="onSelectRoute"
							>
								<template v-slot:selection="{ item }">
									<span>{{ item.prefix }} - {{ item.name}}</span>
								</template>
								<template v-slot:item="{ item }">
									<v-list-item-content>
										{{ item.prefix }} - {{ item.name }}
									</v-list-item-content>
								</template>
							</v-autocomplete>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-autocomplete
								v-model="selectedDriver"
								:items="driverOptions"
								label="Motorista"
								placeholder="Selecione..."
								persistent-placeholder
								hide-details
								no-data-text="Nenhum motorista encontrado"
								clearable
								no-filter
								outlined
								dense
								@input="onSelectDriver"
							>
								<template v-slot:selection="{ item }">
									<span v-text="item.name" />
								</template>
								<template v-slot:item="{ item }">
									<v-list-item-content>
										<v-list-item-title v-text="item.name" />
										<v-list-item-subtitle v-text="item.cpf" />
									</v-list-item-content>
								</template>
							</v-autocomplete>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-btn color="red darken-1" text @click="closeFiltersModal">Cancelar</v-btn>
					<v-spacer />
					<v-btn color="success darken-1" text @click="handleFilters">Filtrar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-row class="mx-8">
			<v-tabs
				v-model="currentTab"
				background-color="transparent"
				color="accent"
			>
				<v-tab
					v-for="index in 4"
					:key="`tab-${index}`"
				>
					{{ HISTORY_TABS_TITLE[index+1] }}
				</v-tab>
			</v-tabs>

			<v-tabs-items v-model="currentTab">
				<v-tab-item
					v-for="index in 4"
					:key="`tab-${index}`"
				>
					<default-history-view
						v-if="readingsData"
						:current-view="index + 1"
						:data="readingsData[HISTORY_TABS_NAME[index+1]]"
					/>
				</v-tab-item>
			</v-tabs-items>
		</v-row>
	</v-col>
</template>

<script>
import PageHeader from '../../../core/components/PageHeader.vue';
import DefaultHistoryView from '../components/DefaultHistoryView.vue';
import BusService from '../../../services/BusService';
import { HISTORY_TABS_TITLE, HISTORY_TABS_NAME } from '../../../core/constants/historyTabs';
import ReadingService from '../../../services/ReadingService';
import { WEEK_DAYS_TEXT } from '../../../core/constants/weekDays';
import { initialReadingData } from '../constants/initialReadingsData';
import cloneDeep from 'lodash.clonedeep';

export default {
	components: {
		PageHeader,
		DefaultHistoryView,
	},

	props: {
		bus: {
			type: String,
			default: null,
			required: true,
		},
	},

	data() {
		return {
			readingsData: cloneDeep(initialReadingData),
			WEEK_DAYS_TEXT,
			HISTORY_TABS_TITLE,
			HISTORY_TABS_NAME,
			busData: null,
			showFiltersModal: false,
			currentTab: null,
			filters: {
				route: null,
				driver: null,
			},
			selectedRoute: null,
			selectedDriver: null,
			routes: [],
			drivers: [],
			routeOptions: [],
			driverOptions: [],
			setLatestScheduleActive: false,
			updateReadingsClock: null,
			latestReading: null,
		};
	},

	mounted() {
		this.getBus();
		this.getReadings();
		this.getComboChartData();
		this.updateReadingsClock = setInterval(this.getLatestReading, 60000);
	},

	computed: {
		pageHeaderSubtitle() {
			const base = 'Histórico dos dados coletados do ônibus para ';
			if ( this.filters.driver && this.filters.route ) {
				return `${base} para o motorista ${this.filters.driver.name.bold()} na rota ${this.filters.route.name.bold()}`;
			}
			if ( this.filters.driver) {
				return `${base} para o motorista ${this.filters.driver.name.bold()} em ${('todas as rotas').bold()}`;
			}
			if ( this.filters.route ) {
				return `${base} para ${('todos os motoristas').bold()} da rota ${this.filters.route.name.bold()}`;
			}
			return `${base} ${('todas as escalas').bold()} (rotas e motoristas)`;
		},
	},

	methods: {
		onSelectRoute(value) {
			const drivers = [];
			if (value) {
				for (const i in this.busData.schedules) {
					const schedule = this.busData.schedules[i];
					if (schedule.active) {
						if (schedule.route._id === value._id && drivers.indexOf(schedule.driver) === -1) {
							drivers.push(schedule.driver);
						}
					}
				}
			}

			this.driverOptions = this.drivers.filter((driver) => {
				return !value || drivers.indexOf(driver) > -1;
			});
		},

		onSelectDriver(value) {
			const routes = [];
			if (value) {
				for (const i in this.busData.schedules) {
					const schedule = this.busData.schedules[i];
					if (schedule.active) {
						if (schedule.driver._id === value._id && routes.indexOf(schedule.route) === -1) {
							routes.push(schedule.route);
						}
					}
				}
			}

			this.routeOptions = this.routes.filter((route) => {
				return !value || routes.indexOf(route) > -1;
			});
		},

		getBus() {
			BusService.get(this.bus)
				.then(({ data }) => {
					this.busData = data;
					for (const i in data.schedules) {
						const schedule = data.schedules[i];
						if (schedule.active) {
							if (this.drivers.indexOf(schedule.driver) === -1) {
								this.drivers.push(schedule.driver);
								this.driverOptions.push(schedule.driver);
							}
							if (this.routes.indexOf(schedule.route) === -1) {
								this.routes.push(schedule.route);
								this.routeOptions.push(schedule.route);
							}
						}
					}
				})
				.catch(e => console.log(e));
		},

		getLatestReading() {
			if (this.filters.route || this.filters.driver) {
				return;
			}

			if (this.latestReading) {
				ReadingService.getLatest(this.bus)
					.then(({ data }) => {
						if (data.id !== this.latestReading) {
							this.latestReading = data.id;
							this.pushToFormattedData(data);
						}
					})
					.catch(e => console.log(e));
			}
		},

		getComboChartData() {
			ReadingService.getWeekAmounts(this.bus)
				.then(({ data }) => {
					const types = ['temperature', 'humidity', 'maxNoise', 'jerk'];
					for (const i in types) {
						const type = types[i] !== 'maxNoise' ? types[i] : 'noise';
						const values = data[types[i]];
						for (const j in values) {
							const value = values[j];

							if (this.readingsData[type].comboChart.labels.indexOf(this.WEEK_DAYS_TEXT[value.weekDay]) === -1) {
								this.readingsData[type].comboChart.labels.push(this.WEEK_DAYS_TEXT[value.weekDay]);
							}

							const min = value.min ?? 0;
							const max = value.max ?? 0;
							const mean = value.mean ?? 0;

							this.readingsData[type].comboChart.series[0].data.push(min);
							this.readingsData[type].comboChart.series[1].data.push(max);
							this.readingsData[type].comboChart.series[2].data.push(mean);

							// this.readingsData[type].comboChart.series[0].data.push({
							// 		x: this.WEEK_DAYS_TEXT[value.weekDay],
							// 		y: [min, max],
							// 	});
						}
					}
				})
				.catch(e => console.log(e));
		},

		getReadings() {
			const filters = {
				route: this.filters.route ? this.filters.route._id : null,
				driver: this.filters.driver ? this.filters.driver._id : null,
			};

			ReadingService.getAllByBus(this.bus, { ...filters })
				.then(({ data }) => {
					const lastIndex = data.length - 1;
					
					if (lastIndex > -1) {
						this.latestReading = data[lastIndex].id;
					}
					for (const i in data) {
						this.pushToFormattedData(data[i]);
					}
				})
				.catch(e => console.log(e));
		},

		pushToFormattedData(reading) {
			const values = {
				thermalComfort: parseFloat(reading.thermalComfort),
				noiseComfort: parseFloat(reading.noiseComfort),
				rideComfort: parseFloat(reading.rideComfort),
				temperature: parseFloat(reading.temperature),
				humidity: parseFloat(reading.humidity * 100),
				noise: parseFloat(reading.maxNoise),
				jerk: parseFloat(reading.jerk[1]),
			}
			this.readingsData['temperature'].comfortChart[Math.round(values.thermalComfort) - 1]++;
			this.readingsData['humidity'].comfortChart[Math.round(values.thermalComfort) - 1]++;
			this.readingsData['noise'].comfortChart[Math.round(values.noiseComfort) - 1]++;
			this.readingsData['jerk'].comfortChart[Math.round(values.rideComfort) - 1]++;
			
			const datetime = new Date(reading.gpsDatetime);
			const formattedTime = `${String((datetime.getHours())).padStart(2, '0')}:${String((datetime.getMinutes())).padStart(2, '0')}`;
			this.readingsData['temperature'].lineChart.data.push({ x: formattedTime, y: values.temperature });
			this.readingsData['humidity'].lineChart.data.push({ x: formattedTime, y: values.humidity });
			this.readingsData['noise'].lineChart.data.push({ x: formattedTime, y: values.noise });
			this.readingsData['jerk'].lineChart.data.push({ x: formattedTime, y: values.jerk });
		},

		handleFilters() {
			this.filters = {
				driver: this.selectedDriver,
				route: this.selectedRoute,
			};
			this.getReadings();
			this.closeFiltersModal();
		},

		closeFiltersModal() {
			this.showFiltersModal = false;
			this.selectedRoute = null;
			this.selectedDriver = null;
			this.driverOptions = this.drivers;
			this.routeOptions = this.routes;
		},
	},
}
</script>
