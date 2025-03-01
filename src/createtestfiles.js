"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
// should be removed? Usefull for creating files
/**
 * Creates a file with given data as text
 * taken from Node.js documentation at
 * https://nodejs.org/docs/latest/api/fs.html#fswritefilefile-data-options-callback
 * @param filename {string} - name of file to write
 * @param data {string} - text in created file
 */
function write_file(filename, data) {
    (0, node_fs_1.writeFile)(filename, data, function (err) {
        if (err)
            throw err;
    });
}
var data = 'Hello world';
write_file('test1.txt', data);
write_file('test2.txt', data);
write_file('test3.txt', data);
write_file('test4.txt', data);
