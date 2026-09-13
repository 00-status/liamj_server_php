import js from '@eslint/js';
import globals from 'globals';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import { flatConfigs } from 'eslint-plugin-import-x';
import prettierConfig from 'eslint-config-prettier';
import tseslint, { configs as tseslintConfig } from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['public/**', 'node_modules/**', '*.config.js', '*.config.cjs', 'webpack.*.js'],
    },

    js.configs.recommended,
    ...tseslintConfig.recommended,
    eslintReact.configs.recommended,
    flatConfigs.recommended,
    flatConfigs.typescript,

    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.jest,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
        },
        settings: {
            'import-x/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'import-x/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                },
            ],
        },
    },

    // Prettier MUST be last
    prettierConfig,
);
