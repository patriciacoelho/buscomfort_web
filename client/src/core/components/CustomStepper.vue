<template>
	<v-stepper
		v-bind="$attrs"
		v-model="currentStep"
		class="custom-stepper"
		alt-labels
		@change="(e) => $emit('change', e)"
	>
		<v-stepper-header class="custom-stepper__header">
			<template v-for="(step, n) in steps">
				<v-stepper-step
					:key="`step-${n + 1}`"
					:step="n + 1"
					:complete="currentStep > n + 1"
					class="custom-stepper__step cursor-pointer"
					@click="currentStep = n + 1"
				>
					{{ step.title }}
				</v-stepper-step>

				<v-divider
					v-if="n !== steps.length - 1"
					:key="n"
				/>
			</template>
		</v-stepper-header>

		<v-stepper-items>
			<template v-for="(step, n) in steps">
				<v-stepper-content
					:key="`step-content-${n + 1}`"
					:step="n + 1"
				>
					<slot :name="`step-${n + 1}`" />
				</v-stepper-content>
			</template>
		</v-stepper-items>
	</v-stepper>
</template>

<script>
export default {
	props: {
		value: {
			type: Number,
			default: 1,
			required: true,
		},
		steps: {
			type: Array,
			default: () => {},
			required: true,
		},
	},
	data() {
		return {
			currentStep: 1,
		};
	},

	watch: {
		value(newValue) {
			if (newValue !== this.currentStep) {
				this.currentStep = newValue;
			}
		},
		currentStep(newValue) {
			if (newValue !== this.value) {
				this.$emit('input', newValue);
			}
		},
	},

	mounted() {
		this.currentStep = this.value;
	},
}
</script>

<style lang="scss" scoped>
.custom-stepper {
	box-shadow: none !important;

	&__header {
		box-shadow: none !important;

		::v-deep .v-stepper__label {
			text-transform: uppercase;
			font-weight: 500;
			font-size: 14px;
			line-height: 24px;
			color: #6A7580;
		}

		::v-deep .v-stepper__step--complete .v-stepper__label {
			color: #6A7580 !important;
		}

		::v-deep .v-divider {
			margin: 35px -100px 0 !important;
		}

		::v-deep .v-stepper__step--inactive .v-stepper__step__step {
			border: 1px solid #6A7580 !important;
			background-color: transparent !important;
			color: #6A7580 !important;
		}

		::v-deep .v-stepper__step--active .v-stepper__step__step,
		::v-deep .v-stepper__step--complete .v-stepper__step__step {
			background-color: #1DCA94 !important;
		}
	}

	&__step {
		flex-basis: 250px !important;
	}
}
</style>
