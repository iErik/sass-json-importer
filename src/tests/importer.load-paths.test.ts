import JsonImporter from '../importer.js';
import {
	compile,
	compileString,
	Exception as SassException,
} from 'sass-embedded';

describe('ImporterOptions - loadPaths', () => {
	it('adds containing folder to loadPaths', () => {
		const jsonImporter = new JsonImporter();
		const sassOptions = { importers: [jsonImporter] };
		const result = compile(
			'./src/tests/fixtures/strings.scss',
			sassOptions,
		);
		expect(result.css.toString()).toContain('color: #c33;');
	});

	it('imports JSON when passed a single, resolvable path', () => {
		const jsonImporter = new JsonImporter({
			loadPaths: ['./src/tests/fixtures'],
		});
		const sassOptions = { importers: [jsonImporter] };
		const result = compileString(
			'@import "strings.json"; body { color: $color-red; }',
			sassOptions,
		);
		expect(result.css.toString()).toContain('color: #c33;');
	});

	it('imports JSONC when passed a single, resolvable path', () => {
		const jsonImporter = new JsonImporter({
			loadPaths: ['./src/tests/fixtures'],
		});
		const sassOptions = { importers: [jsonImporter] };
		const result = compileString(
			'@import "strings.jsonc"; body { color: $color-red; }',
			sassOptions,
		);

		expect(result.css.toString()).toContain('color: #c33;');
	});

	it('imports JSON when passed resolvable and non-resolvable paths', () => {
		const jsonImporter = new JsonImporter({
			loadPaths: ['./foo', './bar', './src/tests/fixtures'],
		});
		const sassOptions = { importers: [jsonImporter] };
		const result = compileString(
			'@import "strings.json"; body { color: $color-red; }',
			sassOptions,
		);
		expect(result.css.toString()).toContain('color: #c33;');
	});

	it('imports JSON when passed an empty string and import path is resolvable', () => {
		const jsonImporter = new JsonImporter({
			loadPaths: [''],
		});
		const sassOptions = { importers: [jsonImporter] };
		const result = compileString(
			'@import "src/tests/fixtures/strings.json"; body { color: $color-red; }',
			sassOptions,
		);

		expect(result.css.toString()).toContain('color: #c33;');
	});

	it('throws an error when passed a non-resolvable path', () => {
		const jsonImporter = new JsonImporter({
			loadPaths: ['./foo'],
		});
		const sassOptions = { importers: [jsonImporter] };

		let caughtError: unknown;

		try {
			compileString('@import "strings.json"', sassOptions);
		} catch (error) {
			caughtError = error;
		}

		expect(caughtError).toBeInstanceOf(SassException);
		expect((caughtError as SassException).sassMessage).toBe(
			"Can't find stylesheet to import.",
		);
	});

	it('skips paths with invalid characters, without throwing an error', () => {
		const jsonImporter = new JsonImporter({
			loadPaths: [
				'./src/tests/fixtures\u0000',
				'./src/tests/fixtures:',
				'./src/tests/fixtures',
			],
		});
		const sassOptions = { importers: [jsonImporter] };
		const result = compileString(
			'@import "strings.json"; body { color: $color-red; }',
			sassOptions,
		);

		expect(result.css.toString()).toContain('color: #c33;');
	});
});
