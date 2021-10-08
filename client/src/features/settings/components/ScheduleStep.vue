<template>
	<div>
		<validation-observer ref="scheduleForm">
			<v-row class="mt-3">
				<v-col cols="2">
					<validation-provider
						v-slot="{ errors }"
						name="'dias da semana'"
						rules="required"
					>
						<v-select
							v-model="newSchedule.selectedDays"
							:items="weekDays"
							chips
							label="Dias da semana"
							placeholder="Selecione..."
							:error-messages="errors"
							multiple
							persistent-placeholder
							hide-details="auto"
							dense
							outlined
							required
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
										<span>{{ item.text }}</span>
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
					</validation-provider>
				</v-col>
				<v-col cols="1">
					<validation-provider
						v-slot="{ errors }"
						name=""
						rules="required"
					>
						<v-menu
							ref="start_time_menu"
							v-model="startTimeSelector"
							:close-on-content-click="false"
							:nudge-right="40"
							:return-value.sync="newSchedule.startTime"
							:error-messages="errors"
							transition="scale-transition"
							offset-y
							max-width="290px"
							min-width="290px"
							required
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="newSchedule.startTime"
									label="Hora inicial"
									placeholder="00:00"
									persistent-placeholder
									hide-details="auto"
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
					</validation-provider>
				</v-col>
				<v-col cols="1">
					<validation-provider
						v-slot="{ errors }"
						name=""
						rules="required"
					>
						<v-menu
							ref="end_time_menu"
							v-model="endTimeSelector"
							:close-on-content-click="false"
							:nudge-right="40"
							:return-value.sync="newSchedule.endTime"
							:error-messages="errors"
							transition="scale-transition"
							offset-y
							max-width="290px"
							min-width="290px"
							required
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="newSchedule.endTime"
									label="Hora final"
									placeholder="00:00"
									persistent-placeholder
									hide-details="auto"
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
					</validation-provider>
				</v-col>
				<v-col cols="3">
					<validation-provider
						v-slot="{ errors }"
						name="'motorista'"
						rules="required"
					>
						<v-autocomplete
							v-model="newSchedule.selectedDriver"
							:items="drivers"
							cache-items
							label="Motorista"
							placeholder="Selecione..."
							:error-messages="errors"
							persistent-placeholder
							hide-details="auto"
							no-data-text="Nenhum motorista encontrado"
							outlined
							dense
							required
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
					</validation-provider>
				</v-col>
				<v-col cols="3">
					<validation-provider
						v-slot="{ errors }"
						name="'rota'"
						rules="required"
					>
						<v-autocomplete
							v-model="newSchedule.selectedRoute"
							:items="routes"
							cache-items
							label="Rota"
							placeholder="Selecione..."
							:error-messages="errors"
							persistent-placeholder
							hide-details="auto"
							no-data-text="Nenhuma rota encontrada"
							outlined
							dense
							required
						>
							<template v-slot:selection="{ item }">
								<span>{{ item.prefix }} - {{ item.name}}</span>
							</template>
							<template v-slot:append-item>
								<v-btn
									plain
									color="blue"
									@click="registerRoute"
								>
									+ Cadastrar nova rota
								</v-btn>
							</template>
							<template v-slot:item="{ item }">
								<v-list-item-content>
									{{ item.prefix }} - {{ item.name }}
								</v-list-item-content>
							</template>
						</v-autocomplete>
					</validation-provider>
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
		</validation-observer>
		<v-row>
			<v-col cols="12">
				<schedules-table
					:items="filteredSchedules"
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

		<v-dialog
			v-model="dialogCreateDriver"
			max-width="500px"
			@click:outside="closeDriverDialog"
		>
			<v-card>
				<v-card-title class="text-h6">Cadastrar motorista</v-card-title>
				<v-card-text>
					<validation-observer ref="driverForm">
						<v-row class="mt-3">
							<v-col cols="12">
								<validation-provider
									v-slot="{ errors }"
									name="de nome do motorista"
									rules="required"
								>
									<v-text-field
										v-model="newDriver.name"
										label="Motorista"
										placeholder="Insira o nome do motorista"
										:error-messages="errors"
										persistent-placeholder
										hide-details="auto"
										outlined
										required
									/>
								</validation-provider>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12">
								<validation-provider
									v-slot="{ errors }"
									name="'CPF' do motorista"
									rules="required"
								>
									<v-text-field
										v-model="newDriver.cpf"
										label="CPF"
										placeholder="Insira o CPF do motorista"
										:error-messages="errors"
										persistent-placeholder
										hide-details="auto"
										outlined
										required
									/>
								</validation-provider>
							</v-col>
						</v-row>
					</validation-observer>
				</v-card-text>
				<v-card-actions>
					<v-btn color="red darken-1" text @click="closeDriverDialog">Cancelar</v-btn>
					<v-spacer />
					<v-btn color="success darken-1" text @click="createDriver">Salvar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog
			v-model="dialogCreateRoute"
			max-width="500px"
			@click:outside="closeRouteDialog"
		>
			<v-card>
				<v-card-title class="text-h6">Cadastrar rota</v-card-title>
				<v-card-text>
					<validation-observer ref="routeForm">
						<v-row class="mt-3">
							<v-col cols="4">
								<validation-provider
									v-slot="{ errors }"
									name="'prefixo'"
									rules="required"
								>
									<v-text-field
										v-model="newRoute.prefix"
										label="Prefixo"
										placeholder="A00"
										:error-messages="errors"
										persistent-placeholder
										hide-details="auto"
										outlined
										required
									/>
								</validation-provider>
							</v-col>
							<v-col cols="4">
								<validation-provider
									v-slot="{ errors }"
									name="de duração estimada"
									rules="numeric"
								>
									<v-text-field
										v-model="newRoute.estimatedTime"
										label="Duração estimada"
										placeholder="0 min"
										:error-messages="errors"
										persistent-placeholder
										hide-details="auto"
										outlined
									/>
								</validation-provider>
							</v-col>
							<v-col cols="4">
								<validation-provider
									v-slot="{ errors }"
									name="de distâcia estimada"
									rules="numeric"
								>
									<v-text-field
										v-model="newRoute.estimatedDistance"
										label="Distância estimada"
										placeholder="0 Km"
										:error-messages="errors"
										persistent-placeholder
										hide-details="auto"
										outlined
									/>
								</validation-provider>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12">
								<validation-provider
									v-slot="{ errors }"
									name="'descrição'"
									rules="required"
								>
									<v-text-field
										v-model="newRoute.name"
										label="Descrição"
										placeholder="Insira o nome da rota"
										:error-messages="errors"
										persistent-placeholder
										hide-details="auto"
										outlined
										required
									/>
								</validation-provider>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12">
								<v-text-field
									v-model="newRoute.spec"
									label="Especificação"
									placeholder="Insira a especificação da rota"
									persistent-placeholder
									hide-details="auto"
									outlined
								/>
							</v-col>
						</v-row>
						<!-- Remove startPoint e endPoint temporariamente (buscar endereço em API e retornar [lat, lng]) -->
						<!-- <v-row>
							<v-col cols="12">
								<v-text-field
									v-model="newRoute.startPoint"
									label="Ponto inicial"
									placeholder="Busque pelo endereço..."
									persistent-placeholder
									hide-details="auto"
									outlined
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12">
								<v-text-field
									v-model="newRoute.endPoint"
									label="Ponto final"
									placeholder="Busque pelo endereço..."
									persistent-placeholder
									hide-details="auto"
									outlined
								/>
							</v-col>
						</v-row> -->
					</validation-observer>
				</v-card-text>
				<v-card-actions>
					<v-btn color="red darken-1" text @click="closeRouteDialog">Cancelar</v-btn>
					<v-spacer />
					<v-btn color="success darken-1" text @click="createRoute">Salvar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import SchedulesTable from './SchedulesTable.vue';
