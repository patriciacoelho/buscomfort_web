<template>
	<validation-observer ref="generalInfoStep">
		<v-row class="mt-3">
			<v-col cols="4">
				<validation-provider
					v-slot="{ errors }"
					name="de identificação do ônibus"
					rules="required|max:10"
				>
					<v-text-field
						v-model="generalInfoForm.prefixCode"
						label="Identificação do ônibus"
						placeholder="Insira o prefixo de identificação para o ônibus"
						:error-messages="errors"
						persistent-placeholder
						hide-details="auto"
						required
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
				</validation-provider>
			</v-col>
		</v-row>
		<v-row class="">
			<v-col cols="4">
				<validation-provider
					v-slot="{ errors }"
					name="'placa do veículo'"
					rules="max:8"
				>
					<v-text-field
						v-model="generalInfoForm.licensePlate"
						label="Placa do veículo"
						placeholder="Insira a sequência da placa de identificação"
						:error-messages="errors"
						persistent-placeholder
						hide-details="auto"
						outlined
					/>
				</validation-provider>
			</v-col>
		</v-row>
		<v-row class="">
			<v-col cols="4">
				<v-select
					v-model="generalInfoForm.category"
					label="Categoria do ônibus"
					:items="categories"
					placeholder="Selecione uma categoria"
					persistent-placeholder
					hide-details
					outlined
				/>
			</v-col>
		</v-row>
	</validation-observer>
</template>

<script>
export default {
	props: {
		value: {
			type: Object,
			default: () => ({}),
			required: true,
		},
		validate: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			generalInfoForm: {},
			categories: [
				'Ônibus Circular',
				'Ônibus Padron',
				'Ônibus Articulado',
				'Ônibus Linha Direta',
			],
			errors: [],
		};
	},

	watch: {
		value: {
			handler(newValue) {
				this.generalInfoForm = newValue;
			},
			immediate: true,
		},
		validate: {
			handler(newValue) {
				if (newValue) {
					this.$refs.generalInfoStep.validate()
						.then((success) => {
							this.$emit('validate-status', success);
						});
				}
			},
			immediate: true,
		},
	},
}
</script>
