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

const Font = require('fonteditor-core-mod').Font;
const fs = require('fs');

console.time('read');

// read font file
let buffer = fs.readFileSync('./font.ttf');
console.timeEnd('read');
console.time('create');
// read font data
let font = Font.create(buffer, {
    type: 'ttf', // support ttf, woff, woff2, eot, otf, svg
    // subset: [65, 66], // only read `a`, `b` glyf
    // hinting: true, // save font hinting
    // compound2simple: true, // transform ttf compound glyf to simple
    // inflate: null, // inflate function for woff
    // combinePath: false, // for svg path
});
console.timeEnd('create');
console.time('get');
let fontObject = font.get();
let glyf = fontObject.glyf;
// console.log(glyf);
let unicodeMap = {
    "uni539B": "uni58C1",
    "uni64D9": "uni5904",
    "uni6601": "uni60B8",
    "uni69C2": "uni6CE5",
    "uni931C": "uni7750",
    "uni9EF1": "uni9894"
};
let unicodeValues = Object.values(unicodeMap);
console.log(unicodeValues);
let glyfMap = {};

for (let glyfItem of glyf) {
    glyfMap[glyfItem.name] = glyfItem;
}

for (let unicodeKey in unicodeMap) {
    let unicodeValue = unicodeMap[unicodeKey];
    let newGlyph = {
        ...glyfMap[unicodeValue]
    };
    newGlyph.name = unicodeKey;
    newGlyph.unicode = [parseInt(unicodeKey.replace('uni', ''), 16)];
    glyfMap[newGlyph.name] = newGlyph;
}

let newGlyf = [];
for (let glyfMapKey in glyfMap) {
    glyfMapItem = glyfMap[glyfMapKey];
    if (Object.keys(unicodeMap).includes(glyfMapKey)) {
        newGlyf.splice(1000, 0, glyfMapItem);
    } else {
        newGlyf.push(glyfMapItem);
    }
}

let uid = 4306173;
let uid16 = uid.toString(16);
newGlyf.splice(2, 0, {
    name: '.notdef.' + uid,
});
newGlyf.splice(3, 0, {
    name: '.notdef.' + uid16,
});
fontObject.glyf = newGlyf;
console.timeEnd('get');

console.time('write');
let bufferWrite = font.write({
    type: 'ttf', // support ttf, woff, woff2, eot, svg
    // hinting: true, // save font hinting
    // deflate: null, // deflate function for woff
});
console.timeEnd('write');
console.time('writeFile');
fs.writeFileSync('./font2.ttf', bufferWrite);
console.timeEnd('writeFile');

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
