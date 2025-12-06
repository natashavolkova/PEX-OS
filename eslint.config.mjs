// ============================================================================
// ESLINT v9 FLAT CONFIG
// ATHENA Architecture | Modern Linting Configuration
// ============================================================================

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginNext from '@next/eslint-plugin-next';

export default tseslint.config(
    // Base JS recommended rules
    js.configs.recommended,

    // TypeScript recommended rules
    ...tseslint.configs.recommended,

    // Global ignores
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'out/**',
            'build/**',
            '*.config.js',
            '*.config.mjs',
        ],
    },

    // Main configuration
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                React: 'readonly',
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            'react': pluginReact,
            'react-hooks': pluginReactHooks,
            '@next/next': pluginNext,
        },
        rules: {
            // React rules
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',

            // React Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // Next.js rules
            '@next/next/no-html-link-for-pages': 'error',
            '@next/next/no-img-element': 'warn',

            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-object-type': 'off',

            // General rules
            'no-console': 'off',
            'prefer-const': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
);
