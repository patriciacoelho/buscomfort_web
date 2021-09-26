<template>
	<div class="d-flex">
		<div
			class="flex-grow-1"
			style="height: 100%;"
		>
			<live-map
				:collapsed="sideSheetCollapsed"
				@marker-selected="handleMarkerSelection"
			/>
		</div>
		<div
			v-if="!sideSheetCollapsed"
			class="flex-grow-0 live-map__detail-card"
		>
			<more-info @close="closeSideSheet" />
		</div>
	</div>
</template>

<script>
import MoreInfo from '../components/MoreInfo.vue';
import LiveMap from '../components/LiveMap.vue';

export default {
	components: {
		LiveMap,
		MoreInfo,
	},

	data() {
		return {
			sideSheetCollapsed: true,
		};
	},

	watch: {
		//
	},

	methods: {
		closeSideSheet(e) {
			console.log(e);
			this.sideSheetCollapsed = true;
		},

		handleMarkerSelection(e) {
			console.log(e);
			this.sideSheetCollapsed = false;
		},
	}
};
</script>

<style lang="scss" scoped>
.live-map__container {
	height: 100%;
	width: 100%;
	position: absolute;

	&--collapsed {
		width: calc(100% - 395px) !important;
	}

	&--expanded {
		width: 100% !important;
	}
}
.live-map__detail-card {
	width: 395px;
}
</style>