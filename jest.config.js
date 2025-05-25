module.exports = {
    rootDir: './',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/test/setup-after-env.ts'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    testMatch: ['**/*.spec.ts'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
};