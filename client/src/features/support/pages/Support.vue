<template>
	<v-col
		class="pa-0 mb-12"
		cols="12"
		md="9"
	>
		<page-header
			title="Suporte"
			subtitle="Para saber mais sobre a aplicação e o projeto busComfort ou fazer críticas e sugestões"
		/>
		<v-row class="mx-8 justify-center">
			<v-col cols="12" md="8">
				<v-img class="mx-auto" width="430" src="/support.png" />
			</v-col>
		</v-row>
		<v-row class="mx-8 mt-8">
			<v-col cols="12" md="6">
				<h4 class="pcs-page-subtitle mb-6">
					> Tem alguma crítica em relação a aplicação e deseja relatar algum problema ou dar uma sugestão?
				</h4>
				<span class="pcs-subtitle">
					Acesse a página de issues do repositório e
					<a target="_blank" href="https://gitlab.com/patricia_coelho/buscomfort_web/-/issues/new">
						crie uma nova issue
					</a>.
				</span>
			</v-col>
			<v-col cols="12" md="6">
				<h4 class="pcs-page-subtitle mb-6">
					> Quer saber mais sobre o projeto e a aplicação?
				</h4>
				<span class="pcs-subtitle">
					Entre em contato com o email: buscomfort.software@gmail.com
				</span>
			</v-col>
		</v-row>
	</v-col>
</template>

<script>
import PageHeader from '../../../core/components/PageHeader.vue';

export default {
	components: {
		PageHeader
	},
}
</script>
