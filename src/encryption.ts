import { readFileSync, writeFileSync } from 'node:fs';
import { createHash, createCipheriv, createDecipheriv, Decipher, Cipher, Hash} from 'node:crypto';
import { Buffer } from 'node:buffer';

/**
 * Creates hash of password
 * @param password - password
 * @returns {string} - hash of password
 */
export function get_hash(password: string): string {
    const hash: Hash = createHash('sha256');

    return hash.update(password, 'utf-8').digest('hex');
}

/** Encrypts file
 * @param filename - name of file to be encrypted
 * @param password - hashed correct password to file
 */
export function encrypt_file(filename: string, password: string): void {
    try {
        const filedata: Buffer<ArrayBuffer>  = readFileSync(filename);

        const iv: Buffer<ArrayBufferLike> = create_iv(password);

        const key: Buffer<ArrayBuffer> = get_key(password);

        const cipher: Cipher = createCipheriv(algorithm, key, iv);

        let encrypted: Buffer<ArrayBufferLike> = cipher.update(filedata);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        writeFileSync(filename, encrypted);

    } catch (error) {
        throw new Error('Error during encryption');
    }
}


/**
 * Decrypts encrypted file
 * @param filename - name of file to be decrypted
 * @param password - hashed password to file that was used for encryption
 */
export function decrypt_file(filename: string, password: string): void {
    try {
        const iv: Buffer<ArrayBufferLike> = create_iv(password);

        const filedata: Buffer<ArrayBufferLike> = readFileSync(filename);

        const key: Buffer<ArrayBuffer> = get_key(password);

        const decipher: Decipher = createDecipheriv(algorithm, key, iv);

        let decrypted: Buffer<ArrayBufferLike> = decipher.update(filedata);

        decrypted = Buffer.concat([decrypted, decipher.final()]);
    
        writeFileSync(filename, decrypted);     

    } catch (error) {
        throw new Error('Error during decryption');
    }
}

/**
 * 
 * @param password {string} - password
 * @returns iv {Buffer<ArrayBufferLike>} - initialization vector for ciphering/deciphering
 */
function create_iv(password: string): Buffer<ArrayBufferLike> {
    return createHash("sha1").update(password, "utf8").digest().subarray(0, 16); // 16 bytes
}   

function get_key(password: string): Buffer<ArrayBuffer> {
    return createHash("sha256").update(password, "utf8").digest();
}


const algorithm: string = 'aes-256-cbc';

