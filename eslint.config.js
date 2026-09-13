const js = require('@eslint/js');
const globals = require('globals');
const react = require('eslint-plugin-react');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importX = require('eslint-plugin-import-x');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    {
        ignores: ['public/**', 'node_modules/**', '*.config.js', '*.config.cjs', 'webpack.*.js'],
    },

    js.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    prettierConfig,

    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.jest,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            '@typescript-eslint': ts,
            prettier,
        },
        settings: {
            react: { version: 'detect' },
            'import-x/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },
        rules: {
            ...ts.configs.recommended.rules,

            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            'react/no-unescaped-entities': 'off',
            'import-x/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                },
            ],
        },
    },
];
