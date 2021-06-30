<template>
  <match-media v-slot="{ desktop }" class="show-secret-phrase" wrapper-tag="div">
    <header class="show-secret-phrase__header">
      <swap-button-go-back v-if="!desktop" @click="goBack" />
      <h1 class="show-secret-phrase__title">{{ headerTitle }}</h1>
    </header>
    <words-table :table-matrix="tableMatrix" @change="changeTableMatrix" />
    <div class="show-secret-phrase__buttons">
      <swap-button v-if="desktop && !isRecoverProfile" class="show-secret-phrase__button" @click="goBack">
        Back
      </swap-button>
      <template v-if="isWritePhrase || isRecoverProfile">
        <swap-button
          v-if="isRecoverProfile"
          class="show-secret-phrase__button"
          :disabled="isDisabledRecover"
          :tooltip="isDisabledRecover ? 'Complete your secret phrase.' : null"
          @click="recoverProfile"
        >
          Recover
        </swap-button>
        <swap-button
          v-else
          class="show-secret-phrase__button"
          :disabled="isDisabledCreate"
          :tooltip="isDisabledCreate ? 'Complete your secret phrase.' : null"
          @click="createProfile"
        >
          Create
        </swap-button>
      </template>
      <template v-else>
        <swap-button class="show-secret-phrase__button" @click="partialReplacementWordsWithInput">Next</swap-button>
      </template>
    </div>
  </match-media>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { MatchMedia } from 'vue-component-media-queries'
import WordsTable from '@/components/Profile/WordsTable.vue'
import { randomInteger } from '@/utils/common'
import { TableMatrix } from './types.d'

const QUANTITY_INPUTS = 6

type Data = {
  tableMatrix: TableMatrix
  isWritePhrase: boolean
  localWords: string[]
}

export default Vue.extend({
  name: 'SecretPhraseTable',
  components: {
    MatchMedia,
    WordsTable
  },
  props: {
    words: {
      type: Array as PropType<string[]>,
      default: (): string[] => []
    },
    isRecoverProfile: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  data(): Data {
    return {
      tableMatrix: [{ value: '', input: false }],
      isWritePhrase: false,
      localWords: []
    }
  },
  computed: {
    headerTitle() {
      return this.isRecoverProfile || !this.isWritePhrase ? 'Your secret phrase' : 'Fill in the missing words'
    },
    isDisabledCreate() {
      const a = this.words.toString()
      const b = this.localWords.toString()
      return a !== b
    },
    isDisabledRecover() {
      return this.localWords.some(word => {
        return word === ''
      })
    }
  },
  created() {
    this.createTableMatrix()
  },
  methods: {
    createTableMatrix() {
      this.tableMatrix = this.words.map(word => {
        return {
          value: word,
          input: !!this.isRecoverProfile
        }
      })
    },
    createProfile() {
      this.$emit('create')
    },
    changeTableMatrix(newTableMatrix: TableMatrix): void {
      this.tableMatrix = newTableMatrix
      this.localWords = newTableMatrix.map(item => item.value)
    },
    recoverProfile(): void {
      this.$emit('recover', this.localWords)
    },
    restoreWords(): void {
      this.isWritePhrase = false
      this.createTableMatrix()
    },
    goToChooseStyle(): void {
      this.$router.push({ name: 'ChooseStyle' })
    },
    goBack(): void {
      if (this.isWritePhrase) {
        this.restoreWords()
        return
      }

      this.goToChooseStyle()
    },
    partialReplacementWordsWithInput() {
      this.isWritePhrase = true
      const modifiedTableMatrix: TableMatrix = [...this.tableMatrix]

      let index = 0
      while (index < QUANTITY_INPUTS) {
        const replacementIndex = randomInteger(0, modifiedTableMatrix.length - 1)
        const { value } = modifiedTableMatrix[replacementIndex]

        if (value) {
          modifiedTableMatrix[replacementIndex] = {
            value: '',
            input: true
          }
          index += 1
        }
      }

      this.changeTableMatrix(modifiedTableMatrix)
    }
  }
})
</script>

<style lang="scss">
.show-secret-phrase {
  height: 100%;
  padding: 40px 40px 60px 70px;
  display: flex;
  flex-direction: column;

  @include tablet {
    padding: 31px 39px;
  }

  @include phone {
    padding: 31px 15px;
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 66px;

    @include tablet {
      margin-bottom: 55px;
    }

    @include phone {
      margin-bottom: 30px;
    }
  }

  &__title {
    font-weight: $--font-weight-semi-bold;
    font-size: $--font-size-extra-title;
    text-align: center;
    width: 100%;

    @include tablet {
      font-size: $--font-size-subtitle;
    }
  }

  &__buttons {
    margin-top: auto;
    display: flex;
    justify-content: center;

    @include tablet {
      flex-wrap: wrap-reverse;
    }
  }

  &__button {
    max-width: 174px;

    &:not(:last-child) {
      margin-right: 10px;
    }

    @include tablet {
      width: 100%;
      max-width: 334px;
    }
  }
}
</style>
