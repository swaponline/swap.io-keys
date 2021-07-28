<template>
  <div class="form-enter-password">
    <form class="form-enter-password__content" @submit.prevent="submit">
      <h3 class="form-enter-password__title">Enter password</h3>
      <swap-input v-model="password" type="password" class="form-enter-password__input" placeholder="Password" />
      <div class="form-enter-password__buttons">
        <swap-button class="form-enter-password__button" type="submit">
          Confirm
        </swap-button>
        <swap-button class="form-enter-password__button" @click="close">
          Cancel
        </swap-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type Data = {
  password: string
  isCancel: boolean
}

export default Vue.extend({
  name: 'EnterPassword',
  props: {},
  data(): Data {
    return {
      password: '',
      isCancel: false
    }
  },
  computed: {},
  methods: {
    submit(): void {
      this.$emit('submit', this.password)
      this.password = ''
    },
    close(): void {
      this.isCancel = true
      this.password = ''
      this.$emit('close')
    }
  }
})
</script>

<style lang="scss">
.form-enter-password {
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
    height: 205px;
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
    width: 174px;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
