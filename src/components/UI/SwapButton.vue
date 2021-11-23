<template>
  <button :class="classes" :disabled="disabled" class="swap-button" v-bind="$attrs" v-on="$listeners">
    <span class="swap-button__content">
      <slot></slot>
    </span>

    <span v-if="tooltip" v-tooltip="computedTooltipParams" class="swap-button__tooltip"></span>
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type TooltipParams = Record<string, unknown>
type Classes = Record<string, boolean>

export default Vue.extend({
  name: 'SwapButton',
  inheritAttrs: false,
  props: {
    text: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    round: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    tooltip: {
      type: String as PropType<string>,
      default: ''
    },
    tooltipParams: {
      type: Object as PropType<TooltipParams>,
      default: () => ({})
    }
  },
  computed: {
    classes(): Classes {
      const base = 'swap-button'
      return {
        [`${base}__text`]: this.text,
        [`${base}--disabled`]: this.disabled,
        [`${base}--round`]: this.round
      } as Classes
    },
    computedTooltipParams(): TooltipParams {
      const defaultParams = {
        delay: { show: 500, hide: 100 },
        placement: 'top-start'
      }

      return { ...defaultParams, ...this.tooltipParams, content: this.tooltip } as TooltipParams
    }
  }
})
</script>

<style lang="scss">
.swap-button {
  position: relative;
  height: 45px;
  padding: 0 16px;
  border-radius: $--main-border-radius;
  text-transform: none;
  background-color: var(--main-button-background);
  font-size: 0.875rem;
  letter-spacing: 1px;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: var(--main-button-background-hover);
  }

  &:active {
    background-color: var(--main-button-background-active);
  }

  &__content {
    color: var(--primary-text);
    font-weight: $--font-weight-bold;
    font-size: $--font-size-button;
  }

  &__text {
    background-color: transparent;
    color: $--dark-grey;

    &:hover {
      background-color: var(--main-button-background-hover);
    }
  }

  &--disabled {
    cursor: default;

    .swap-button__content {
      color: var(--main-button-text-disabled);
    }

    &:hover {
      background-color: var(--main-button-background-hover);
    }
  }

  &--round {
    border-radius: 50%;
  }

  @include phone {
    width: 100%;

    > span {
      font-weight: $--font-weight-bold;
      font-size: $--font-size-medium;
    }
  }

  &__tooltip {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
