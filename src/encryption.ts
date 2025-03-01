import { 
    createReadStream, ReadStream, WriteStream, createWriteStream, unlinkSync, PathOrFileDescriptor,
    readFileSync, writeFileSync
 } from 'node:fs';
import { argv } from 'node:process';
import { createHash, createCipheriv, createDecipheriv, randomBytes, Decipher, Cipher, pbkdf2Sync, BinaryLike } from 'node:crypto';
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

    hash.update(password, 'utf-8');

    return hash.digest('hex');
}

function deriveKeyAndIV(password: string, salt: BinaryLike) {
    const iterations = 100000; // Number of iterations for PBKDF2
    const keyLength = 32; // Key length for AES-256
    const ivLength = 16; // IV length for AES

    // Derive the key using PBKDF2
    const key = pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');
    const iv = key.slice(0, ivLength); // Use the first 16 bytes as the IV
    return { key, iv };
}

/** Encrypts file
 * taken https://mohammedshamseerpv.medium.com/encrypt-and-decrypt-files-in-node-js-a-step-by-step-guide-using-aes-256-cbc-c25b3ef687c3
 * @param filename - name of file to be encrypted
 * @param password - hashed correct password to file
 */
export function encrypt_file(filename: string, password: string) {
    try {
        // Generate a random salt
        const salt = randomBytes(16);
    
        // Derive the key and IV from the passphrase and salt
        const { key, iv } = deriveKeyAndIV(password, salt);
    
        // Read the file data
        const fileData = readFileSync(filename);
    
        // Create cipher
        const cipher = createCipheriv(algorithm, key, iv);
    
        // Encrypt the data
        const encryptedData = Buffer.concat([cipher.update(fileData), cipher.final()]);
    
        // Write the salt and encrypted data back to the file
        writeFileSync(filename, Buffer.concat([salt, encryptedData]));
  
    } catch (error) {
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
export function decrypt_file(filename: string, password: string) {
    try {
        // Read the file data
        const fileData = readFileSync(filename);
    
        // Extract the salt (first 16 bytes) and the encrypted data
        const salt = fileData.slice(0, 16);
        const encryptedData = fileData.slice(16);
    
        // Derive the key and IV from the passphrase and extracted salt
        const { key, iv } = deriveKeyAndIV(password, salt);
    
        // Create decipher
        const decipher = createDecipheriv(algorithm, key, iv);
    
        // Decrypt the data
        const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    
        // Write the decrypted data back to the file
        writeFileSync(filename, decryptedData);
  
    } catch (error) {
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
 *//*
function create_iv(password: string): Buffer<ArrayBufferLike>{
    const iv: Buffer<ArrayBufferLike> = createHash("sha1").update(password, "utf8").digest().subarray(0, 16); // 16 bytes

    return iv;
}    
*/


// Encryption settings
const algorithm = 'aes-256-cbc'; // Algorithm to use

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





