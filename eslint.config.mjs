import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import angular from 'angular-eslint';

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', '.angular/**', 'coverage/**'] },
  {
    files: ['**/*.mjs', '**/*.js'],
    extends: [eslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: globals.browser,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Keep the named POST interface extensible while excluding the mock-assigned ID.
    files: ['src/app/features/movies/edit/create-movie.model.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);
