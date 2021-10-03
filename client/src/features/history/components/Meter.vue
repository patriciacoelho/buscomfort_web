<template>
	<span>
		<apexchart width="150" type="radialBar" :options="options" :series="meterValue" />
	</span>
</template>

<script>
export default {
	props: {
		value: {
			type: Number,
			default: null,
			required: true,
		},
		maxValue: {
			type: Number,
			default: 100,
		},
		minValue: {
			type: Number,
			default: 0,
		},
	},

	data() {
		return {
			options: {
				colors: ['#AD3FC9'],
				plotOptions: {
					radialBar: {
						startAngle: -135,
						endAngle: 135,
						track: {
							background: '#DADADA',
							startAngle: -135,
							endAngle: 135,
						},
						dataLabels: {
							name: { show: false },
							value: { show: false },
						},
					},
				},
				fill: {
					type: 'gradient',
					gradient: {
						shade: 'dark',
						type: 'horizontal',
						gradientToColors: ['#E63B86'],
						stops: [0, 100]
					}
				},
				stroke: { lineCap: 'round' },
			},
		};
	},

	computed: {
		meterValue() {
			const min = this.minValue * 0.9;
			const range = this.maxValue * 1.1 - min;

			return [ 100 * (this.value - min) / range ];
		},
	},
}
</script>
