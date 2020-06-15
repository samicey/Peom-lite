module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'import/prefer-default-export': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'max-len': process.env.NODE_ENV === 'production' ? 'off' : 'off',
  },
};
