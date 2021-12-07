<template>
  <div :class="['swap-input', classes]">
    <div v-if="$slots.prepend" class="swap-input__prepend">
      <slot name="prepend" />
    </div>
    <input
      ref="input"
      :type="inputType"
      :value="localValue"
      class="swap-input__elem"
      v-bind="$attrs"
      :disabled="disabled"
      v-on="inheritListeners"
      @input="handleInput($event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <div v-if="$slots.append" class="swap-input__append">
      <slot name="append" />
    </div>
    <button v-if="type === 'password'" type="button" class="swap-input__button-switch" @click="togglePassword">
      {{ textOfSwitch }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type InputType = 'password' | 'text'
type Data = {
  localValue: string
  isPasswordVisible: boolean
  isFocused: boolean
}

export default Vue.extend({
  name: 'SwapInput',

  inheritAttrs: false,

  props: {
    size: { type: String as PropType<string>, default: '' },
    filled: { type: Boolean as PropType<boolean>, default: false },
    type: { type: String as PropType<InputType>, default: 'text' },
    isError: { type: Boolean as PropType<boolean>, default: false },
    value: { type: [String, Number] as PropType<string | number>, default: '' },
    disabled: { type: Boolean as PropType<boolean>, default: false }
  },

  data(): Data {
    return {
      localValue: '',
      isPasswordVisible: false,
      isFocused: false
    }
  },

  computed: {
    inputType(): InputType {
      if (this.type === 'password') {
        return this.isPasswordVisible ? 'text' : 'password'
      }
      return this.type as InputType
    },
    textOfSwitch(): string {
      return this.isPasswordVisible ? 'Hide' : 'Show'
    },
    classes() {
      return [
        {
          'swap-input--error': this.isError,
          'swap-input--focused': this.isFocused
        },
        this.size && `swap-input--size--${this.size}`
      ]
    },
    inheritListeners() {
      const { input: _input, ...restListeners } = this.$listeners
      return restListeners
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.localValue = newValue
      }
    }
  },

  methods: {
    handleInput(value): void {
      this.localValue = value
      this.$emit('input', this.localValue)
    },
    togglePassword(): void {
      this.isPasswordVisible = !this.isPasswordVisible
    },
    focus() {
      this.$refs.input.focus()
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/scss/mixins';

.swap-input {
  $this: &;

  display: flex;
  align-items: center;
  position: relative;
  padding: 11px 8px 12px;
  background-color: var(--main-input-background);
  border-radius: $--main-border-radius-small;
  border: 2px solid var(--main-border-color);
  transition: border-color $--transition-duration;

  &:hover {
    border-color: #404042;
  }

  &--error {
    border: 1px solid $--text-color-error;
    margin-bottom: 10px;
    transition: $--transition-duration;
  }

  &--focused {
    border-color: var(--main-color);
  }
}

.swap-input__elem {
  @include transparent-autofill;

  color: var(--primary-text);
  padding: 0 8px;
  border: none;
  outline: none;
  width: 100%;
  background: transparent;

  &::placeholder {
    color: $--dark-grey;
  }
}

.swap-input__button-switch {
  color: $--grey;
  flex: 0 0 62px;
  line-height: initial;
}

.swap-input__prepend,
.swap-input__append {
  display: flex;
  align-items: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
