import JsonImporter from '../importer.js';
import { AsyncCompiler, initAsyncCompiler } from 'sass-embedded';

describe('resolveWordPressInternalLinks - resolve WordPress internal link format to CSS custom properties', () => {
	let compiler: AsyncCompiler;
	let jsonImporter: JsonImporter;
	let sassOptions: object;

	beforeAll(async () => {
		jsonImporter = new JsonImporter({
			loadPaths: ['./src/tests/fixtures'],
			resolveWordPressInternals: true,
		});
		compiler = await initAsyncCompiler();
		sassOptions = { importers: [jsonImporter] };
	});

	afterAll(async () => {
		await compiler.dispose();
	});

	// var(--wp--preset--color--primary) -> var(--wp--preset--color--primary)
	it('pass through resolved values', async () => {
		const result = await compiler.compileStringAsync(
			`@import "wp-theme-json.json"; body { color: $resolved-color-primary; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(
			'color: var(--wp--preset--color--primary);',
		);
	});

	// @use ... as ..., instead of @import
	it('@use, with namespace', async () => {
		const result = await compiler.compileStringAsync(
			`@use "wp-theme-json.json" as theme; body { color: theme.$color-primary; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(
			'color: var(--wp--preset--color--primary);',
		);
	});

	// var:preset|color|primary -> var(--wp--preset--color--primary)
	it('non-hyphenated link keys', async () => {
		const result = await compiler.compileStringAsync(
			`@import "wp-theme-json.json"; body { color: $color-primary; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(
			'color: var(--wp--preset--color--primary);',
		);
	});

	// var:preset|font-size|x-small -> var(--wp--preset--font-size--x-small)
	it('hyphenated link keys', async () => {
		const result = await compiler.compileStringAsync(
			`@import "wp-theme-json.json"; body { font-size: $font-size-x-small; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(
			'font-size: var(--wp--preset--font-size--x-small);',
		);
	});

	// var:preset|spacing|40 var:preset|spacing|60 -> var(--wp--preset--spacing--40) var(--wp--preset--spacing--60)
	it('multiple links in source value', async () => {
		const result = await compiler.compileStringAsync(
			`@import "wp-theme-json.json"; body { padding: $padding; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(
			'padding: var(--wp--preset--spacing--40) var(--wp--preset--spacing--60);',
		);
	});

	// var:custom|gap -> var(--wp--custom--gap)
	it('2 link keys', async () => {
		const result = await compiler.compileStringAsync(
			`@import "wp-theme-json.json"; body { gap: $custom-gap; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain('gap: var(--wp--custom--gap);');
	});

	// var:custom|control|border|color -> var(--wp--custom--control--border--color)
	it('4 link keys', async () => {
		const result = await compiler.compileStringAsync(
			`@import "wp-theme-json.json"; body { border-color: $custom-control-border-color; }`,
			sassOptions,
		);
		expect(result.css.toString()).toContain(
			'border-color: var(--wp--custom--control--border--color);',
		);
	});
});
