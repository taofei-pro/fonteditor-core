/**
 * @file name表
 * @author mengke01(kekee000@gmail.com)
 */

import table from './table';
import nameIdTbl from '../enum/nameId';
import string from '../util/string';
import platformTbl from '../enum/platform';
import {mac, win} from '../enum/encoding';

export default table.create(
    'name',
    [],
    {

        read(reader) {
            let offset = this.offset;
            reader.seek(offset);

            const nameTbl = {};
            nameTbl.format = reader.readUint16();
            nameTbl.count = reader.readUint16();
            nameTbl.stringOffset = reader.readUint16();

            const nameRecordTbl = [];
            const count = nameTbl.count;
            let i;
            let nameRecord;

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

            offset += nameTbl.stringOffset;

            // 读取字符名字
            for (i = 0; i < count; ++i) {
                nameRecord = nameRecordTbl[i];
                nameRecord.name = reader.readBytes(offset + nameRecord.offset, nameRecord.length);
            }

            return nameRecordTbl;
        },

        write(writer, ttf) {
            const nameRecordTbl = ttf.support.name;

            writer.writeUint16(0); // format
            writer.writeUint16(nameRecordTbl.length); // count
            writer.writeUint16(6 + nameRecordTbl.length * 12); // string offset

            // write name tbl header
            let offset = 0;
            nameRecordTbl.forEach((nameRecord) => {
                writer.writeUint16(nameRecord.platform);
                writer.writeUint16(nameRecord.encoding);
                writer.writeUint16(nameRecord.language);
                writer.writeUint16(nameRecord.nameId);
                writer.writeUint16(nameRecord.name.length);
                writer.writeUint16(offset); // offset
                offset += nameRecord.name.length;
            });

            // write name tbl strings
            nameRecordTbl.forEach((nameRecord) => {
                writer.writeBytes(nameRecord.name);
            });

            return writer;
        },

        size(ttf) {
            const names = ttf.name;
            let nameRecordTbl = names;

            let size = 6;
            nameRecordTbl.forEach(function (nameRecord) {
                size += 12 + nameRecord.name.length;
            });

            ttf.support.name = nameRecordTbl;

            return size;
        }
    }
);
