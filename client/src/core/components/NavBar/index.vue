<template>
	<span class="sidebar">
		<v-btn
			class="float-chevron"
			:class="floatChevronClass"
			color="accent"
			x-small
			fab
			absolute
			@click.stop="mini = !mini"
		>
			<v-icon dark>
				{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
			</v-icon>
		</v-btn>
		
		<v-navigation-drawer
			class="sidebar__drawer"
			height="100%"
			app
			dark
			fixed
			permanent
			:mini-variant="mini"
		>
			<v-list
				nav
				dense
			>
				<v-list-item-group
					v-model="activeItem"
					@change="changePage"
				>
					<v-list-item
						v-for="(item, key) in items.main"
						:key="'main-route-' + key"
						link
					>
						<v-list-item-icon>
							<box-icon :name="item.iconName" :color="iconColor(item.route)" />
						</v-list-item-icon>
						<v-list-item-title class="sidebar__item-title">
							{{ item.title }}
						</v-list-item-title>
					</v-list-item>

					<v-divider class="my-3" />

					<v-list-item
						v-for="(item, key) in items.complementary"
						:key="'complementary-route-' + key"
						link
					>
						<v-list-item-icon>
							<box-icon :name="item.iconName" :color="iconColor(item.route)" />
						</v-list-item-icon>
						<v-list-item-title class="sidebar__item-title">
							{{ item.title }}
						</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>

			<template v-slot:append>
				<v-list
					nav
					dense
				>
					<v-list-item-group
						v-model="activeSimulation"
						@change="toggleSimulation"
					>
						<v-list-item link>
							<v-list-item-icon>
								<box-icon :name="simulationIcon" color="#C4C4C4" />
							</v-list-item-icon>
							<v-list-item-title class="sidebar__item-title">
								Simulador: {{ activeSimulation === 0 ? 'on' : 'off' }}
							</v-list-item-title>
						</v-list-item>
					</v-list-item-group>
				</v-list>
				<v-list-item class="px-2">
					<v-list-item-avatar>
						<v-img src="/gestor-icon.png" />
					</v-list-item-avatar>
					
					<v-list-item-content>
						<v-list-item-title>Luís Marcos</v-list-item-title>
						<v-list-item-subtitle>Gestor</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-navigation-drawer>
	</span>
</template>

<script>
import simulateReadings from '../../utils/simulator';
import items from './routes';

export default {
	data() {
		return {
			items,
			allRoutes: items.main.concat(items.complementary).map(item => item.route),
			mini: true,
			activeItem: 0,
			activeSimulation: false,
		};
	},

	beforeMount() {
		this.activeItem = this.allRoutes.indexOf(this.$route.path);
	},

	computed: {
		floatChevronClass() {
			return this.mini ? 'float-chevron--condensed' : 'float-chevron--expanded';
		},

		simulationIcon() {
			return this.activeSimulation === 0 ? 'notification' : 'notification-off';
		},
	},

	methods: {
		simulateReadings,

		toggleSimulation(index) {
			this.simulateReadings(index === 0);
		},

		iconColor(route) {
			return this.$route.path === route ? 'white' : '#C4C4C4';
		},

		changePage(index) {
			this.mini = true;
			this.$router.push(this.allRoutes[index]);
		},
	}
}
</script>

<style lang="scss" scoped>
.sidebar {
	z-index: 999;

	&__drawer {
		padding-top: 80px;
		background-color: #2F2E3A !important;
	}

	&__item-title {
		font-size: 0.875rem !important;
		color: #c4c4c4;
	}
}

.v-item--active .sidebar__item-title {
	color: white;
}

.float-chevron {
	z-index: 99 !important;
	top: 40px;

	&--condensed {
		left: 40px !important;
	}

	&--expanded {
		left: 240px !important;
	}
}
</style>
