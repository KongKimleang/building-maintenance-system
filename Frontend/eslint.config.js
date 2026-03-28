const js = require('@eslint/js');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
  js.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        process: 'readonly',
        alert: 'readonly',
        prompt: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-undef': 'warn',
      'no-useless-catch': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
];
