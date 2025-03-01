"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_hash = get_hash;
exports.encrypt_file = encrypt_file;
exports.decrypt_file = decrypt_file;
var node_fs_1 = require("node:fs");
var node_process_1 = require("node:process");
var node_crypto_1 = require("node:crypto");
var node_buffer_1 = require("node:buffer");
// should be in main?
function get_filename() {
    // user imput
    var filename = node_process_1.argv[2];
    return filename;
}
/**
 * Creates hash of password
 * @param password - password
 * @returns {string} - hash of password
 */
function get_hash(password) {
    var hash = (0, node_crypto_1.createHash)('sha256');
    hash.update(password, 'utf-8');
    return hash.digest('hex');
}
function deriveKeyAndIV(password, salt) {
    var iterations = 100000; // Number of iterations for PBKDF2
    var keyLength = 32; // Key length for AES-256
    var ivLength = 16; // IV length for AES
    // Derive the key using PBKDF2
    var key = (0, node_crypto_1.pbkdf2Sync)(password, salt, iterations, keyLength, 'sha256');
    var iv = key.slice(0, ivLength); // Use the first 16 bytes as the IV
    return { key: key, iv: iv };
}
/** Encrypts file
 * taken https://mohammedshamseerpv.medium.com/encrypt-and-decrypt-files-in-node-js-a-step-by-step-guide-using-aes-256-cbc-c25b3ef687c3
 * @param filename - name of file to be encrypted
 * @param password - hashed correct password to file
 */
function encrypt_file(filename, password) {
    try {
        // Generate a random salt
        var salt = (0, node_crypto_1.randomBytes)(16);
        // Derive the key and IV from the passphrase and salt
        var _a = deriveKeyAndIV(password, salt), key = _a.key, iv = _a.iv;
        // Read the file data
        var fileData = (0, node_fs_1.readFileSync)(filename);
        // Create cipher
        var cipher = (0, node_crypto_1.createCipheriv)(algorithm, key, iv);
        // Encrypt the data
        var encryptedData = node_buffer_1.Buffer.concat([cipher.update(fileData), cipher.final()]);
        // Write the salt and encrypted data back to the file
        (0, node_fs_1.writeFileSync)(filename, node_buffer_1.Buffer.concat([salt, encryptedData]));
    }
    catch (error) {
        throw new Error('Error during encryption');
    }
}
/*
export function encrypt_file(filename: string, password: string): void {
from https://blog.nodejslab.com/encrypt-decrypt-files-with-node-js/
    const filename_enc: string = filename + '.enc';

    const iv: Buffer<ArrayBufferLike> = create_iv(password);

    const cipher: Cipher = createCipheriv("aes-256-cbc", createHash("sha256").update(password, "utf8").digest(), iv);

    let input: ReadStream = createReadStream(filename);
    let output: WriteStream = createWriteStream(filename_enc);

    input.pipe(cipher).pipe(output);

    output.on('finish', function () {
        unlinkSync(filename);
   });
} */
/**
 * Decrypts encrypted file
 * taken from https://mohammedshamseerpv.medium.com/encrypt-and-decrypt-files-in-node-js-a-step-by-step-guide-using-aes-256-cbc-c25b3ef687c3
 * @param filename - name of file to be decrypted
 * @param password - hashed password to file that was used for encryption
 */
function decrypt_file(filename, password) {
    try {
        // Read the file data
        var fileData = (0, node_fs_1.readFileSync)(filename);
        // Extract the salt (first 16 bytes) and the encrypted data
        var salt = fileData.slice(0, 16);
        var encryptedData = fileData.slice(16);
        // Derive the key and IV from the passphrase and extracted salt
        var _a = deriveKeyAndIV(password, salt), key = _a.key, iv = _a.iv;
        // Create decipher
        var decipher = (0, node_crypto_1.createDecipheriv)(algorithm, key, iv);
        // Decrypt the data
        var decryptedData = node_buffer_1.Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        // Write the decrypted data back to the file
        (0, node_fs_1.writeFileSync)(filename, decryptedData);
    }
    catch (error) {
        throw new Error('Error during decryption');
    }
}
/*
export function decrypt_file(filename: string, password: string): void {
https://blog.nodejslab.com/encrypt-decrypt-files-with-node-js/
//    const filename_enc: string = filename + '.enc';

    const iv: Buffer<ArrayBufferLike> = create_iv(password);

    const decipher: Decipher = createDecipheriv("aes-256-cbc", createHash("sha256").update(password, "utf8").digest(), iv);

    let input: ReadStream = createReadStream(filename_enc);
    let output: WriteStream = createWriteStream(filename);

    input.pipe(decipher).pipe(output);

    output.on('finish', function () {
        unlinkSync(filename_enc);
    });
}
/**
 *
 * @param password {string} - password
 * @returns iv {Buffer<ArrayBufferLike>} - initialization vector for ciphering/deciphering
 */ /*
function create_iv(password: string): Buffer<ArrayBufferLike>{
   const iv: Buffer<ArrayBufferLike> = createHash("sha1").update(password, "utf8").digest().subarray(0, 16); // 16 bytes

   return iv;
}
*/
// Encryption settings
var algorithm = 'aes-256-cbc'; // Algorithm to use
/*
const password: string = 'a key';
const key: string = get_hash(password);


// unused
const content = 'Some content!';
const secret = 'abcdefg';
const file = 'test.txt';
//const hash = get_hash(secret);
//console.log(hash);


const filename: string = get_filename();

// encrypt_file(filename, key);
// decrypt_file(filename, key);
// console.log(get_hash(key));
// console.log(get_hash(secret));

// write_file(filename, 'hello world');*/
