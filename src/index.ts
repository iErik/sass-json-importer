import JsonImporter from './importer.js';

export default function getJsonImporter(config: object = {}) {
	return new JsonImporter(config);
}
