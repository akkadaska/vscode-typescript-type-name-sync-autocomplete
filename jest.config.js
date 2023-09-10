module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testMatch: ['<rootDir>/**/*/*.spec.ts'],
};
