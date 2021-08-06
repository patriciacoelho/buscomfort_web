<template>
	<span @click="handleClick" >
		<v-card
			v-bind="$attrs"
			rounded="xl"
			class="list-item-card"
			:class="!expandable ? 'cursor-pointer' : ''"
			:link="!expandable"
		>
			<div class="d-flex">
				<v-col
					cols="6"
					class="py-6 px-7"
				>
					<slot name="default">
						<v-row>
							<v-col class="flex-grow-0">
								<slot name="icon" />
							</v-col>
							<v-col class="flex-grow-1">
								<h4 class="pcs-link">{{ title }}</h4>
								<div class="list-item-card__subtitle pcs-subtitle-3">
									<slot name="subtitle" >
										{{ subtitle }}
									</slot>
									<div v-if="expandable && internalShowDetail">
										<slot name="append-details" />
									</div>
								</div>
							</v-col>
						</v-row>
					</slot>
				</v-col>
				<v-col
					cols="4"
					class="py-6 px-7 ml-auto"
				>
					<div class="list-item-card__right-slot d-flex justify-end">
						<slot name="right-slot" />
						<v-btn
							v-if="expandable"
							class="ml-5 mt-n1"
							icon
							@click="toggleChevron"
						>
							<box-icon
								class="mr-1"
								:name="chevronIcon"
								color="#424345"
							/>
						</v-btn>
					</div>
				</v-col>
			</div>
			<v-card-actions
				v-if="expandable && internalShowDetail"
				class="pa-0"
			>
				<v-btn
					rounded
					class="list-item-card__action-button accent"
					@click="$emit('action-trigger', true)"
				>
					<slot name="action">
						+ Informações
					</slot>
				</v-btn>
			</v-card-actions>
		</v-card>
	</span>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: '',
		},
		expandable: {
			type: Boolean,
			default: false,
		},
		showDetail: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			internalShowDetail: false,
		};
	},

	watch: {
		showDetail(newValue) {
			if (newValue !== this.internalShowDetail) {
				this.internalShowDetail = newValue;
			}
		},
	},

	mounted() {
		this.internalShowDetail = this.showDetail;
	},

	computed: {
		chevronIcon() {
			return this.internalShowDetail ? 'chevron-up' : 'chevron-down';
		},
	},

	methods: {
		toggleChevron() {
			this.internalShowDetail = !this.internalShowDetail;
		},

		handleClick(e) {
			if (!this.expandable) {
				this.$emit('click', e);
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.list-item-card {
	border: 1px solid #E4E9EE;
	box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.16) !important;

	&:before {
		background: unset !important;
	}

	&__subtitle {
		color: #2F2E3A;
	}

	&__right-slot {
		margin-top: 16px;
		font-size: 12px;
		line-height: 14px;
		text-align: right;
		color: #979797;
	}

	&__action-button {
		width: 100%;
		border-radius: 0px 0px 16px 16px;
		height: 50px !important;
	}
}
</style>