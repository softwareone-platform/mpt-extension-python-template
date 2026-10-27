module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '\\.scss$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    // ts-jest compiles each file with its own program and drops the automatic `@types/*`
    // inclusion, so whichever suite jest compiles first fails with "Cannot find name
    // 'jest'". Declaring the test globals here makes every suite compile in any order.
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { tsconfig: { esModuleInterop: true, types: ['jest', '@testing-library/jest-dom'] } },
    ],
  },
};
