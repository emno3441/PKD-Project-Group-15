import { encrypt_file, decrypt_file } from './encryption';
import { List, length, head, tail, pair, is_null } from '../lib/list';
import { ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup } from '../lib/hashtables';
import { labyrinth_path } from './labyrinth';
import * as fs from 'fs';
import { labyrinth_navigator } from './gameloop';

// Converts a list of numbers into a string
export function numberListToString(list: List<number>): string {
    let str: string = '';
    while (!is_null(list)) {
        str += head(list);
        list = tail(list);
    }
    return str;
}

// Converts a string into a list of numbers
export function stringToNumberList(str: string): List<number> {
    let result: List<number> = null;
    for (let i = str.length - 1; i >= 0; i--) {
        const char = str[i];
        if (!isNaN(Number(char))) {
            result = pair(Number(char), result);
        } else {
            throw new Error(`Invalid character in input string: ${char}. Expected a number.`);
        }
    }
    return result;
}

// Universal hash function
export function universalHash(key: any, size: number): number {
    const keyString = JSON.stringify(key);
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
        hash += keyString.charCodeAt(i);
    }
    return hash % size;
}

// Inserts a key-value pair into the hashtable with resizing
export function ph_insert_with_resize<K, V>(ht: ProbingHashtable<K, V>, key: K, value: V): boolean {
    if (ht.entries >= ht.keys.length * 0.75) {
        resizeAndRehash(ht);
    }
    return ph_insert(ht, key, value);
}

// Resizes and rehashes the hashtable
export function resizeAndRehash<K, V>(ht: ProbingHashtable<K, V>): void {
    const oldKeys = ht.keys;
    const oldValues = ht.values;
    const newSize = ht.keys.length * 2;
    const newHashtable = ph_empty<K, V>(newSize, ht.hash);

    for (let i = 0; i < oldKeys.length; i++) {
        const key = oldKeys[i];
        if (key !== null && key !== undefined) {
            ph_insert(newHashtable, key, oldValues[i]!);
        }
    }

    ht.keys = newHashtable.keys;
    ht.values = newHashtable.values;
    ht.entries = newHashtable.entries;
    console.log(`Resized and rehashed hashtable to new size: ${newSize}`);
}

// Reads a hashtable from a file
export function readHashTableFromFile<K, V>(filename: string, size: number): ProbingHashtable<K, V> {
    try {
        if (!fs.existsSync(filename)) {
            console.log(`File ${filename} does not exist. Creating a new empty hashtable.`);
            return ph_empty<K, V>(size, (key: K) => universalHash(key, size));
        }

        const fileContent = fs.readFileSync(filename, 'utf-8');
        if (fileContent.trim() === '') {
            console.log(`File ${filename} is empty. Creating a new empty hashtable.`);
            return ph_empty<K, V>(size, (key: K) => universalHash(key, size));
        }

        const parsedData = JSON.parse(fileContent);
        const hashtable: ProbingHashtable<K, V> = {
            keys: parsedData.keys,
            values: parsedData.values,
            hash: (key: K) => universalHash(key, size),
            entries: parsedData.entries,
        };
        return hashtable;
    } catch (error) {
        console.error(`Error reading file ${filename}:`, error);
        return ph_empty<K, V>(size, (key: K) => universalHash(key, size));
    }
}

// Writes a hashtable to a file
export function writeHashTableToFile<K, V>(filename: string, hashtable: ProbingHashtable<K, V>): void {
    try {
        const data = JSON.stringify(
            {
                keys: hashtable.keys,
                values: hashtable.values,
                entries: hashtable.entries,
            },
            null,
            2
        );
        fs.writeFileSync(filename, data, 'utf-8');
    } catch (error) {
        console.error(`Error writing hashtable to file ${filename}:`, error);
        throw error;
    }
}

// Updates the hashtable in a file
export function updateHashTableInFile<K, V>(filename: string, size: number, key: K, value: List<number>): void {
    const hashtable = readHashTableFromFile<K, string>(filename, size);
    const valueString = numberListToString(value);
    ph_insert_with_resize(hashtable, key, valueString);
    writeHashTableToFile(filename, hashtable);
}

// Removes a key-value pair from the hashtable in a file
export function removeFromHashTableInFile<K, V>(filename: string, size: number, key: K): void {
    const hashtable = readHashTableFromFile<K, string>(filename, size);
    ph_delete(hashtable, key);
    writeHashTableToFile(filename, hashtable);
}

/**
 * Encrypts a file and stores the encryption key in a hashtable.
 * @param filename The name of the file to encrypt.
 * @param stored_keys The filename of the hashtable storing the encryption keys.
 * @param size The size of the hashtable (if a new one needs to be created).
 */
export async function gameEncryption(filename: string, stored_keys: string, size: number): Promise<void> {
    try {
        const validKey = labyrinth_path(size);
        const key = numberListToString(validKey);
        encrypt_file(filename, key);
        updateHashTableInFile(stored_keys, size, filename, validKey);
        console.log('File successfully encrypted.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error encrypting file:', error.message);
        } else {
            console.error('An unknown error occurred during encryption:', error);
        }
        throw error;
    }
}

/**
 * Decrypts a file using the key stored in a hashtable and removes the key-value pair after decryption.
 * @param filename The name of the file to decrypt.
 * @param stored_keys The filename of the hashtable storing the encryption keys.
 * @param size The size of the hashtable (if a new one needs to be created).
 */
export async function gameDecryption(filename: string, stored_keys: string, size: number): Promise<void> {
    try {
        const hashtable = readHashTableFromFile(stored_keys, size);
        const passwordToFile = ph_lookup(hashtable, filename);
        if (passwordToFile !== undefined) {
            const passwordPath = stringToNumberList(passwordToFile as string);
            const key = await labyrinth_navigator(passwordPath, size);
            const password = numberListToString(key);
            decrypt_file(filename, password);
            console.log('File decrypted successfully.');
            removeFromHashTableInFile(stored_keys, size, filename);
        } else {
            console.log('Failed to find file in table of encrypted files.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during decryption process:', error.message);
        } else {
            console.error('An unknown error occurred during decryption:', error);
        }
        throw error;
    }
}