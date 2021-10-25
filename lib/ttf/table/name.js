"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _table = _interopRequireDefault(require("./table"));

var _nameId = _interopRequireDefault(require("../enum/nameId"));

var _string = _interopRequireDefault(require("../util/string"));

var _platform = _interopRequireDefault(require("../enum/platform"));

var _encoding = require("../enum/encoding");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @file name表
 * @author mengke01(kekee000@gmail.com)
 */
var _default = _table["default"].create('name', [], {
  read: function read(reader) {
    var offset = this.offset;
    reader.seek(offset);
    var nameTbl = {};
    nameTbl.format = reader.readUint16();
    nameTbl.count = reader.readUint16();
    nameTbl.stringOffset = reader.readUint16();
    var nameRecordTbl = [];
    var count = nameTbl.count;
    var i;
    var nameRecord;

    for (i = 0; i < count; ++i) {
      nameRecord = {};
      nameRecord.platform = reader.readUint16();
      nameRecord.encoding = reader.readUint16();
      nameRecord.language = reader.readUint16();
      nameRecord.nameId = reader.readUint16();
      nameRecord.length = reader.readUint16();
      nameRecord.offset = reader.readUint16();
      nameRecordTbl.push(nameRecord);
    }

    offset += nameTbl.stringOffset; // 读取字符名字

    for (i = 0; i < count; ++i) {
      nameRecord = nameRecordTbl[i];
      nameRecord.name = reader.readBytes(offset + nameRecord.offset, nameRecord.length);
    }

    return nameRecordTbl;
  },
  write: function write(writer, ttf) {
    var nameRecordTbl = ttf.support.name;
    writer.writeUint16(0); // format

    writer.writeUint16(nameRecordTbl.length); // count

    writer.writeUint16(6 + nameRecordTbl.length * 12); // string offset
    // write name tbl header

    var offset = 0;
    nameRecordTbl.forEach(function (nameRecord) {
      writer.writeUint16(nameRecord.platform);
      writer.writeUint16(nameRecord.encoding);
      writer.writeUint16(nameRecord.language);
      writer.writeUint16(nameRecord.nameId);
      writer.writeUint16(nameRecord.name.length);
      writer.writeUint16(offset); // offset

      offset += nameRecord.name.length;
    }); // write name tbl strings

    nameRecordTbl.forEach(function (nameRecord) {
      writer.writeBytes(nameRecord.name);
    });
    return writer;
  },
  size: function size(ttf) {
    var names = ttf.name;
    var nameRecordTbl = names;
    var size = 6;
    nameRecordTbl.forEach(function (nameRecord) {
      size += 12 + nameRecord.name.length;
    });
    ttf.support.name = nameRecordTbl;
    return size;
  }
});

exports["default"] = _default;