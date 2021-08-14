<template>
	<div>
		<page-header
			title="Histórico dos dados coletados"
			subtitle="Selecione um ônibus na lista de ônibus cadastrados para visualizar o histórico"
		/>
		<v-col cols="9">
			<!-- <custom-stepper v-model="currentStep" :steps="steps">
				<template v-slot:step-1>
					Passo 1
				</template>
				<template v-slot:step-2>
					Passo 2
				</template>
				<template v-slot:step-3>
					Passo 3
				</template>
			</custom-stepper> -->
		</v-col>
	</div>
</template>

<script>
import PageHeader from '../../../core/components/PageHeader.vue';
// import CustomStepper from '../../../core/components/CustomStepper.vue';

export default {
	components: {
		// CustomStepper,
		PageHeader,
	},

	data() {
		return {
			currentStep: 1,
			steps: [
				{
					title: 'Informações gerais',
					name: 'general-step',
				},
				{
					title: 'Definição da rota',
					name: 'route-step',
				},
				{
					title: 'Configuração do módulo',
					name: 'module-step',
				},
			],
		};
	},

	methods: {
		//
	},
}
</script>
