/** @type {import('jest').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/*test*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  maxWorkers: 1,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/test/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!**/{index,config}.ts',
  ],
  coverageReporters: ['text', 'lcov', 'json-summary'],
};

module.exports = config;
