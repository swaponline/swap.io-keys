<template>
  <div class="words-table">
    <template v-for="({ value, input }, index) in tableMatrix">
      <label v-if="input" :key="index" class="words-table__label">
        <span>{{ index + 1 }}. </span>
        <input :value="value" class="words-table__input" @input="setValue(index, $event.target.value)" />
      </label>
      <span v-else :key="index" class="words-table__word">{{ index + 1 }}. {{ value }}</span>
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
.words-table {
  width: 100%;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 31px 0;
  font-size: $--font-size-table-word;

  @include tablet {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 32px 40px;
  }

  @include phone {
    font-size: 18px;
    grid-gap: 20px 5px;
    margin-bottom: 36px;
  }

  @include small-phone {
    font-size: $--font-size-base;
  }

  &__label {
    display: flex;
    border-bottom: 1px solid $--black;
    margin-right: 27px;
  }

  &__input {
    width: 100%;
    margin-left: 2px;
    margin-bottom: 2px;
    outline: none;
    border: none;
  }

  &__word {
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
    white-space: nowrap;
  }
}
</style>
