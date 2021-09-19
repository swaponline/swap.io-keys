<template>
  <div class="secret-phrase-table">
    <template v-for="({ value, input }, index) in tableMatrix">
      <label v-if="input" :key="index" class="secret-phrase-table__label">
        <span class="secret-phrase-table__number">{{ index + 1 }}. </span>
        <input :value="value" class="secret-phrase-table__input" @input="setValue(index, $event.target.value)" />
      </label>
      <div v-else :key="index" class="secret-phrase-table__word">
        <span class="secret-phrase-table__number">{{ index + 1 }}.</span> {{ value }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { TableMatrix } from './types.d'

type Data = {
  localTableMatrix: TableMatrix
}

export default Vue.extend({
  name: 'WordsTable',
  props: {
    tableMatrix: {
      type: Array as PropType<TableMatrix>,
      default: () => []
    }
  },
  data(): Data {
    return {
      localTableMatrix: []
    } as Data
  },
  watch: {
    tableMatrix: {
      immediate: true,
      handler(newTableMatrix) {
        this.localTableMatrix = [...newTableMatrix]
      }
    }
  },
  methods: {
    setValue(index: number, value: string): void {
      this.localTableMatrix[index].value = value.trim()
      this.$emit('change', this.localTableMatrix)
    }
  }
})
</script>

<style lang="scss">
.secret-phrase-table {
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
    grid-gap: 10px 2px;
  }

  &__number {
    color: $--dark-grey;
  }

  &__label {
    display: flex;
    border: 2px solid var(--main-border-color);
    border-radius: 5px;
    padding: 4px 10px;
  }

  &__input {
    width: 100%;
    color: var(--primary-text);
    padding: 0;
    border: none;
    background-color: var(--main-input-background);
  }

  &__word {
    border: 2px solid transparent;
    background-color: var(--main-button-background);
    border-radius: 5px;
    padding: 4px 10px;
    color: var(--primary-text);
    white-space: nowrap;
  }
}
</style>
