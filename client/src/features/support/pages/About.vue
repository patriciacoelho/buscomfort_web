<template>
	<v-col
		class="pa-0 mb-12"
		cols="12"
		md="9"
	>
		<page-header
			title="Sobre o projeto"
			subtitle="Saiba mais sobre o projeto, desde a idealização até o desenvolvimento dessa aplicação"
		/>
		<v-row class="mx-8 justify-center">
			<v-col cols="12" md="8">
				<v-img src="/logo.png" />
			</v-col>
		</v-row>
		<v-row class="mx-8 mt-8">
			<p>
				O busComfort é um sistema embarcado para monitoramento do conforto dos ônibus do transporte público,
				desenvolvido por alunos da Universidade Federal do São Francisco (UNIVASF) para a competição de sistemas
				embarcados realizada no IX Brazilian Symposium on Computing Systems Engineering. O propósito desse projeto
				é desenvolver um sistema que monitore o conforto do usuário de ônibus, permitindo supervisionar o veículo
				durante todo o percurso e que permita identificar quando o motorista ou as condições das ruas/avenidas
				possam causar algum acidente ou desconforto para o passageiro.
			</p>
		</v-row>
		<v-row class="mx-8 mt-8">
			<h4 class="pcs-page-subtitle">> Conheça o time envolvido no desenvolvimento do projeto</h4>
			<v-row class="mt-4 text-center">
				<v-col cols="12" md="4">
					<v-img class="mx-auto" width="240" src="/patricia.png" />
					<span class="pcs-subtitle font-weight-bold">Patrícia Coelho Silva</span>
				</v-col>
				<v-col cols="12" md="4">
					<v-img class="mx-auto" width="240" src="/ricardo.png" />
					<span class="pcs-subtitle font-weight-bold">Ricardo Valério T. de Medeiros Silva</span>
				</v-col>
				<v-col cols="12" md="4">
					<v-img class="mx-auto" width="240" src="/ruan.png" />
					<span class="pcs-subtitle font-weight-bold">Ruan de Medeiros Bahia</span>
				</v-col>
			</v-row>
		</v-row>
		<v-row class="mx-8 mt-8">
			<h4 class="pcs-page-subtitle">> O busComfort em evidência</h4>
			<v-row class="mt-4 text-center">
				<v-col cols="12" md="4">
					<v-img class="mx-auto" width="160" src="/medal.png" />
					<span class="pcs-subtitle">Finalista na Macnica DHW & Analog Devices IoT Challenge</span>
				</v-col>
				<v-col cols="12" md="4">
					<v-img class="mx-auto" width="160" src="/third-place.png" />
					<span class="pcs-subtitle">3º lugar na II Mostra de Inovação do SCIENTEX</span>
				</v-col>
				<v-col cols="12" md="4">
					<v-img class="mx-auto" width="160" src="/tcc-paper.png" />
					<span class="pcs-subtitle">Objeto de estudo de Trabalhos de Conclusão de Curso</span>
				</v-col>
			</v-row>
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
