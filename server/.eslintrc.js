module.exports = {
  extends: ['../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Server-specific rules
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
};