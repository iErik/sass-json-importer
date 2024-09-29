import { pathsToModuleNameMapper } from 'ts-jest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('jest').Config} */
const config = {
	verbose: true,
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		...pathsToModuleNameMapper(compilerOptions.paths, {
			prefix: '<rootDir>/',
		}),
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: './tsconfig.json',
			},
		],
	},
	resolver: 'ts-jest-resolver',
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	coverageReporters: ['json', 'text', 'lcov', 'clover'],
	collectCoverageFrom: ['./src/**'],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
};
export default config;
