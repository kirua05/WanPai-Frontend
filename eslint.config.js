import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig([
  // 忽略資料夾（這不受 files 限制，會全域忽略）
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/src/volt/**']),

  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      vue: pluginVue,
    },
    extends: [
      js.configs.recommended,
      pluginVue.configs['flat/essential'],
      eslintConfigPrettier, // 最後放 Prettier 避免衝突
    ],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': 'warn',
    },
  },
])
