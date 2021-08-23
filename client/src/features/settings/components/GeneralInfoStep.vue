<template>
	<div>
		<v-row class="mt-3">
			<v-col cols="4">
				<v-text-field
					label="Identificação do ônibus"
					placeholder="Insira o prefixo de identificação para o ônibus"
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
			<v-col cols="4">
				<v-text-field
					label="Placa do veículo"
					placeholder="Insira a sequência da placa de identificação"
					persistent-placeholder
					hide-details
					outlined
				/>
			</v-col>
		</v-row>
		<v-row class="">
			<v-col cols="4">
				<v-select
					label="Categoria do ônibus"
					:items="categories"
					placeholder="Selecione uma categoria"
					persistent-placeholder
					hide-details
					outlined
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Object,
			default: () => ({}),
			required: true,
		},
	},

	data() {
		return {
			categories: [
				'Ônibus Circular',
				'Ônibus Padron',
				'Ônibus Articulado',
				'Ônibus Linha Direta',
			],
		};
	},
}
</script>
