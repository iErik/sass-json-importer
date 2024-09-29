import getJsonImporter from '../index.js';
import JsonImporter from '../importer.js';

describe('getJsonImporter', () => {
	it('should create a new JsonImporter', () => {
		const importer = getJsonImporter();

		expect(importer).toBeInstanceOf(JsonImporter);
	});
});
