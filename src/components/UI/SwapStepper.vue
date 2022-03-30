<template>
  <div class="swap-stepper">
    <template v-for="step in stepsCount">
      <div v-show="step === activeStep" :key="step" class="swap-stepper__content" data-testid="swap-step">
        <slot :name="step" :change-active-step="changeActiveStep"></slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'VStepper',
  props: {
    currentStep: {
      type: Number as PropType<number>,
      default: 1
    }
  },
  data() {
    return {
      activeStep: 1
    }
  },
  computed: {
    stepsCount() {
      return Object.keys(this.$scopedSlots).length
    }
  },

  watch: {
    currentStep: {
      immediate: true,
      handler(step) {
        this.changeActiveStep(step)
      }
    }
  },
  methods: {
    changeActiveStep(step: number): void {
      this.activeStep = step
    }
  }
})
</script>

<style lang="scss">
.swap-stepper {
  &__content {
    height: 100%;
  }
}
</style>
