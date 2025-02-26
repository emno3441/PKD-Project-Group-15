import { createReadStream } from 'node:fs';
import { argv } from 'node:process';
import { createHash } from 'node:crypto';
import { PathOrFileDescriptor, readFile, writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';




function encrypt_file() {
    function get_hash() {
        input.on('readable', () => {
            // Only one element is going to be produced by the
            // hash stream.
            const data = input.read();
            if (data)
                hash.update(data);
            else {
                write_file(`${hash.digest('hex')}`);
            }
        });
    }
    
    /*
    function read_file(file: PathOrFileDescriptor) {
        // file name should be user input, should return encrypted file?
        readFile(file, 'utf8', (err: NodeJS.ErrnoException | null, data: String): String | undefined => {
            if (err) throw err;
            return data;
        });
    } */
    
    function write_file(data: any): void {
        writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        }); 
    }
    // user imput
    const filename = argv[2];

    const hash = createHash('sha256');

    const input = createReadStream(filename);
    
    get_hash();
}

const content = 'Some content!';
const secret = 'abcdefg';
//const hash = get_hash(secret);
//console.log(hash);

const file = 'test.txt';
console.log(encrypt_file());



