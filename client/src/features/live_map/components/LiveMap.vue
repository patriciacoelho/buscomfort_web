<template>
	<div>
		<l-map
			v-show="sideSheetCollapsed"
			ref="overviewMap"
			class="live-map__container live-map__container--expanded"
			:center="center"
			:zoom="zoomOverviewMap"
			:options="{ zoomControl: false }"
		>
			<l-tile-layer
				:url="url"
				:attribution="attribution"
			/>
			<l-marker
				v-for="marker in filteredMarkers"
				:key="`overviewMap-${marker.id}`"
				:visible="marker.visible"
				:lat-lng.sync="marker.position"
				:icon="marker.icon"
				@click="selectMarker(marker)"
			/>
			<l-control>
				<v-card>
					<v-card-text>
						<span style="font-size: 1rem;">Status</span>
						<v-checkbox
							v-model="showMarkers['watching']"
							class="mt-0 small"
							label="Em circulação"
							hide-details
						/>
						<v-checkbox
							v-model="showMarkers['in-yard']"
							class="mt-0"
							label="Na garagem"
							hide-details
						/>
						<v-checkbox
							v-model="showMarkers['no-signal']"
							class="mt-0"
							label="Sem sinal"
							hide-details
						/>
					</v-card-text>
				</v-card>
			</l-control>
			<l-control-zoom position="bottomright" />
		</l-map>
		<l-map
			v-show="!sideSheetCollapsed"
			ref="detailMap"
			class="live-map__container live-map__container--collapsed"
			:center="centerDetailMap"
			:zoom="zoomDetailMap"
			:options="{ zoomControl: false }"
		>
			<l-tile-layer
				:url="url"
				:attribution="attribution"
			/>
			<div
				v-for="marker in selectedMarker"
				:key="`detailMap-${marker.id}`"
			>
				<l-marker
					:visible="marker.visible"
					:lat-lng.sync="marker.position"
					:icon="marker.icon"
				/>
			</div>
			<l-control>
				<v-card>
					<v-card-text>
						<span style="font-size: 1rem;">Status</span>
						<v-checkbox
							v-model="showMarkers['watching']"
							class="mt-0 small"
							label="Em circulação"
							hide-details
						/>
						<v-checkbox
							v-model="showMarkers['in-yard']"
							class="mt-0"
							label="Na garagem"
							hide-details
						/>
						<v-checkbox
							v-model="showMarkers['no-signal']"
							class="mt-0"
							label="Sem sinal"
							hide-details
						/>
					</v-card-text>
				</v-card>
			</l-control>
			<l-control-zoom position="bottomright" />
		</l-map>
	</div>
</template>

<script>
import {
	LControlZoom,
	LControl,
	LMarker,
} from 'vue2-leaflet';
import { icon } from 'leaflet';
import BusService from '../../../services/BusService';

export default {
	components: {
		LControlZoom,
		LControl,
		LMarker,
	},

	props: {
		collapsed: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			center: [-9.412170, -40.515131],
			centerDetailMap: [-9.412170, -40.515131],
			zoomOverviewMap: 13,
			zoomDetailMap: 17,
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

			showMarkers: {
				'no-signal': true,
				'watching': true,
				'in-yard': true,
			},
			sideSheetCollapsed: true,

			overviewMap: null,
			detailMap: null,

			markers: [],
			selectedMarker: [],
			updateMarkersClock: null,
		};
	},

	computed: {
		filteredMarkers() {
			return this.markers.filter((marker) => {
				return this.showMarkers[marker.status];
			})
		},
	},

	watch: {
		collapsed: {
			handler(newValue) {
				this.sideSheetCollapsed = newValue;
				if (newValue) {
					this.selectedMarker = [];
				}
			},
		},

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
		this.getBuses();
		this.$nextTick(() => {
			this.overviewMap = this.$refs.overviewMap.mapObject;
			this.detailMap = this.$refs.detailMap.mapObject;
		});
		this.updateMarkersClock = setInterval(this.getBuses, 60000);
		// clearInterval(this.updateMarkersClock);
	},

	methods: {
		getBuses() {
			this.markers = [];
			BusService.getAllGroupedByStatus()
				.then(({ data }) => {
					for (const status in data) {
						for (const j in data[status]) {
							if (data[status][j].lastPosition) {
								this.markers.push({
									...data[status][j],
									id: data[status][j]._id,
									position: {
										lat: parseFloat(data[status][j].lastPosition[0]),
										lng: parseFloat(data[status][j].lastPosition[1]),
									},
									visible: this.showMarkers[status], // se está mostrando os marcadores do status
									status,
									icon: icon({
										iconUrl: `${status}-marker.png`,
										iconSize: [45, 45],
										iconAnchor: [16, 37]
									}),
								});
							}
						}
					}
				})
				.catch(e => console.log(e));
		},

		selectMarker(marker) {
			this.centerDetailMap = marker.position;
			this.selectedMarker.push(marker);
			this.sideSheetCollapsed = !this.sideSheetCollapsed;
			this.$emit('marker-selected', marker);
		},
	},
}
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
</style>
