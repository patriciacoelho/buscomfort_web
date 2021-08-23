<template>
	<div>
		<v-row class="mt-3">
			<v-col cols="2">
				<v-select
					v-model="newSchedule.selectedDays"
					:items="weekDays"
					chips
					label="Dias da semana"
					placeholder="Selecione..."
					multiple
					persistent-placeholder
					hide-details
					dense
					outlined
				>
					<template v-slot:selection="{ item, index }">
						<div v-if="newSchedule.selectedDays.length === weekDays.length">
							<span v-if="index === 0">
								Todos
							</span>
						</div>
						<div v-else>
							<v-chip
								v-if="index === 0"
								small
							>
								<span>{{ item }}</span>
							</v-chip>
							<span
								v-if="index === 1"
								class="grey--text text-caption"
							>
								(+{{ newSchedule.selectedDays.length - 1 }} outros)
							</span>
						</div>
					</template>
				</v-select>
			</v-col>
			<v-col cols="1">
				<v-menu
					ref="start_time_menu"
					v-model="startTimeSelector"
					:close-on-content-click="false"
					:nudge-right="40"
					:return-value.sync="newSchedule.startTime"
					transition="scale-transition"
					offset-y
					max-width="290px"
					min-width="290px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="newSchedule.startTime"
							label="Hora inicial"
							placeholder="00:00"
							persistent-placeholder
							hide-details
							outlined
							dense
							readonly
							v-bind="attrs"
							v-on="on"
						/>
					</template>
					<v-time-picker
						v-if="startTimeSelector"
						v-model="newSchedule.startTime"
						format="24hr"
						full-width
						@click:minute="$refs.start_time_menu.save(newSchedule.startTime)"
					/>
				</v-menu>
			</v-col>
			<v-col cols="1">
				<v-menu
					ref="end_time_menu"
					v-model="endTimeSelector"
					:close-on-content-click="false"
					:nudge-right="40"
					:return-value.sync="newSchedule.endTime"
					transition="scale-transition"
					offset-y
					max-width="290px"
					min-width="290px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="newSchedule.endTime"
							label="Hora final"
							placeholder="00:00"
							persistent-placeholder
							hide-details
							outlined
							dense
							readonly
							v-bind="attrs"
							v-on="on"
						/>
					</template>
					<v-time-picker
						v-if="endTimeSelector"
						v-model="newSchedule.endTime"
						format="24hr"
						full-width
						@click:minute="$refs.end_time_menu.save(newSchedule.endTime)"
					/>
				</v-menu>
			</v-col>
			<v-col cols="3">
				<v-autocomplete
					v-model="newSchedule.selectedDriver"
					:loading="loadingDriverOptions"
					:items="driverOptions"
					:search-input.sync="searchDriver"
					cache-items
					label="Motorista"
					placeholder="Selecione..."
					persistent-placeholder
					hide-details
					no-data-text="Nenhum motorista encontrado"
					outlined
					dense
				>
					<template v-slot:selection="{ item }">
						<span v-text="item.name" />
					</template>
					<template v-slot:append-item>
						<v-btn
							plain
							color="blue"
							@click="registerDriver"
						>
							+ Cadastrar novo motorista
						</v-btn>
					</template>
					<template v-slot:item="{ item }">
						<v-list-item-content>
							<v-list-item-title v-text="item.name" />
							<v-list-item-subtitle v-text="item.cpf" />
						</v-list-item-content>
					</template>
				</v-autocomplete>
			</v-col>
			<v-col cols="3">
				<v-autocomplete
					v-model="newSchedule.selectedRoute"
					:loading="loadingRouteOptions"
					:items="routeOptions"
					:search-input.sync="searchRoute"
					cache-items
					label="Rota"
					placeholder="Selecione..."
					persistent-placeholder
					hide-details
					no-data-text="Nenhuma rota encontrada"
					outlined
					dense
				>
					<template v-slot:append-item>
						<v-btn
							plain
							color="blue"
							@click="registerRoute"
						>
							+ Cadastrar nova rota
						</v-btn>
					</template>
				</v-autocomplete>
			</v-col>
			<v-col cols="1">
				<v-btn
					color="primary"
					fab
					depressed
					small
					@click="addSchedule"
				>
					<box-icon class="pr-1" name="plus" color="white" />
				</v-btn>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<schedules-table
					:items="schedules"
					@deletion="deleteSchedule"
				/>
				<v-dialog v-model="dialogDelete" max-width="500px">
					<v-card>
						<v-card-title class="text-h6">Tem certeza que deseja remover esta escala da lista?</v-card-title>
						<v-card-actions>
							<v-btn color="red darken-1" text @click="closeDelete">Cancelar</v-btn>
							<v-spacer />
							<v-btn color="blue darken-1" text @click="deleteItemConfirm">Confirmar</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-col>
		</v-row>

		<v-dialog v-model="dialogCreateDriver" max-width="500px">
			<v-card>
				<v-card-title class="text-h6">Cadastrar motorista</v-card-title>
				<v-card-text>
					<v-row class="mt-3">
						<v-col cols="12">
							<v-text-field
								label="Motorista"
								placeholder="Insira o nome do motorista"
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-text-field
								label="CPF"
								placeholder="Insira o CPF do motorista"
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-btn color="red darken-1" text @click="dialogCreateDriver = false">Cancelar</v-btn>
					<v-spacer />
					<v-btn color="success darken-1" text @click="createDriver">Salvar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogCreateRoute" max-width="500px">
			<v-card>
				<v-card-title class="text-h6">Cadastrar rota</v-card-title>
				<v-card-text>
					<v-row class="mt-3">
						<v-col cols="4">
							<v-text-field
								label="Prefixo"
								placeholder="A00"
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
						<v-col cols="4">
							<v-text-field
								label="Duração estimada"
								placeholder="0 min"
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
						<v-col cols="4">
							<v-text-field
								label="Distância estimada"
								placeholder="0 Km"
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-text-field
								label="Descrição"
								placeholder="Insira o nome da rota"
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-text-field
								label="Especificação"
								placeholder="Insira a especificação da rota"
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-text-field
								label="Ponto inicial"
								placeholder="Busque pelo endereço..."
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-text-field
								label="Ponto final"
								placeholder="Busque pelo endereço..."
								persistent-placeholder
								hide-details
								outlined
							/>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-btn color="red darken-1" text @click="dialogCreateRoute = false">Cancelar</v-btn>
					<v-spacer />
					<v-btn color="success darken-1" text @click="createRoute">Salvar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import SchedulesTable from './SchedulesTable.vue';

