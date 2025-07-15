module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {
    // Mapping imports.
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Transforms files js, jsx, ts, tsx using babel-jest.
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Optional: Coverage.
  // collectCoverage: true,
  // coverageDirectory: "coverage",
  // coverageReporters: ["json", "lcov", "text", "clover"],
}
