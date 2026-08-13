const js = require('@eslint/js');
const globals = require('globals');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: ['dist/**', 'node_modules/**'],

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
            react,
            'react-hooks': reactHooks,
            '@typescript-eslint': ts,
            import: importPlugin,
            prettier,
        },

        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },

        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...ts.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,
            ...prettierConfig.rules,

            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            'react/no-unescaped-entities': 'off',

            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                },
            ],
        },

        ignores: ['*.config.js', '*.config.cjs', 'webpack.*.js'],
    },
];
