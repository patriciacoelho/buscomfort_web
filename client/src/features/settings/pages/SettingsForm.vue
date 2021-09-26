<template>
	<v-col
		class="pa-0"
		cols="12"
	>
		<page-header
			class="col col-9"
			title="Configurações dos ônibus"
			subtitle="Insira as informações a serem editadas/cadastradas e depois clique em salvar"
		/>
		<v-row class="mx-8">
			<v-col cols="12">
				<custom-stepper v-model="currentStep" :steps="steps">
					<template v-slot:step-1>
						<general-info-step
							v-model="form"
							:validate="validateStep === 1"
							@validate-status="handleAdvance"
						/>
					</template>
					<template v-slot:step-2>
						<schedule-step v-model="form" />
					</template>
					<template v-slot:step-3>
						<module-step
							v-model="form"
							:validate="validateStep === 3"
							@validate-status="handleAdvance"
						/>
					</template>
				</custom-stepper>
			</v-col>
		</v-row>

		<v-footer
			fixed
			padless
			color="white"
			class="footer-container px-16 mt-16"
		>
			<v-btn
				class="px-8 mx-16"
				rounded
				color="red"
				outlined
				:disabled="loading"
				@click="handleCancel"
				@mousedown.prevent
			>
				Cancelar
			</v-btn>

			<div class="d-flex">
				<v-btn
					v-if="currentStep > 1"
					class="px-8 mr-4"
					rounded
					color="secondary"
					outlined
					:disabled="loading"
					@click="handleReturn"
				>
					Anterior
				</v-btn>
				<v-btn
					class="px-8"
					rounded
					color="primary"
					:disabled="loading"
					@click="handleNext"
					@mousedown.prevent
				>
					<div v-if="loading">
						<v-progress-circular
							class="mr-2"
							indeterminate
							size="20"
							width="2"
							color="grey"
						/>
						Carregando...
					</div>
					<span v-else>
						{{ confirmButtonLabel }}
					</span>
				</v-btn>
			</div>
		</v-footer>
	</v-col>
</template>

<script>
import PageHeader from '../../../core/components/PageHeader.vue';
import CustomStepper from '../../../core/components/CustomStepper.vue';
import GeneralInfoStep from '../components/GeneralInfoStep.vue';
import ModuleStep from '../components/ModuleStep.vue';
import ScheduleStep from '../components/ScheduleStep.vue';
import BusService from '../../../services/BusService';

export default {
	components: {
		CustomStepper,
		PageHeader,
		GeneralInfoStep,
		ModuleStep,
		ScheduleStep,
	},

	props: {
		bus: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			currentStep: 1,
			validateStep: -1,
			loading: false,
			form: {},
			steps: [
				{
					title: 'Informações gerais',
					name: 'general-step',
				},
				{
					title: 'Definição das escalas',
					name: 'schedule-step',
				},
				{
					title: 'Configuração do módulo',
					name: 'module-step',
				},
			],
		};
	},

	mounted() {
		if (this.bus) {
			this.getBus();
		}
	},

	computed: {
		confirmButtonLabel() {
			if (this.currentStep === this.steps.length) {
				return 'Finalizar';
			}
			return 'Próximo';
		},
	},

	methods: {
		getBus() {
			BusService.get(this.bus)
				.then(response => {
					this.form = response.data;
				})
				.catch(e => {
					console.log(e);
				});
		},

		createBus() {
			let schedules = [];
			for (const i in this.form.schedules) {
				schedules.push({
					...this.form.schedules[i],
					driver: this.form.schedules[i].driver.id,
					route: this.form.schedules[i].route.id,
				});
			}

			BusService.create({ ...this.form, schedules })
				.then(() => {
					this.loading = false;
					this.$router.push('/configuracoes');
				})
				.catch(e => {
					console.log(e);
				});
		},

		updateBus() {
			let schedules = [];
			for (const i in this.form.schedules) {
				schedules.push({
					...this.form.schedules[i],
					driver: this.form.schedules[i].driver.id || this.form.schedules[i].driver._id,
					route: this.form.schedules[i].route.id || this.form.schedules[i].route._id,
				});
			}

			BusService.update(this.bus, { ...this.form, schedules })
				.then(() => {
					this.loading = false;
					this.$router.push('/configuracoes');
				})
				.catch(e => {
					console.log(e);
				});
		},

		handleAdvance(valid) {
			if (valid) {
				if (this.currentStep >= this.steps.length) {
					if (!this.bus) {
						this.createBus();
						return;
					}
					this.updateBus();
					return;
				}
				this.currentStep += 1;
			}
				this.validateStep = -1;
				this.loading = false;
		},

		handleNext() {
			this.loading = true;
			if (this.currentStep === 2) {
				this.handleAdvance(true);
				return
			}
			this.validateStep = this.currentStep;
		},

		handleReturn() {
			this.currentStep -= 1;
		},

		handleCancel() {
			this.$router.push('/configuracoes');
		},
	},
}
</script>

<style lang="scss" scoped>
.footer-container {
	padding-top: 1.5rem;
	padding-bottom: 1.5rem;
	display: flex;
	justify-content: space-between;
}
</style>
