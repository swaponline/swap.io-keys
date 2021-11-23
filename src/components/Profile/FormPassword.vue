<template>
  <div class="create-password">
    <div class="create-password__wrapper">
      <form class="create-password__form" @submit="submit">
        <header-profile class="create-password__header">
          Create a password
          <template #help-text>
            <swap-help-text class="create-password__help-text">
              In the future, the password will be used to confirm transactions
            </swap-help-text>
          </template>
        </header-profile>
        <swap-input
          v-model="localPassword"
          type="password"
          class="create-password__input"
          placeholder="Enter your password"
        />
        <swap-input
          v-model="confirmPassword"
          type="password"
          class="create-password__input"
          placeholder="Repeat password"
        />
      </form>
    </div>
    <slot name="actions" :is-confirm-password="isConfirmPassword"></slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import HeaderProfile from '@/components/Profile/Header.vue'

type Data = {
  confirmPassword: string
}

export default Vue.extend({
  name: 'FormPassword',
  components: {
    HeaderProfile
  },
  props: {
    value: {
      type: String as PropType<string>,
      default: ''
    }
  },
  data(): Data {
    return {
      confirmPassword: ''
    }
  },
  computed: {
    isConfirmPassword(): boolean {
      return this.localPassword.trim().length > 5 && this.confirmPassword === this.localPassword
    },
    localPassword: {
      set(newPassword) {
        this.$emit('input', newPassword)
      },
      get() {
        return this.value
      }
    }
  },
  methods: {
    submit(): void {
      if (this.isConfirmPassword) {
        this.$emit('submit', this.localPassword)
        this.localPassword = ''
        this.confirmPassword = ''
      }
    }
  }
})
</script>

<style lang="scss">
.create-password {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 0 40px;

  @include tablet {
    padding: 28px 20px 20px;
  }

  &__wrapper {
    display: flex;
    justify-content: center;
  }

  &__form {
    width: 250px;

    @include tablet {
      width: 320px;
    }

    @include phone {
      width: 100%;
    }
  }

  &__header {
    margin-bottom: 60px;

    @include tablet {
      margin-bottom: 110px;
    }

    @include phone {
      margin-bottom: 77px;
    }

    @include small-phone {
      margin-bottom: 30px;
    }
  }

  &__help-text {
    max-width: 275px;
  }

  &__input {
    width: 100%;
    padding: 15px 14px;
    border-radius: $--main-border-radius;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    .swap-input__elem {
      font-size: $--font-size-extra-small-subtitle;
    }
  }
}
</style>