export default {
	components: {
		SchedulesTable,
	},

	data() {
		return {
			weekDays: [
				'Segunda',
				'Terça',
				'Quarta',
				'Quinta',
				'Sexta',
				'Sábado',
				'Domingo',
			],
			searchDriver: null,
			drivers: [
				{
					name: 'Luis Marcos',
					cpf: '013.559.353-00',
				},
				{
					name: 'Marcio Felipe',
					cpf: '659.264.353-30',
				},
				{
					name: 'Clara Maria',
					cpf: '059.274.153-02',
				},
			],
			driverOptions: [],
			loadingDriverOptions: false,
			searchRoute: null,
			routes: [
				'N93 - Jardim Vitória',
				'B13 - Jardim Oceania',
				'H22 - Pedregal/Centro',
			],
			routeOptions: [],
			loadingRouteOptions: false,
			startTimeSelector: false,
			endTimeSelector: false,
			schedules: [],
			initSchedule: {
				selectedDays: [],
				selectedDriver: null,
				selectedRoute: null,
				startTime: null,
				endTime: null,
			},
			newSchedule: {
				selectedDays: [],
				selectedDriver: null,
				selectedRoute: null,
				startTime: null,
				endTime: null,
			},
			initDriver: {
				name: null,
				cpf: null,
			},
			newDriver: {
				name: null,
				cpf: null,
			},
			initRoute: {
				startPoint: null,
				endPoint: null,
				estimatedDistance: null,
				estimatedTime: null,
				prefix: null,
				name: null,
				spec: null,
			},
			newRoute: {
				startPoint: null,
				endPoint: null,
				estimatedDistance: null,
				estimatedTime: null,
				prefix: null,
				name: null,
				spec: null,
			},
			dialogDelete: false,
			indexToDelete: -1,
			dialogCreateDriver: false,
			dialogCreateRoute: false,
		};
	},

	watch: {
		searchDriver (newValue) {
			newValue && newValue !== this.selectedDriver && this.driverQuerySelections(newValue);
		},

		searchRoute (newValue) {
			newValue && newValue !== this.selectedRoute && this.routeQuerySelections(newValue);
		},

		dialogDelete (val) {
			val || this.closeDelete();
		},
	},

	methods: {
		driverQuerySelections () {
			this.loadingDriverOptions = true;

			setTimeout(() => {
				this.driverOptions = this.drivers;
				this.loadingDriverOptions = false;
			}, 500)
		},

		routeQuerySelections (v) {
			this.loadingRouteOptions = true;
			// Simulated ajax query
			setTimeout(() => {
				this.routeOptions = this.routes.filter(e => {
					return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
				})
				this.loadingRouteOptions = false;
			}, 500)
		},

		addSchedule() {
			this.schedules.push(
				{
					driver: this.newSchedule.selectedDriver,
					route: this.newSchedule.selectedRoute,
					days: this.newSchedule.selectedDays,
					time: {
						start: this.newSchedule.startTime,
						end: this.newSchedule.endTime,
					},
				}
			);
			this.newSchedule = Object.assign({}, this.initSchedule)
		},

		registerDriver() {
			this.dialogCreateDriver = true;
			this.newDriver = Object.assign({}, this.initDriver);
		},

		createDriver() {
			// do something
			this.dialogCreateDriver = false;
		},

		registerRoute() {
			this.dialogCreateRoute = true;
			this.newRoute = Object.assign({}, this.initRoute);
		},

		createRoute() {
			// do something
			this.dialogCreateRoute = false;
		},

		deleteSchedule(value) {
			this.dialogDelete = true;
			this.indexToDelete = value.index;
		},

		deleteItemConfirm () {
			this.schedules.splice(this.indexToDelete, 1);
			this.closeDelete();
		},

		closeDelete () {
			this.dialogDelete = false;
			this.indexToDelete = -1;
		},
	},
}
</script>
