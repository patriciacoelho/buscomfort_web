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
			<!-- <div>
				<list-item
					title="ÔNIBUS N7511-10"
					expandable
					@click="test"
					@action-trigger="test"
				>
					<template v-slot:icon>
						<v-img
							max-height="50"
							max-width="50"
							:src="'/mark-bus.png'"
						/>
					</template>
					<template v-slot:subtitle>
						<p>Rota: Term. São Mateus</p>
						<p>Motorista: Marcus Luiz</p>
					</template>
					<template v-slot:append-details>
						<p>Detalhes da rota:  Via Av. Sapopemba (10 paradas)</p>
						<p>Duração da rota:  45 minutos</p>
						<p>UID do módulo embarcado:  0042</p>
					</template>
					<template v-slot:right-slot>
						<p class="text-right">
							ÚLTIMA TRANSMISSÃO <br>
							<span>14:58:06</span>
						</p>
					</template>
					<template v-slot:action>
						EDITAR INFORMAÇÕES
					</template>
				</list-item>
			</div> -->
		</v-col>
	</div>
</template>

<script>
import PageHeader from '../../../core/components/PageHeader.vue';
// import CustomStepper from '../../../core/components/CustomStepper.vue';
// import ListItem from '../../../core/components/ListItem.vue';

export default {
	components: {
		// ListItem,
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
		test() {
			console.log('eia a som eu');
		}
	},
}
</script>
