const { createHmac } = require('node:crypto');
import { PathOrFileDescriptor, readFile, writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

function get_hash(file: String, key: String): String {
    const hash = createHmac('sha256', file)
                    .update(key)
                    .digest('hex');
    return hash;
}

function read_file(file: PathOrFileDescriptor) {
    // file name should be user input, should return encrypted file?
    readFile(file, 'utf8', (err: NodeJS.ErrnoException | null, data: String): String | undefined => {
        if (err) throw err;
        return data;
    });
}

function write_file(file: PathOrFileDescriptor, content: string | NodeJS.ArrayBufferView<ArrayBufferLike>): void {
    writeFile(file, content, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    }); 
}

const secret = 'abcdefg';
//const hash = get_hash(secret);
//console.log(hash);

const file = 'test.txt';
console.log(read_file(file));

const content = 'Some content!';

