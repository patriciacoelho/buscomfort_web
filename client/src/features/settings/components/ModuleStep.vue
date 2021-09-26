<template>
	<validation-observer ref="moduleStep">
		<v-row class="mt-3">
			<v-col cols="4">
				<v-text-field
					v-model="moduleForm.uid"
					label="UID do módulo"
					placeholder="Insira o UID do módulo embarcado no ônibus"
					persistent-placeholder
					hide-details
					outlined
				/>
			</v-col>
			<v-col cols="4">
				<v-text-field
					v-model="moduleForm.model"
					label="Modelo da placa"
					placeholder="Insira o modelo da placa de comunicação"
					persistent-placeholder
					hide-details
					outlined
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="4">
				<validation-provider
					v-slot="{ errors }"
					name="'rede'"
					rules="required|numeric"
				>
					<v-text-field
						v-model="moduleForm.network"
						label="Rede"
						placeholder="Insira o número da rede"
						:error-messages="errors"
						hide-details="auto"
						persistent-placeholder
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
									Rede mesh na qual o módulo embarcado está configurada
								</span>
							</v-tooltip>
						</template>
					</v-text-field>
				</validation-provider>
			</v-col>
			<v-col cols="4">
				<validation-provider
					v-slot="{ errors }"
					name="'ID de rede'"
					rules="required|numeric"
				>
					<v-text-field
						v-model="moduleForm.netId"
						label="ID de rede"
						placeholder="Insira o NET ID do módulo"
						:error-messages="errors"
						hide-details="auto"
						persistent-placeholder
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
				</validation-provider>
			</v-col>
		</v-row>
		<!-- <v-row class="mt-3">
			<v-col cols="4">
				<v-text-field
					label="Data de instalação"
					placeholder="00/00/0000"
					persistent-placeholder
					hide-details
					outlined
				/>
			</v-col>
		</v-row> -->
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
			moduleForm: {},
			errors: [],
		};
	},

	watch: {
		value: {
			handler(newValue) {
				this.moduleForm = newValue;
			},
			immediate: true,
		},
		validate: {
			handler(newValue) {
				if (newValue) {
					this.$refs.moduleStep.validate()
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
