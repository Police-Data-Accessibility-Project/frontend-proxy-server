/** @type {import('jest').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/src/**/*test.integration.ts'],
  maxWorkers: 1,
};

module.exports = config;
