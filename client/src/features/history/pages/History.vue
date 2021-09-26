<template>
	<div>
		Bus History
	</div>
</template>

<script>
import BusService from '../../../services/BusService';

export default {
	props: {
		bus: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			busData: null,
		};
	},

	mounted() {
		if (this.bus) {
			this.getBus();
		}
	},

	methods: {
		getBus() {
			BusService.get(this.bus)
				.then(response => {
					this.busData = response.data._doc;
					console.log(response.data._doc);
				})
				.catch(e => {
					console.log(e);
				});
		},
	},
}
</script>
