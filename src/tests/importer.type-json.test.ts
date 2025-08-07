import JsonImporter from '../importer.js';
import { AsyncCompiler, initAsyncCompiler } from 'sass-embedded';

describe('Import type test (JSON)', () => {
	let compiler: AsyncCompiler;
	let jsonImporter: JsonImporter;
	let sassOptions: object;
	let expectedResult: string;

	beforeAll(async () => {
		expectedResult = 'color: #c33;';
		jsonImporter = new JsonImporter({
			loadPaths: ['./src/tests/fixtures'],
		});
		compiler = await initAsyncCompiler();
		sassOptions = { importers: [jsonImporter] };
	});

	afterAll(async () => {
		await compiler.dispose();
	});

	it('imports strings', async () => {
		const result = await compiler.compileStringAsync(
			`@import "strings.json"; body { color: $color-red; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(expectedResult);
	});

	it('quotes strings with special characters', async () => {
		const result = await compiler.compileStringAsync(
			`@import "strings.json"; body { content: $css; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(
			'content: "&:hover { color: red; }"',
		);
	});

	it('imports empty strings correctly', async () => {
		const result = await compiler.compileStringAsync(
			`@import "empty-string.json"; body { color: $colors; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain('color: ""');
	});

	it('imports null as empty string', async () => {
		const result = await compiler.compileStringAsync(
			`@import "empty-string.json"; body { color: $nullvalue; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain('color: ""');
	});

	it('imports lists', async () => {
		const result = await compiler.compileStringAsync(
			`@use 'sass:list'; @import "lists.json"; body { color: list.nth($colors, 1); }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(expectedResult);
	});

	it('imports maps', async () => {
		const result = await compiler.compileStringAsync(
			`@use 'sass:map'; @import "maps.json"; body { color: map.get($colors, red); }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(expectedResult);
	});

	it('with stringifyKeys: true, imports maps with quoted keys', async () => {
		let jsonImporter = new JsonImporter({
			loadPaths: ['./src/tests/fixtures'],
			stringifyKeys: true,
		});

		let options = {
			importers: [jsonImporter],
		};

		const result = await compiler.compileStringAsync(
			`@use 'sass:map'; @import "maps.json"; body { color: map.get($colors, "red"); }`,
			options,
		);

		expect(result.css.toString()).toContain(expectedResult);
	});

	it('imports maps with array as top level', async () => {
		const result = await compiler.compileStringAsync(
			`@use 'sass:list'; @import "array.json"; body { color: list.nth($array, 1); }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(expectedResult);
	});
});
