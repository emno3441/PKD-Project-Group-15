import { createReadStream, ReadStream, createWriteStream, unlinkSync, readFileSync } from 'node:fs';
import { argv } from 'node:process';
import { createHash, createCipheriv, createDecipheriv, randomBytes, BinaryLike } from 'node:crypto';
import { PathOrFileDescriptor, readFile, writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

// should be in main?
function get_filename() {
    // user imput
    const filename = argv[2];

    // should be in main and input to functions that create same hash ? 
    const hash = createHash('sha256');

    const input = createReadStream(filename);

    return filename;
}

/*
// change to return hex
function get_hash(): void {
    input.on('readable', () => {
        // Only one element is going to be produced by the
        // hash stream.
        const data = input.read();
        if (data)
            hash.update(data);
        else {
            console.log(`${hash.digest('hex')}`);
        }
    });
}*/

// filename should be input ??
export function encrypt_file(password: string) {
/*
    function encrypt_data(data: BinaryLike) {
        let cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted.toString('hex')
        };
    }*/
    
    /*
    function read_file(file) {
        // file name should be user input, should return encrypted file?
        readFile(file, 'utf8', (err: NodeJS.ErrnoException | null, data: String): String | undefined => {
            if (err) throw err;
            return data;
        });
    } 
    
    // change to save under name *filename*_encrypted.txt
    function write_file(data: any): void {
        writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    } */

    const filename = get_filename();

    const buffer = readFileSync(filename);

    // Create an initialization vector
    let iv = createHash("sha1").update(password, "utf8").digest().subarray(0, 16); // 16 bytes

    /*
    const key = randomBytes(16);
    // Create a new cipher using the algorithm, key, and iv
    const cipher = createCipheriv(algorithm, key, iv);
    // Create the new (encrypted) buffer
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;

    */
    let cipher = createCipheriv("aes-256-cbc", createHash("sha256").update(password, "utf8").digest(), iv);

    let input = createReadStream(filename);
    let output = createWriteStream(filename + '.enc');

    input.pipe(cipher).pipe(output);

    output.on('finish', function () {
        console.log('>>> File ' + filename + ' encrypted as ' + filename + '.enc');
        unlinkSync(filename);
    });
}


// filename should be input ??
function decrypt_file(filename: string, password: string) {

    let iv = createHash("sha1").update(password, "utf8").digest().subarray(0, 16); // 16 bytes

    let decipher = createDecipheriv("aes-256-cbc", createHash("sha256").update(password, "utf8").digest(), iv);

    let input = createReadStream(filename);
    let output = createWriteStream(filename.replace('.enc', ''));

    input.pipe(decipher).pipe(output);

    output.on('finish', function () {
        console.log('<<< File ' + filename + ' decrypted as ' + filename.replace('.enc', ''));
        unlinkSync(filename);
    });
}

// Encryption settings
const algorithm = 'aes-256-cbc'; // Algorithm to use
const key = 'a key';

// unused
const content = 'Some content!';
const secret = 'abcdefg';
const file = 'test.txt';
//const hash = get_hash(secret);
//console.log(hash);


// console.log(encrypt_file(key));
console.log(decrypt_file('../text2.txt.enc', key));




