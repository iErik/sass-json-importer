import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
	verbose: true,
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest',
	},
	resolver: 'ts-jest-resolver',
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>',
	}),
	collectCoverage: true,
	collectCoverageFrom: ['./src/**'],
	coverageThreshold: { global: { lines: 90 } },
	testEnvironment: 'node',
};
export default config;
