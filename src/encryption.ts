import { createReadStream, ReadStream, createWriteStream, unlinkSync, readFileSync } from 'node:fs';
import { argv } from 'node:process';
import { createHash, createCipheriv, createDecipheriv, randomBytes, BinaryLike } from 'node:crypto';
import { PathOrFileDescriptor, readFile, writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

// should be in main?
function get_filename(): string{
    // user imput
    const filename = argv[2];

    return filename;
}


/**
 * Creates hash of password
 * @param password - password
 * @returns {string} - hash of password
 */
export function get_hash(password: string) {

    const hash = createHash('sha256');

    hash.update(password);

    return hash.digest('hex');
}


/** Encrypts file
 * taken from https://blog.nodejslab.com/encrypt-decrypt-files-with-node-js/
 * @param filename - name of file to be encrypted
 * @param password - hashed correct password to file
 */
export function encrypt_file(filename: string, password: string): void {

    // Create an initialization vector
    let iv = createHash("sha1").update(password, "utf8").digest().subarray(0, 16); // 16 bytes

    let cipher = createCipheriv("aes-256-cbc", createHash("sha256").update(password, "utf8").digest(), iv);

    let input = createReadStream(filename);
    let output = createWriteStream(filename + '.enc');

    input.pipe(cipher).pipe(output);

    output.on('finish', function () {
        console.log('>>> File ' + filename + ' encrypted as ' + filename + '.enc');
        unlinkSync(filename);
    });
}


/**
 * Decrypts encrypted file
 * taken from https://blog.nodejslab.com/encrypt-decrypt-files-with-node-js/
 * @param filename - name of file to be decrypted
 * @param password - hashed correct password to file
 */
export function decrypt_file(filename: string, password: string): void {

    let iv = createHash("sha1").update(password, "utf8").digest().subarray(0, 16); // 16 bytes

    let decipher = createDecipheriv("aes-256-cbc", createHash("sha256").update(password, "utf8").digest(), iv);

    const filename_enc: string = filename + '.enc';

    let input = createReadStream(filename_enc);
    let output = createWriteStream(filename);

    input.pipe(decipher).pipe(output);

    output.on('finish', function () {
        console.log('<<< File ' + filename_enc + ' decrypted as ' + filename);
        unlinkSync(filename_enc);
    });
}

/*
function read_file(file) {
    // file name should be user input, should return encrypted file?
    readFile(file, 'utf8', (err: NodeJS.ErrnoException | null, data: String): String | undefined => {
        if (err) throw err;
        return data;
    });
} 

function write_file(data: any): void {
    writeFile(filename, data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
} */

// Encryption settings
const algorithm = 'aes-256-cbc'; // Algorithm to use
const key = 'a key';


// unused
const content = 'Some content!';
const secret = 'abcdefg';
const file = 'test.txt';
//const hash = get_hash(secret);
//console.log(hash);

const filename: string = get_filename();

// console.log(encrypt_file(filename, key));
// console.log(decrypt_file(filename, key));
// console.log(get_hash(key));
// console.log(get_hash(secret));




