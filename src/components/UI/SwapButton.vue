<template>
  <button class="swap-button" :class="classes" v-bind="$attrs" :disabled="disabled" v-on="$listeners">
    <span class="swap-button__content">
      <slot></slot>
    </span>

    <span v-if="tooltip" v-tooltip="computedTooltipParams" class="swap-button__tooltip"></span>
  </button>
</template>

<script lang="ts">
export default {
  name: 'SwapButton',
  inheritAttrs: false,
  props: {
    text: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    tooltip: { type: String, default: '' },
    tooltipParams: { type: Object, default: () => ({}) }
  },
  computed: {
    classes() {
      const base = 'swap-button'
      return {
        [`${base}__text`]: this.text,
        [`${base}__disabled`]: this.disabled
      }
    },
    computedTooltipParams() {
      const defaultParams = {
        delay: { show: 500, hide: 100 },
        placement: 'top-start'
      }

      return { ...defaultParams, ...this.tooltipParams, content: this.tooltip }
    }
  }
}
</script>

<style lang="scss">
.swap-button {
  position: relative;
  min-height: 52px;
  min-width: 142px !important;
  border-radius: $--main-border-radius;
  text-transform: none;
  background-color: $--light-grey;
  padding: 0 16px;
  font-size: 0.875rem;
  letter-spacing: 1px;
  transition: all 0.2s;

  &:hover {
    background-color: $--light-grey-1;
  }

  --text-color: $--black;

  &__content {
    color: var(--text-color);
    font-weight: $--font-weight-bold;
    font-size: $--font-size-button;
  }

  &__text {
    background-color: transparent;

    &:hover {
      background-color: $--light-grey;
    }
  }

  &__disabled {
    background-color: $--light-grey-1;
    color: $--dark-grey;
    cursor: default;

    &:hover {
      background-color: $--light-grey-1;
    }
  }

  @include phone {
    width: 100%;
    min-height: 45px;

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
