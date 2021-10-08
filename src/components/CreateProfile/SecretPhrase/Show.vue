<template>
  <div class="secret-phrase-show">
    <header-profile class="secret-phrase-show__header">
      {{ headerTitle }}
      <template v-if="!isRecoverProfile" #help-text>
        <swap-help-text
          :class="['secret-phrase-show__help-text', isWritePhrase && 'secret-phrase-show__help-text--small']"
        >
          {{ headerHelpText }}
        </swap-help-text>
      </template>
    </header-profile>
    <secret-phrase-table :table-matrix="tableMatrix" @change="changeTableMatrixCell" />
    <div class="secret-phrase-show__buttons">
      <swap-button class="secret-phrase-show__button" @click="goBack">
        Back
      </swap-button>
      <template v-if="isWritePhrase || isRecoverProfile">
        <swap-button
          v-if="isRecoverProfile"
          :disabled="isDisabledRecover"
          :tooltip="isDisabledRecover ? 'Complete your secret phrase.' : null"
          class="secret-phrase-show__button"
          @click="recoverProfile"
        >
          Recover
        </swap-button>
        <swap-button
          v-else
          :disabled="isDisabledCreate"
          :tooltip="isDisabledCreate ? 'Complete your secret phrase.' : null"
          class="secret-phrase-show__button"
          @click="createProfile"
        >
          Create
        </swap-button>
      </template>
      <template v-else>
        <swap-button class="secret-phrase-show__button" @click="partialReplacementWordsWithInput">Next</swap-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import HeaderProfile from '@/components/CreateProfile/Header.vue'
import SecretPhraseTable from '@/components/CreateProfile/SecretPhrase/Table.vue'
import { randomInteger } from '@/utils/common'
import { TableMatrix } from '../types'

const QUANTITY_INPUTS = 0

type Data = {
  tableMatrix: TableMatrix
  isWritePhrase: boolean
}

export default Vue.extend({
  name: 'SecretPhraseShow',
  components: {
    HeaderProfile,
    SecretPhraseTable
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
      isWritePhrase: false
    }
  },
  computed: {
    headerTitle() {
      return this.isRecoverProfile || !this.isWritePhrase ? 'Your secret phrase' : 'Fill in the missing words'
    },
    headerHelpText() {
      return !this.isWritePhrase
        ? `Back this up on a piece of paper. Label the paper as swap.io to remind you where to use it. Do not save the
        phrase on your device. Do not take photos of this phrase. Keep the piece of paper in a safe place.`
        : 'Lets check your phrase safeness. We took parts of phrase. Fill empty spaces to verify.'
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
    },
    localWords() {
      return this.tableMatrix.map(item => item.value)
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
          input: this.isRecoverProfile
        }
      })
    },
    createProfile() {
      this.$emit('create')
    },
    changeTableMatrix(newTableMatrix: TableMatrix): void {
      this.tableMatrix = newTableMatrix
    },
    changeTableMatrixCell({ index, value }) {
      this.tableMatrix[index].value = value
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
.secret-phrase-show {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    margin-bottom: 44px;

    @include tablet {
      margin-bottom: 75px;
    }

    @include phone {
      margin-bottom: 50px;
    }

    @include small-phone {
      margin-bottom: 30px;
    }
  }

  &__help-text {
    max-width: 520px;

    @include tablet {
      max-width: 500px;
    }

    &--small {
      max-width: 275px;
    }
  }

  &__buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto;

    @include phone {
      max-width: 314px;
    }
  }

  &__button {
    width: 180px;

    &:not(:last-child) {
      margin-right: 10px;
    }

    @include tablet {
      width: 100%;
    }
  }
}
</style>
