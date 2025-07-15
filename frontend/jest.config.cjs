module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {
    // Mapping imports.
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Transforms files jsx, tsx.
    '^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // Coverage.
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // Ignored by tests
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/', // Should be already but just in case
    '<rootDir>/src/components/ui/', // Shadcn components
    '<rootDir>/src/pages/KitchenSink',
    '<rootDir>/src/pages/Coverage',
  ],
}
