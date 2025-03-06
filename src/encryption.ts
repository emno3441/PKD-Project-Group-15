import { readFileSync, writeFileSync } from 'node:fs';
import { createHash, createCipheriv, createDecipheriv, Decipher, Cipher, Hash, randomBytes, pbkdf2Sync} from 'node:crypto';
import { Buffer } from 'node:buffer';

/** Creates hash of password
 * @param {string} password - password
 * @returns {string} - hash of password
 */
//export function get_hash(password: string): string {
//    const hash: Hash = createHash('sha256');
//    
//    hash.update(password, 'utf-8');
//
//    const hashed_password: string = hash.digest('hex');
//
//    return hashed_password;
//}

/** Encrypts file with algorithm aes-256-cbc, with salt as first 16 bytes
 * @param {string} filename - name of file to be encrypted
 * @param {string} password - hashed correct password to file
 */
export function encrypt_file(filename: string, password: string): void {
    try {
        const filedata: Buffer<ArrayBufferLike> = readFileSync(filename);

        const salt: Buffer<ArrayBufferLike> = randomBytes(16);

        const iv: Buffer<ArrayBufferLike> = create_iv(password, salt);

        const key: Buffer<ArrayBufferLike> = get_key(password, salt);

        const cipher: Cipher = createCipheriv(algorithm, key, iv);

        let encrypted: Buffer<ArrayBufferLike> = cipher.update(filedata);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        writeFileSync(filename, Buffer.concat([salt, encrypted]));

    } catch (error) {
        throw new Error('Error during encryption');
    }
}


/** Decrypts encrypted file with algorithm aes-256-cbc, takes salt as first 16 bytes
 * @param {string} filename - filepath of file to be decrypted
 * @param {string} password - hashed password to file that was used for encryption
 */
export function decrypt_file(filename: string, password: string): void {
    try {
        const filedata: Buffer<ArrayBufferLike> = readFileSync(filename);

        const salt: Buffer<ArrayBufferLike> = filedata.slice(0, 16);

        const encrypteddata: Buffer<ArrayBufferLike> = filedata.slice(16);

        const key: Buffer<ArrayBufferLike> = get_key(password, salt);

        const iv: Buffer<ArrayBufferLike> = create_iv(password, salt);

        const decipher: Decipher = createDecipheriv(algorithm, key, iv);

        let decrypted: Buffer<ArrayBufferLike> = decipher.update(encrypteddata);

        decrypted = Buffer.concat([decrypted, decipher.final()]);
    
        writeFileSync(filename, decrypted);     

    } catch (error) {
        throw new Error('Error during decryption');
    }
}

/** Creates initialization vector for algorithm aes-256-cbc
 * @param {string} password - password for file
 * @param {Buffer<ArrayBufferLike>} salt - salt used in encryption
 * @returns {Buffer<ArrayBufferLike>} - initialization vector for algorithm aes-256-cbc
 */
function create_iv(password: string, salt: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
    const key_length: number = 16;
    const iterations: number = 100000;
    const digest: string = 'sha1'

    return pbkdf2Sync(password, salt, iterations, key_length, digest);
}   

/** Creates key for algorithm aes-256-cbc
 * @param {string} password - password for file
 * @param {Buffer<ArrayBufferLike>} salt - salt used in encryption
 * @returns {Buffer<ArrayBufferLike>} - key for algorithm aes-256-cbc
 */
function get_key(password: string, salt: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
    const key_length: number = 32;
    const iterations: number = 100000;
    const digest: string = 'sha256'

    return pbkdf2Sync(password, salt, iterations, key_length, digest);
}

// Algorithm used for encryption
const algorithm: string = 'aes-256-cbc';