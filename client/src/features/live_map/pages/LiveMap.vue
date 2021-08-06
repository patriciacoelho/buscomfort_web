<template>
	<div class="d-flex">
		<div
			class="flex-grow-1"
			style="height: 100%;"
		>
			<l-map
				v-show="sideSheetCollapsed"
				ref="overviewMap"
				class="live-map__container live-map__container--expanded"
				:center="center"
				:zoom="zoom"
				:options="{ zoomControl: false }"
			>
				<!-- @ready="doSomethingOnReady()" -->
				<l-tile-layer
					:url="url"
					:attribution="attribution"
				/>
				<l-control>
					<v-card>
						<v-card-text>
							<span style="font-size: 1rem;">Status</span>
							<v-checkbox
								v-model="showActiveMarkers"
								class="mt-0 small"
								label="Em circulação"
								:hide-details="true"
							/>
							<v-checkbox
								v-model="showInactiveMarkers"
								class="mt-0"
								label="Na garagem"
								:hide-details="true"
							/>
							<v-checkbox
								v-model="showNoSignalMarkers"
								class="mt-0"
								label="Sem sinal"
								:hide-details="true"
							/>
						</v-card-text>
					</v-card>
				</l-control>
				<l-control position="bottomleft"  class="example-custom-control">
					<v-btn @click="sideSheetCollapsed = !sideSheetCollapsed">
						Click me
					</v-btn>
					<!-- <p @click="showAlert">
					Click me
					</p> -->
				</l-control>
				<l-control-zoom position="bottomright" />
			</l-map>
			<l-map
				v-show="!sideSheetCollapsed"
				ref="detailMap"
				class="live-map__container live-map__container--collapsed"
				:center="center"
				:zoom="zoom"
				:options="{ zoomControl: false }"
			>
				<l-tile-layer
					:url="url"
					:attribution="attribution"
				/>
				<l-control>
					<v-card>
						<v-card-text>
							<span style="font-size: 1rem;">Status</span>
							<v-checkbox
								v-model="showActiveMarkers"
								class="mt-0 small"
								label="Em circulação"
								:hide-details="true"
							/>
							<v-checkbox
								v-model="showInactiveMarkers"
								class="mt-0"
								label="Na garagem"
								:hide-details="true"
							/>
							<v-checkbox
								v-model="showNoSignalMarkers"
								class="mt-0"
								label="Sem sinal"
								:hide-details="true"
							/>
						</v-card-text>
					</v-card>
				</l-control>
				<!-- controller temporário -->
				<l-control position="bottomleft"  class="example-custom-control">
					<v-btn @click="sideSheetCollapsed = !sideSheetCollapsed">
						Click me
					</v-btn>
				</l-control>
				<l-control-zoom position="bottomright" />
			</l-map>
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
import { LControlZoom, LControl } from 'vue2-leaflet';
import MoreInfo from '../components/MoreInfo.vue';

export default {
	components: {
		LControlZoom,
		LControl,
		MoreInfo,
	},

	data() {
		return {
			center: [-9.412170, -40.515131],
			zoom: 13,
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

			showActiveMarkers: true,
			showInactiveMarkers: true,
			showNoSignalMarkers: true,
			sideSheetCollapsed: true,
			overviewMap: null,
			detailMap: null,
		};
	},

	watch: {
		sideSheetCollapsed: {
			handler() {
				setTimeout(() => {
					this.detailMap.invalidateSize();
					this.overviewMap.invalidateSize();
				}, 100);
			},
			immediate: true,
		}
	},

	mounted() {
		this.$nextTick(() => {
			this.overviewMap = this.$refs.overviewMap.mapObject;
			this.detailMap = this.$refs.detailMap.mapObject;
		});
	},

	methods: {
		closeSideSheet(e) {
			console.log(e);
			this.sideSheetCollapsed = true;
		}
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