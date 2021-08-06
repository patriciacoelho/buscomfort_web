<template>
	<v-row class="ma-8" justify="space-between">
		<v-col cols="6">
			<h1 class="pcs-headline">
				<slot name="title">{{ title }}</slot>
			</h1>
			<h4 class="pcs-page-subtitle">
				<slot name="subtitle">{{ subtitle }}</slot>
			</h4>
		</v-col>
		<v-col
			cols="3"
			class="d-flex justify-end"
		>
			<slot name="action" />
		</v-col>
	</v-row>
</template>

<script>
export default {
	props: {
		title: {
			default: null,
		},
		subtitle: {
			default: null,
		},
	},
}
</script>

<style lang="scss" scoped>

</style>