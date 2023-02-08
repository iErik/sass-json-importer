import * as path from 'path';
import * as fs from 'fs';
import _ from 'lodash';


interface ConvertOpts {
    convertCase?: boolean
}
interface ImporterOptions {
    loadPaths?: Array<string>
}

export default class Importer
{
    protected options: ImporterOptions;

    constructor(options: ImporterOptions = {})
    {
        this.options = options;
    }

    public canonicalize(url: string)
    {
        if (!this.isJSONfile(url)) {
            return null;
        }

        if (this.options.loadPaths) {
            for (let index = 0; index < this.options.loadPaths.length; index++) {
                const possible = this.options.loadPaths[index];
                const resolved = path.resolve(possible + '/' + url);

                if (fs.existsSync(resolved)) {
                    return new URL('file:' + resolved);
                }
            }
        }

        return null;
    }

    public load(url: URL)
    {
        let json: object = this.loadJSONfromPath(url.pathname);
        let contents = this.transformJSONtoSass(json);

        return {
            contents: contents,
            syntax: 'scss'
        };
    }

    public isJSONfile(url: string) {
        return /\.js(on5?)?$/.test(url);
    }

    protected loadJSONfromPath(path: string)
    {
        return JSON.parse(fs.readFileSync(path).toString());
    }

    protected transformJSONtoSass(json: object, opts: ConvertOpts = {}) {
        return Object.keys(json)
            .filter((key: string) => this.isValidKey(key))
            .filter((key: string) => json[key as keyof object] !== '#')
            .map((key:string) => `$${opts.convertCase ? this.toKebabCase(key) : key}: ${this.parseValue(json[key as keyof object], opts)};`)
            .join('\n');
    }

    protected isValidKey(key: string): boolean
    {
        return /^[^$@:].*/.test(key)
    }

    protected toKebabCase(key: string): string
    {
        return key
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
            .toLowerCase();
    }

    protected parseValue(value: any, opts = {}): any
    {
        if (_.isArray(value)) {
        return this.parseList(value, opts);
        } else if (_.isPlainObject(value)) {
        return this.parseMap(value, opts);
        } else if (value === '') {
        return '""'; // Return explicitly an empty string (Sass would otherwise throw an error as the variable is set to nothing)
        } else {
        return value;
        }
    }

    protected parseList(list: Array<any>, opts = {}) {
        return `(${list
            .map((value: any) => this.parseValue(value))
            .join(',')})`;
    }

    protected parseMap(map: object, opts:ConvertOpts = {}) {
        return `(${Object.keys(map)
            .filter(key => this.isValidKey(key))
            .map(key => `${opts.convertCase ? this.toKebabCase(key) : key}: ${this.parseValue(map[key as keyof object], opts)}`)
            .join(',')})`;
    }
}
