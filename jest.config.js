module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/*.unitTest.ts"],
  setupFiles: ["jest-plugin-context/setup"],
  moduleFileExtensions: ["js", "ts"],
  coverageDirectory: "coverage",
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts}', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testResultsProcessor: "jest-sonar-reporter",
  testURL: "http://localhost",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
