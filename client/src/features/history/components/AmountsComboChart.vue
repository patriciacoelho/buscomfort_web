<template>
	<span>
		<apexchart
			ref="amountsComboChart"
			type="line"
			:options="internalOptions"
			:series="internalSeries"
		/>
	</span>
</template>

<script>
export default {
	props: {
		options: {
			type: Object,
			default: null,
			required: true,
		},
		series: {
			type: Array,
			default: null,
			required: true,
		},
	},

	data() {
		return {
			internalOptions: {},
			internalSeries: [],
		}
	},

	watch: {
		options: {
			handler(value) {
				this.internalOptions = { ...value };
			},
			deep: true,
		},

		series: {
			handler(newSeries) {
				this.internalSeries = [ ...newSeries ];
			},
			deep: true,
		},
	},

	mounted() {
		this.internalOptions = { ...this.options };
		this.internalSeries = [ ...this.series ];
	},
}
</script>
