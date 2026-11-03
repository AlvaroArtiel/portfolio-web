import studio from '@sanity/eslint-config-studio'

export default [
  ...studio,
  {
    files: ['seed/**/*.mjs'],
    languageOptions: {
      globals: {
        Buffer: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
]