import DriverService from '../../../services/DriverService';
import RouteService from '../../../services/RouteService';
import { WEEK_DAYS_OPTIONS } from '../../../core/constants/weekDays';

export default {
	components: {
		SchedulesTable,
	},

	props: {
		value: {
			type: Object,
			default: () => ({}),
			required: true,
		},
	},

	data() {
		return {
			weekDays: WEEK_DAYS_OPTIONS,
			searchDriver: null,
			drivers: [],
			searchRoute: null,
			routes: [],
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
		value: {
			handler(newValue) {
				if (!newValue.schedules || this.schedules === newValue.schedules) return;
				this.schedules = [ ...newValue.schedules ];
			},
			immediate: true,
		},

		schedules: {
			handler(newValue) {
				this.$emit('input', { ...this.value, schedules: newValue });
			},
		},

		dialogDelete (val) {
			val || this.closeDelete();
		},
	},

	computed: {
		filteredSchedules() {
			return this.schedules.filter((item) => {
				return item.active;
			})
		},
	},

	mounted() {
		this.getDrivers();
		this.getRoutes();
	},

	methods: {
		getDrivers() {
			DriverService.getAll()
				.then(response => {
					this.drivers = response.data;
				})
				.catch(e => console.log(e));
		},

		getRoutes() {
			RouteService.getAll()
				.then(response => {
					const routes = response.data;
					for (const i in routes) {
						this.routes.push(routes[i]);
					}
				})
				.catch(e => console.log(e));
		},

		addSchedule() {
			this.$refs.scheduleForm.validate().then(success => {
				if (!success) {
					return;
				}

				const schedule = {
						driver: this.newSchedule.selectedDriver,
						route: this.newSchedule.selectedRoute,
						days: this.newSchedule.selectedDays,
						time: {
							start: this.newSchedule.startTime,
							end: this.newSchedule.endTime,
						},
						active: true,
					};

				this.schedules.push(schedule);
				this.$refs.scheduleForm.reset();
				this.newSchedule = Object.assign({}, this.initSchedule);
			});
		},

		registerDriver() {
			this.dialogCreateDriver = true;
			this.newDriver = Object.assign({}, this.initDriver);
		},

		createDriver() {
			this.$refs.driverForm.validate().then(success => {
				if (!success) {
					return;
				}

				DriverService.create(this.newDriver)
					.then(({ data }) => {
						this.drivers.push(data);
						this.closeDriverDialog();
					})
					.catch(e => {
						console.log(e);
					});
			});
		},

		closeDriverDialog() {
			this.dialogCreateDriver = false;
			this.$refs.driverForm.reset();
		},

		registerRoute() {
			this.dialogCreateRoute = true;
			this.newRoute = Object.assign({}, this.initRoute);
		},

		createRoute() {
			this.$refs.routeForm.validate().then(success => {
				if (!success) {
					return;
				}

				RouteService.create(this.newRoute)
					.then(response => {
						const route = response.data;
						this.routes.push(route);
						this.closeRouteDialog();
					})
					.catch(e => {
						console.log(e);
					});
			});
		},

		closeRouteDialog() {
			this.dialogCreateRoute = false;
			this.$refs.routeForm.reset();
		},

		deleteSchedule(value) {
			this.dialogDelete = true;
			this.indexToDelete = value.index;
		},

		deleteItemConfirm () {
			const item = { ...this.schedules[this.indexToDelete], active: false };
			console.log(item);
			this.schedules.splice(this.indexToDelete, 1);
			if (item.id) {
				this.schedules.push(item);
			}
			this.closeDelete();
		},

		closeDelete () {
			this.dialogDelete = false;
			this.indexToDelete = -1;
		},
	},
}
</script>
