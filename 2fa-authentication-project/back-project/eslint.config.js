import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, '@stylistic': stylistic },
    extends: ['js/recommended', '@stylistic/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      '@stylistic/brace-style': ['off'],
      '@stylistic/arrow-parens': ['off'],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
    ignores: ['node_modules', 'eslint.config.js', 'src/generated/**'],
  },
])
