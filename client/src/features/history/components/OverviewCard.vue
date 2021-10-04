<template>
	<v-card v-bind="$attrs">
		<v-card-text>
			<h4 class="pcs-page-subtitle mb-5">
				Panorama de {{ HISTORY_TABS_TITLE[currentView] }}
			</h4>
			<v-row>
				<v-col cols="6">
					<div class="d-flex ml-n7">
						<Meter :value="latest !== '--' ? latest : 0" :maxValue="limits.max" :minValue="limits.min" />
						<div class="d-flex flex-column justify-center ml-n3">
							<p class="pcs-title">{{ latest }} {{ unit }}</p>
							<span class="pcs-link">Medida mais recente</span>
							<span>{{ subtext(latest) }}</span>
						</div>
					</div>
				</v-col>
				<v-col cols="6">
					<div class="d-flex ml-n7">
						<Meter :value="mean !== '--' ? parseFloat(mean) : 0" :maxValue="limits.max" :minValue="limits.min" />
						<div class="d-flex flex-column justify-center ml-n3">
							<p class="pcs-title">{{ mean }} {{ unit }}</p>
							<span class="pcs-link">Média de {{ HISTORY_TABS_TITLE[currentView].toLowerCase() }}</span>
							<span>{{ subtext(mean) }}</span>
						</div>
					</div>
				</v-col>
			</v-row>
			<h5 class="pcs-subtitle ml-4 mb-4 mt-7">Variação de {{ HISTORY_TABS_TITLE[currentView] }}</h5>
			<v-row class="justify-center">
				<v-col cols="12">
					<apexchart v-if="data" :options="LINE_CHART_CONFIG" :series="[data]" />
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import Meter from './Meter.vue';
import { HISTORY_TABS_TITLE } from '../../../core/constants/historyTabs';
import LINE_CHART_CONFIG from '../constants/lineChartConfig';

export default {
	components: { Meter },

	props: {
		data: {
			type: Object,
			default: () => ({}),
			required: true,
		},
		unit: {
			type: String,
			default: '',
		},
		limits: {
			type: Object,
			default: () => ({}),
		},
		currentView: {
			type: Number,
			default: 0,
		},
	},

	data() {
		return {
			HISTORY_TABS_TITLE,
			LINE_CHART_CONFIG,
		};
	},

	computed: {
		latest() {
			const length = this.data.data.length;
			if (!length) {
				return '--';
			}

			return this.data.data[length - 1].y;
		},
		mean() {
			const length = this.data.data.length;
			if (!length) {
				return '--';
			}

			const sum = this.data.data
				.map( el => el.y )
				.reduce( (sum, curr) => sum + curr );

			return (sum / length).toFixed(1);
		},
	},

	methods: {
		subtext(value) {
			if (value === this.limits.minComfortable || value === this.limits.maxComfortable) {
				return 'No limiar de conforto';
			}
			if (value > this.limits.maxComfortable) {
				return 'Acima do nível de conforto';
			}
			if (value < this.limits.minComfortable) {
				return 'Abaixo do nível de conforto';
			}
			return 'Dentro dos limites de conforto';
		} 
	},
}
</script>
