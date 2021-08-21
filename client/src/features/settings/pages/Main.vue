<template>
	<v-col
		class="pa-0"
		cols="9"
	>
		<page-header
			title="Configurações dos ônibus"
			subtitle="Selecione um ônibus na lista de ônibus cadastrados para editar as informações"
		>
			<template v-slot:action>
				<v-btn
					class="px-8"
					rounded
					color="primary"
					dark
					@click="redirectToForm"
				>
					<box-icon class="mr-2" name="plus" color="white" />
					Adicionar ônibus
				</v-btn>
			</template>
		</page-header>
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
						expandable
						@click="test"
						@action-trigger="test"
					>
						<template v-slot:icon>
							<v-img
								max-height="50"
								max-width="50"
								:src="`/${item.status}-marker.png`"
							/>
						</template>
						<template v-slot:subtitle>
							<p>Rota: {{ item.routeAlias }}</p>
							<p>Motorista: {{ item.driverName }}</p>
						</template>
						<template v-slot:append-details>
							<p>Detalhes da rota: {{ item.routeSpec }}</p>
							<p>Duração da rota: {{ item.estimatedDuration }}</p>
							<p>UID do módulo embarcado:  {{ item.uid }}</p>
						</template>
						<template v-slot:right-slot>
							<div class="d-flex flex-column">
								<div class="d-flex">
									<p>
										REDE #<span>{{ item.networkCode }}</span>
									</p>
								</div>
								<div class="d-flex">
									<p>
										NET-ID: <span>{{ item.networkId }}</span>
									</p>
								</div>
							</div>
						</template>
						<template v-slot:action>
							EDITAR INFORMAÇÕES
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
					title: 'ÔNIBUS N7511-10',
					status: 'watching',
					routeAlias: 'Term. São Mateus',
					routeSpec: 'Via Av. Sapopemba (10 paradas)',
					driverName: 'Marcus Luiz',
					estimatedDuration: '45 minutos',
					uid: '0042',
					networkCode: '0020',
					networkId: '243',
				},
				{
					title: 'ÔNIBUS NB519-12',
					status: 'no-signal',
					routeAlias: 'Consolação',
					routeSpec: 'Via Av. Sapopemba (10 paradas)',
					driverName: 'Marcus Luiz',
					estimatedDuration: '45 minutos',
					uid: '0042',
					networkCode: '0020',
					networkId: '127',
				},
				{
					title: 'ÔNIBUS M7190-05',
					status: 'in-yard',
					routeAlias: 'Itaquera',
					routeSpec: 'Via Av. Sapopemba (10 paradas)',
					driverName: 'Marcus Luiz',
					estimatedDuration: '45 minutos',
					uid: '0042',
					networkCode: '0020',
					networkId: '042',
				},
			],
		};
	},

	methods: {
		redirectToForm() {
			this.$router.push('/configuracoes/novo');
		},

		test() {
			console.log('eia a som eu');
		},
	},
}
</script>