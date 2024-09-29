# sass-json-importer

JSON importer for [sass-embedded](https://github.com/sass/embedded-host-node). Allows  `@use`ing/`@import`ing `.json` files in Sass files parsed by `sass-embedded`, using the [Importer API](https://sass-lang.com/documentation/js-api/interfaces/importer/).

## Usage
### [sass-embedded](https://github.com/sass/embedded-host-node)

```javascript
const sass = require('sass-embedded');
const jsonImporter = require('@blakedarlin/sass-json-importer');

const sassOptions = {
	importers: [ jsonImporter() ],
};

// Sync
const result = sass.compile(scssFilename, sassOptions);

// Async
const result = await sass.compileAsync(scssFilename, sassOptions);
```

## loadPaths

```javascript
loadPaths?: string[]
```

The importer accepts a `loadPaths` option, which is a string array of absolute paths. The Sass file's own parent is automatically added as the first `loadPaths` item, so there is no need to specify it.

```javascript
const result = sass.compile(scssFilename, {
	importers: [ jsonImporter({ loadPaths: [ '/some/path', '/src/node_modules' ] }) ],
});
```

## camelCase to kebab-case

```javascript
convertCase?: boolean
```

Whether to convert standard JavaScript camelCase keys into CSS/SCSS compliant kebab-case keys. Default is `false`. Example:

`variables.json`:

```json
{
	"bgBackgroundColor": 'red'
}
```

`style.scss`:

```scss
@import "variables.json";

div {
	background: $bg-background-color;
}
```

To enable the `convertCase` option:

```javascript
const result = sass.compile(scssFilename, {
	importers: [ jsonImporter({ convertCase: true }) ],
});
```

## WordPress internal links

```javascript
resolveWordPressInternals?: boolean
```

Whether to convert WordPress-style internal links to CSS custom properties. Default is `false`.

Since WordPress 6.3.0, `WP_Theme_JSON::resolve_variables` resolves the internal link format to the CSS custom property. E.g., `var:preset|color|secondary` -> `var(--wp--preset--color--secondary)`. This option likewise converts those types of values when present in the JSON.

```javascript
const result = sass.compile(scssFilename, {
	importers: [ jsonImporter({ resolveWordPressInternals: true }) ],
});
```

## Acknowledgements
This module is based on the original [node-sass-json-importer](https://www.npmjs.com/package/node-sass-json-importer) and the [sass-json-importer](https://github.com/neild3r/sass-json-importer). Unfortunately, neither handles WordPress's theme.json file correctly.
