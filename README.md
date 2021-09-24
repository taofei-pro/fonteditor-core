# fonteditor-core

**FontEditor core functions**

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][npm-url]

## Feature

- sfnt parse
- read, write, transform fonts
  - ttf (read and write)
  - woff (read and write)
  - woff2 (read and write)
  - eot (read and write)
  - svg (read and write)
  - otf (only read)
- ttf glyph adjust
- svg to glyph

## Usage

```js

// read font file
var Font = require('fonteditor-core').Font;
var fs = require('fs');
var bufferRead = fs.readFileSync('./font.ttf');

let buffer = fs.readFileSync('font.ttf');
// read font data
var font = Font.create(bufferRead, {
  type: 'ttf', // support ttf,woff,eot,otf,svg
});
var fontObject = font.get();
fontObject.glyf.push({
    name: '.notdef.999999999',
});

// write font file
var bufferWrite = font.write({
  type: 'ttf', // support ttf,woff,eot,otf,svg
});
fs.writeFileSync('./font-new.ttf', bufferWrite);

```

## Related

- [fonteditor-core](https://github.com/kekee000/fonteditor-core)
- [fonteditor](https://github.com/ecomfe/fonteditor)
- [fontmin](https://github.com/ecomfe/fontmin)
- [fonteditor online](http://fontstore.baidu.com/editor)

## License

MIT © Fonteditor

[downloads-image]: http://img.shields.io/npm/dm/fonteditor-core.svg
[npm-url]: https://npmjs.org/package/fonteditor-core
[npm-image]: http://img.shields.io/npm/v/fonteditor-core.svg

[travis-url]: https://travis-ci.org/kekee000/fonteditor-core
[travis-image]: http://img.shields.io/travis/kekee000/fonteditor-core.svg
