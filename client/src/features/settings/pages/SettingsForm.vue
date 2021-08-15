<template>
	<v-col
		class="pa-0"
		cols="9"
	>
		<page-header
			title="Configurações dos ônibus"
			subtitle="Insira as informações a serem editadas/cadastradas e depois clique em salvar"
		/>
		<v-row class="mx-8">
			<v-col cols="12">
				<custom-stepper v-model="currentStep" :steps="steps">
					<template v-slot:step-1>
						<v-row class="mt-3">
							<v-col cols="8">
								<v-text-field
									label="Identificação do ônibus"
									placeholder="Insira um código de identificação para o ônibus"
									persistent-placeholder
									hide-details
									outlined
								>
									<template v-slot:append>
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<box-icon
													class="cursor-pointer"
													name="help-circle"
													color="#6A7580"
													v-bind="attrs"
													v-on="on"
												/>
											</template>
											<span>Nome pelo qual o ônibus será identificado no sistema</span>
										</v-tooltip>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row class="">
							<v-col cols="9">
								<v-text-field
									label="Descrição da rota"
									placeholder="Insira uma descrição para a rota"
									persistent-placeholder
									hide-details
									outlined
								>
									<template v-slot:append>
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<box-icon
													class="cursor-pointer"
													name="help-circle"
													color="#6A7580"
													v-bind="attrs"
													v-on="on"
												/>
											</template>
											<span>Descrição da rota que ônibus faz. Geralmente presente no letreiro.</span>
										</v-tooltip>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row class="">
							<v-col cols="9">
								<v-text-field
									label="Especificação da rota"
									placeholder="Insira a especificação para a rota"
									persistent-placeholder
									hide-details
									outlined
								>
									<template v-slot:append>
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<box-icon
													class="cursor-pointer"
													name="help-circle"
													color="#6A7580"
													v-bind="attrs"
													v-on="on"
												/>
											</template>
											<span>
												Especifica qual percurso da rota.
												Geralmente usado para diferenciar ônibus
												com mesmo destino mas rotas diferentes.
											</span>
										</v-tooltip>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row class="">
							<v-col cols="9">
								<v-text-field
									label="Motorista"
									placeholder="Insira o nome do motorista designado"
									persistent-placeholder
									hide-details
									outlined
								/>
							</v-col>
						</v-row>

						<v-row class="">
							<v-col class="ml-auto text-right" cols="3">
								<v-btn
									class="px-8"
									rounded
									color="primary"
									dark
								>
									Próximo
								</v-btn>
							</v-col>
						</v-row>
					</template>
					<template v-slot:step-2>
						RouteSettingMap
					</template>
					<template v-slot:step-3>
						<v-row class="mt-3">
							<v-col cols="8">
								<v-text-field
									label="UID do módulo embarcado"
									placeholder="Insira o UID do módulo embarcado no ônibus"
									persistent-placeholder
									hide-details
									outlined
								>
									<template v-slot:append>
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<box-icon
													class="cursor-pointer"
													name="help-circle"
													color="#6A7580"
													v-bind="attrs"
													v-on="on"
												/>
											</template>
											<span>
												UID da placa embarcada no ônibus especificado
											</span>
										</v-tooltip>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="8">
								<v-text-field
									label="ID de rede do módulo embarcado"
									placeholder="Insira o NET ID do módulo embarcado no ônibus"
									persistent-placeholder
									hide-details
									outlined
								>
									<template v-slot:append>
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<box-icon
													class="cursor-pointer"
													name="help-circle"
													color="#6A7580"
													v-bind="attrs"
													v-on="on"
												/>
											</template>
											<span>
												ID da rede mesh configurada para o módulo embarcado
											</span>
										</v-tooltip>
									</template>
								</v-text-field>
							</v-col>
						</v-row>

						<v-row class="">
							<v-col class="" cols="3">
								<v-btn
									class="px-8"
									rounded
									color="primary"
									dark
									outlined
								>
									Voltar
								</v-btn>
							</v-col>
							<v-col class="ml-auto text-right" cols="3">
								<v-btn
									class="px-8"
									rounded
									color="primary"
									dark
								>
									Salvar
								</v-btn>
							</v-col>
						</v-row>
					</template>
				</custom-stepper>
			</v-col>
		</v-row>
	</v-col>
</template>

<script>
import PageHeader from '../../../core/components/PageHeader.vue';
import CustomStepper from '../../../core/components/CustomStepper.vue';

export default {
	components: {
		CustomStepper,
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
}
</script>
