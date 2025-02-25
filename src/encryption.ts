const { createHmac } = require('node:crypto');
const fs = require('node:fs');

function get_hash(file: String): String {
    const hash = createHmac('sha256', file)
                    .digest('hex');
    return hash;
}

function read_file(file: String) {
    // file name should be user input, should return encrypted file?
    fs.readFile(file, 'utf8', (err: Error, data: String): String | undefined => {
        if (err) {
        console.error(err);
        return;
        }
        return data;
    });
}

const secret = 'abcdefg';
//const hash = get_hash(secret);
//console.log(hash);

const file: String = 'test.txt';
console.log(read_file(file));
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e

