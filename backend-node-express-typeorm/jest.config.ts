import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {"^.+\\.ts?$": "ts-jest"},
  silent: false,
  verbose: true,
};

export default config;
