<template>
	<v-data-table
		:items="items"
		:headers="headers"
		hide-default-footer
		disable-pagination
		locale="pt-BR"
		sort-by="route"
		no-data-text="Nenhuma escala definida"
	>
		<template v-slot:item.days="{ item }">
			<v-chip
				v-for="(day, index) in item.days"
				:key="`day-${index}`"
				small
				class="mr-2"
			>
				{{ WEEK_DAYS_TEXT[day] }}
			</v-chip>
		</template>
		<template v-slot:item.time="{ item }">
			<span>
				{{ item.time.start }} - {{ item.time.end }}
			</span>
		</template>
		<template v-slot:item.driver="{ item }">
			<v-list-item-content>
				<v-list-item-title v-text="item.driver.name" />
				<v-list-item-subtitle v-text="item.driver.cpf" />
			</v-list-item-content>
		</template>
		<template v-slot:item.route="{ item }">
			<v-list-item-content>
				<span>
					{{ item.route.prefix }} - {{ item.route.name }}
				</span>
			</v-list-item-content>
		</template>
		<template v-slot:item.actions="{ item }">
			<v-btn
				icon
				color="grey"
				@click="deleteItem(item)"
			>
				<box-icon
					class="pr-1"
					type="solid"
					name="trash"
					color="grey"
				/>
			</v-btn>
		</template>
	</v-data-table>
</template>

<script>
import { WEEK_DAYS_TEXT } from '../../../core/constants/weekDays';

export default {
	props: {
		items: {
			type: Array,
			default: () => ([]),
			required: true,
		},
	},

	data() {
		return {
			WEEK_DAYS_TEXT,
			headers: [
				{
					text: 'Dias da semana',
					value: 'days',
					sortable: false,
					align: 'start',
				},
				{ text: 'Horário', value: 'time' },
				{ text: 'Motorista', value: 'driver' },
				{ text: 'Rota', value: 'route' },
				{ text: '', value: 'actions', sortable: false },
			],
		};
	},

	methods: {
		deleteItem (item) {
			const index = this.items.indexOf(item);
			this.$emit('deletion', { index, item });
		},
	},
}
</script>
