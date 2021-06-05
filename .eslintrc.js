module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/airbnb',
    '@vue/prettier',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'never'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'arrow-parens': ['error', 'as-needed'],
    'vue/max-len': ['error', { code: 120, template: 120, ignoreHTMLAttributeValues: false }],
    'vue/component-name-in-template-casing': ['error', 'kebab-case', { registeredComponentsOnly: false }],
    'vue/require-name-property': 'error',
    'vue/v-on-function-call': ['error', 'never'],
    'vue/no-boolean-default': ['error', 'default-false'],
    'vue/padding-line-between-blocks': ['error', 'always'],
    'no-eq-null': 'error',
    'require-await': 'error'
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}
