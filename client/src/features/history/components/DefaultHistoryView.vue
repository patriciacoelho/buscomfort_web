<template>
	<div class="d-flex" style="min-height: 540px;">
		<v-col cols="6" class="pl-1">
			<overview-card
				:data="data.lineChart"
				:unit="data.unitOfMeasure"
				:limits="data.limits"
				:currentView="currentView"
				height="100%"
				width="580px"
			/>
		</v-col>
		<v-col cols="6">
			<div class="d-flex">
				<v-card width="620px">
					<v-card-text>
						<h4 class="pcs-page-subtitle mb-5">
							Índices semanais de {{ HISTORY_TABS_TITLE[currentView].toLowerCase() }}
						</h4>
						<v-row>
							<v-col cols="12">
								<!-- <apexchart v-if="data" :options="RANGE_BAR_CHART_CONFIG" :labels="data.comboChart.labels" :series="[data.comboChart.series[0]]" /> -->
								<apexchart v-if="data.comboChart" :options="comboChartConfig" :series="data.comboChart.series" />
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</div>
			<div class="d-flex flex-column mt-5">
				<h4 class="pcs-page-subtitle mb-3">
					Panorama de conforto {{ comfortType }}
				</h4>
				<v-row>
					<!-- <v-col cols="3">
						<comfort-scale />
					</v-col> -->
					<v-col cols="9">
						<v-card>
							<v-card-text>
								<h5 class="pcs-subtitle text-right mr-4">Conforto {{ comfortType }} do dia</h5>
								<apexchart
									v-if="data"
									width="350"
									type="donut"
									:options="DONUT_CHART_CONFIG"
									:series="data.comfortChart"
								/>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</div>
		</v-col>
	</div>
</template>

<script>
import OverviewCard from './OverviewCard.vue';
import COMBO_CHART_CONFIG from '../constants/comboChartConfig';
import RANGE_BAR_CHART_CONFIG from '../constants/rangeBarChartConfig';
import { HISTORY_TABS_TITLE, TEMPERATURE, HUMIDITY, NOISE, KINETIC } from '../../../core/constants/historyTabs';
// import ComfortScale from './ComfortScale.vue';

export default {
	components: {
		OverviewCard,
		// ComfortScale,
	},

	props: {
		currentView: {
			type: Number,
			default: -1,
		},
		data: {
			type: Object,
			default: () => ({}),
			required: true,
		},
	},

	data() {
		return {
			HISTORY_TABS_TITLE,
			COMBO_CHART_CONFIG,
			comboChartConfig: {
				...COMBO_CHART_CONFIG,
				labels: this.data.comboChart.labels,
			},
			RANGE_BAR_CHART_CONFIG,
			DONUT_CHART_CONFIG: {
				labels: ['Muito desconforto', 'Desconforto', 'Pouco conforto', 'Conforto', 'Muito conforto'],
				dataLabels: { enabled: false },
			},
		};
	},

	computed: {
		comfortType() {
			switch(this.currentView) {
			case KINETIC:
				return 'cinético';
			case NOISE:
				return 'auditivo';
			case TEMPERATURE:
			case HUMIDITY:
			default:
				return 'térmico';
			}
		},
	},
}
</script>
