import { readFileSync } from 'node:fs';
import { encrypt_file, decrypt_file, get_hash } from '../src/encryption';



// will not work if test files already exist in map
test('File encrypted and decrypted', () => {
    const key: string = 'key';
    const filename: string = '../tests/test1.txt';

    const unhandled_file: string = readFileSync(filename, 'utf8');

    encrypt_file(filename, key);
    decrypt_file(filename, key);

    const handled_file: string = readFileSync(filename, 'utf8');


    expect(handled_file).toStrictEqual(unhandled_file);
});

// will not work if test files already exist in map
test('Wrong key used to decrypt file', () => {
    const key: string = 'key';
    const wrong_key: string = 'lock'
    const filename: string = '../tests/test2.txt';

    const unhandled_file: string = readFileSync(filename, 'utf8');

    encrypt_file(filename, key);

    expect(() => decrypt_file(filename, wrong_key)).toThrow();
});

test('Same key hashes to same value', () => {
    const key1: string = 'key';
    const key2: string = 'key';

    expect(get_hash(key1)).toStrictEqual(get_hash(key2));
});

test('Keys does not hash to same value', () => {
    const key1: string = 'key';
    const key2: string = 'lock';

    expect(get_hash(key1)).not.toStrictEqual(get_hash(key2));
});

// will not work if test files already exist in map
test('Encrypt_file changes file', () => {
    const key: string = 'key';
    const filename: string = '../tests/test3.txt';

    const original_file: string = readFileSync(filename, 'utf8');

    encrypt_file(filename, key);

    const encrypted_file: string = readFileSync(filename, 'utf8');

    expect(original_file).not.toStrictEqual(encrypted_file);
});

test('Encrypt_file on non-existing file results in error', () => {
    const key: string = 'key';
    const filename: string = '../tests/test99.txt';

    expect(() => encrypt_file(filename, key)).toThrow();
});