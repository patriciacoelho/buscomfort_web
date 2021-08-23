<template>
	<div>
		<v-row class="mt-3">
			<v-col cols="4">
				<v-text-field
					label="UID do módulo"
					placeholder="Insira o UID do módulo embarcado no ônibus"
					persistent-placeholder
					hide-details
					outlined
				/>
			</v-col>
			<v-col cols="4">
				<v-text-field
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
				<v-text-field
					label="Rede"
					placeholder="Insira o número da rede"
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
								Rede mesh na qual o módulo embarcado está configurada
							</span>
						</v-tooltip>
					</template>
				</v-text-field>
			</v-col>
			<v-col cols="4">
				<v-text-field
					label="ID de rede"
					placeholder="Insira o NET ID do módulo"
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
		<v-row class="mt-3">
			<v-col cols="4">
				<v-text-field
					label="Data de instalação"
					placeholder="00/00/0000"
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
			//
		};
	},
}
</script>
