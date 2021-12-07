<template>
  <div class="mnemonic-phrase-table">
    <template v-for="({ value, input }, index) in localTableMatrix">
      <swap-input
        v-if="input"
        :key="index"
        :value="value"
        class="mnemonic-phrase-table__input"
        @input="changeTableMatrixCell(index, $event)"
      >
        <template #prepend>
          <span class="mnemonic-phrase-table__number">{{ index + 1 }}. </span>
        </template>
      </swap-input>
      <div v-else :key="index" class="mnemonic-phrase-table__word">
        <span class="mnemonic-phrase-table__number">{{ index + 1 }}.</span> {{ value }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { TableMatrix } from '@/types/components/profile'
import { cloneDeep } from '@/utils/common'

type Data = {
  localTableMatrix: TableMatrix
}

export default Vue.extend({
  name: 'SecretPhraseTable',
  props: {
    tableMatrix: {
      type: Array as PropType<TableMatrix>,
      default: () => {
        return []
      }
    }
  },
  data(): Data {
    return {
      localTableMatrix: []
    }
  },
  watch: {
    tableMatrix: {
      deep: true,
      immediate: true,
      handler(newTableMatrix) {
        this.localTableMatrix = cloneDeep(newTableMatrix)
      }
    }
  },
  methods: {
    changeTableMatrixCell(index: number, value: string): void {
      this.localTableMatrix[index].value = value.trim()
      this.$emit('change', this.localTableMatrix)
    }
  }
})
</script>

<style lang="scss">
.mnemonic-phrase-table {
  width: 100%;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 14px;
  font-size: $--font-size-table-word;

  @include tablet {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px 8px;
  }

  @include phone {
    font-size: $--font-size-base;
  }

  @include small-phone {
    font-size: $--font-size-small;
    grid-gap: 10px 5px;
  }

  &__number {
    color: $--dark-grey;
  }

  &__input {
    width: 100%;
    padding: 4px 10px;

    .swap-input__elem {
      font-size: $--font-size-table-word;

      @include phone {
        font-size: $--font-size-base;
      }

      @include small-phone {
        font-size: $--font-size-small;
      }
    }
  }

  &__word {
    position: relative;
    border: 2px solid transparent;
    background-color: var(--main-button-background);
    border-radius: $--main-border-radius-small;
    padding: 4px 10px;
    color: var(--primary-text);
    white-space: nowrap;

    @include tablet {
      padding: 4px 8px;
    }

    @include phone {
      padding: 4px;
    }
  }
}
</style>
