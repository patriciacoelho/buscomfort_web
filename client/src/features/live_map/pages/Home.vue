<template>
	<v-col
		class="pa-0 mb-12"
		cols="12"
	>
		<v-row class="mx-8 justify-center">
			<v-col cols="12" md="8">
				<v-img src="/logo.png" />
			</v-col>
		</v-row>
		<v-row class="mx-8 mt-8 justify-center">
			<h2 class="pcs-headline dark--text">Uma Aplicação Web para Monitorar o Conforto em Transportes Públicos</h2>
		</v-row>
		<v-row class="mx-8 mt-12 justify-center">
			<!-- <v-col cols="12" md="4"> -->
				<v-btn
					class="px-8 mx-4"
					rounded
					outlined
					height="40"
					color="primary"
					dark
					@click="redirectToAbout"
				>
					Sobre o projeto
				</v-btn>
				<!-- <v-btn
					class="px-8 mx-4"
					rounded
					height="40"
					color="primary"
					dark
				>
					Conheça a aplicação
				</v-btn> -->
				<v-btn
					class="px-8 mx-4"
					rounded
					height="40"
					color="accent"
					dark
					target="_blank"
					href="https://gitlab.com/patricia_coelho/buscomfort_web"
				>
					<box-icon class="mr-2" type="logo" name="gitlab" color="white" />
					GitLab
				</v-btn>
			<!-- </v-col> -->
		</v-row>
	</v-col>
</template>

<script>
export default {
	methods: {
		redirectToAbout() {
			this.$router.push('/sobre');
		},
	}
}
</script>
