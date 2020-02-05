module.exports = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:prettier/recommended',
  ],
  rules: {
    'jest/consistent-test-it': ['error', { fn: 'it' }],
    'jest/expect-expect': 'error',
    'jest/no-test-callback': 'error',
    'jest/no-test-return-statement': 'error',
    'jest/prefer-spy-on': 'error',
    'jest/prefer-strict-equal': 'error',
  },
};
  