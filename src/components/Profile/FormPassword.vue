<template>
  <div class="form-password">
    <form class="form-password__content" @submit.prevent="submit">
      <h3 class="form-password__title">Create password</h3>
      <swap-input v-model="password" type="password" class="form-password__input" placeholder="Password" />
      <swap-input
        v-model="confirmPassword"
        type="password"
        class="form-password__input"
        placeholder="Confirm password"
      />
      <div class="form-password__buttons">
        <swap-button class="form-password__button" type="submit" :disabled="!isConfirmPassword">
          Confirm
        </swap-button>
        <swap-button :disabled="isCancelDisabled" class="form-password__button" @click="close">
          Cancel
        </swap-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type Data = {
  isCancelDisabled: boolean
  password: string
  confirmPassword: string
}

export default Vue.extend({
  name: 'FormWrapper',
  props: {
    withConfirm: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  data(): Data {
    return {
      isCancelDisabled: false,
      password: '',
      confirmPassword: ''
    }
  },
  computed: {
    isConfirmPassword(): boolean {
      return this.password.trim().length > 5 && this.confirmPassword === this.password
    }
  },
  methods: {
    submit(): void {
      if (this.isConfirmPassword) {
        this.$emit('submit', this.password)
        this.isCancelDisabled = true
        this.password = ''
        this.confirmPassword = ''
      }
    },
    close(): void {
      this.$emit('close')
    }
  }
})
</script>

<style lang="scss">
.form-password {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  overflow: auto;

  &__input {
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 15px;
    height: 305px;
    width: 400px;
    background: $--white;
    border-radius: 10px;
    border: 1px solid rgba($--black, 0.4);
  }

  &__title {
    margin-bottom: 15px;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
  }

  &__button {
    width: calc(50% - 4px);
  }
}
</style>
