<template>
	<v-col
		class="pa-0"
		cols="9"
	>
		<page-header
			title="Histórico dos dados coletados"
			subtitle="Selecione um ônibus na lista de ônibus cadastrados para visualizar o histórico"
		/>
		<v-row class="mx-8 justify-space-between">
			<v-col cols="6">
				<v-text-field
					v-model="searchQuery"
					outlined
					rounded
					dense
					placeholder="Pesquisar por código, rota ou motorista..."
				>
					<template v-slot:prepend-inner>
						<box-icon name="search" color="#999999" />
					</template>
				</v-text-field>
			</v-col>
			<v-col
				class="text-right"
				cols="3"
			>
				<v-menu
					offset-y
					:close-on-content-click="false"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							class="px-8"
							rounded
							outlined
							height="40"
							color="primary"
							dark
							v-bind="attrs"
							v-on="on"
						>
							<box-icon class="mr-2" name="filter-alt" color="#2F2E3A" />
							Filtrar
						</v-btn>
					</template>
					<v-list>
						<v-list-item>
							<v-checkbox
								v-model="showActiveModules"
								class="mt-0 small"
								label="Em circulação"
								:hide-details="true"
							/>
						</v-list-item>
						<v-list-item>
							<v-checkbox
								v-model="showInactiveModules"
								class="mt-0"
								label="Na garagem"
								:hide-details="true"
							/>
						</v-list-item>
						<v-list-item>
							<v-checkbox
								v-model="showNoSignalModules"
								class="mt-0"
								label="Sem sinal"
								:hide-details="true"
							/>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-col>
		</v-row>
		<v-row class="mx-8">
			<v-col cols="12">
				<div
					v-for="(item, i) in items"
					:key="`onibus-${i}`"
					class="mb-3"
				>
					<list-item
						:title="item.title"
						@click="test"
					>
						<template v-slot:icon>
							<v-img
								max-height="50"
								max-width="50"
								:src="`/${item.status}-marker.png`"
							/>
						</template>
						<template v-slot:subtitle>
							<p>{{ item.category }}</p>
							<p>Placa: {{ item.licensePlate }}</p>
						</template>
						<template v-slot:right-slot>
							<div class="d-flex flex-column">
								<span>ÚLTIMA TRANSMISSÃO</span>
								<p>
									{{ item.lastShot || '--' }}
								</p>
							</div>
						</template>
					</list-item>
				</div>
			</v-col>
		</v-row>
	</v-col>
</template>

<script>
import PageHeader from '../../../core/components/PageHeader.vue';
import ListItem from '../../../core/components/ListItem.vue';

export default {
	components: {
		PageHeader,
		ListItem,
	},

	data() {
		return {
			searchQuery: "",
			showActiveModules: true,
			showInactiveModules: true,
			showNoSignalModules: true,
			items: [
				{
					title: 'N7511-10',
					status: 'watching',
					licensePlate: 'GSV4H86',
					category: 'Ônibus Padron',
					lastShot: '14:53:04',
				},
				{
					title: 'NB519-12',
					status: 'no-signal',
					licensePlate: 'JKP5E58',
					category: 'Ônibus circular',
					lastShot: '11:31:20',
				},
				{
					title: 'M7190-05',
					status: 'in-yard',
					licensePlate: 'JKR24S8',
					category: 'Ônibus articulado',
					lastShot: '06:19:09',
				},
			],
		};
	},

	methods: {
		test() {
			console.log('eia a som eu');
		},
	},
}
</script>
