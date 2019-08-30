module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
        "<rootDir>/src",
        "<rootDir>/tests"
    ],
    testMatch: [
        "**/*.unitTest.ts"
    ],
    setupFiles: [
        "jest-plugin-context/setup"
    ]
}
