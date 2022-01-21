import { ComponentOptions } from 'vue'

declare module '*.json' {
  const value: any
  export default value
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    constants?: {
      [key: string]: any
    }
  }
}
