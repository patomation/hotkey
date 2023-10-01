module.exports = {
  extends: 'standard-with-typescript',
  env: {
    mocha: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    'mocha',
    'chai',
    'prettier',
    // '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/no-dynamic-delete': 0, // Need to be able to dynamically delete key value pairs from storage with remove method
    '@typescript-eslint/prefer-nullish-coalescing': 0,
    '@typescript-eslint/comma-dangle': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    '@typescript-eslint/member-delimiter-style': 0,
  },
}
