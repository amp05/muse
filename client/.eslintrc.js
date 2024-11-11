module.exports = {
    extends: [
      '../.eslintrc.js',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended'
    ],
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // Client-specific rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Not needed when using TypeScript
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    }
  };