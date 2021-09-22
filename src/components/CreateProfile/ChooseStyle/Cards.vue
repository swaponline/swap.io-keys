<template>
  <div class="choose-style-cards">
    <div class="choose-style-cards__list">
      <slot v-bind="{ userThemes }" />
    </div>
    <div class="choose-style-cards__actions">
      <slot name="actions" v-bind="{ refreshColors }" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import windowParentPostMessage from '@/windowParentPostMessage'
import { getUserTheme } from '@/utils/userTheme'
import { UserTheme } from '@/types/userTheme'
import { CREATE_PROFILE_WINDOW } from '@/constants/windowKey'
import { IFRAME_INITED } from '@/constants/createProfile'

const QUANTITY_CARDS = 4

type Data = {
  userThemes: UserTheme[]
}

export default Vue.extend({
  name: 'ChoseStyleCards',
  data(): Data {
    return {
      userThemes: []
    }
  },
  async mounted() {
    await this.getCards()

    windowParentPostMessage({
      key: CREATE_PROFILE_WINDOW,
      message: {
        type: IFRAME_INITED
      }
    })
  },
  methods: {
    async getCards(): Promise<void> {
      const userThemeResolvers: Promise<UserTheme>[] = []

      for (let i = 0; i < QUANTITY_CARDS; i += 1) {
        const userTheme: Promise<UserTheme> = getUserTheme()
        userThemeResolvers.push(userTheme)
      }

      this.userThemes = await Promise.all(userThemeResolvers)
    },
    async refreshColors(): Promise<void> {
      if (!this.isRefreshing) {
        this.isRefreshing = true
        await this.getCards()
        this.isRefreshing = false
      }
    }
  }
})
</script>

<style lang="scss">
.choose-style-cards {
  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: 100%;
    margin-bottom: 40px;

    @include tablet {
      grid-template-columns: 1fr 1fr;
    }

    @include small-phone {
      margin-top: 10px;
    }
  }
}
</style>
