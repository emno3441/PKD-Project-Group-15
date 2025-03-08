import {readFile, writeFile} from "node:fs";
import { List, length, head, tail } from "../lib/list";
import {ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup, HashFunction} from "../lib/hashtables";
import { labyrinth_path } from "./labyrinth";
import { console } from "node:inspector";
import * as fs from 'fs';


export function universalHash(key: any, size: number): number {
  const keyString = JSON.stringify(key);
  let hash = 0;
  for (let i = 0; i < keyString.length; i++) {
      hash += keyString.charCodeAt(i);
  }
  return hash % size;
}

export function readHashTableFromFile<K, V>(
  filename: string,
  size: number
): ProbingHashtable<K, V> {
  try {
      // Check if the file exists and is not empty
      if (!fs.existsSync(filename) || fs.readFileSync(filename, 'utf-8').trim() === '') {
          console.log(`File ${filename} is empty or does not exist. Creating a new empty hashtable.`);
          return ph_empty<K, V>(size, (key: K) => universalHash(key, size));
      }

      // Read the file content
      const data = fs.readFileSync(filename, 'utf-8');

      // Parse the JSON string back into an object
      const parsedData = JSON.parse(data);

      // Reconstruct the hashtable
      const hashtable: ProbingHashtable<K, V> = {
          keys: parsedData.keys,
          values: parsedData.values,
          hash: (key: K) => universalHash(key, size), // Use the universal hash function
          entries: parsedData.entries
      };

      console.log(`Hashtable read from ${filename}`);
      return hashtable;
  } catch (error) {
      console.error(`Error reading file ${filename}:`, error);
      console.log('Creating a new empty hashtable due to error.');
      return ph_empty<K, V>(size, (key: K) => universalHash(key, size));
  }
}

/**
* Writes a probing hashtable to a .txt file.
* @template K the type of keys
* @template V the type of values
* @param filename the name of the file to write to
* @param hashtable the probing hashtable to write
*/
export function writeHashTableToFile<K, V>(filename: string, hashtable: ProbingHashtable<K, V>): void {
  // Convert the hashtable to a JSON string
  const data = JSON.stringify({
      keys: hashtable.keys,
      values: hashtable.values,
      hash: hashtable.hash.toString(), // Convert function to string
      entries: hashtable.entries
  });

  // Write the JSON string to the file
  fs.writeFileSync(filename, data, 'utf-8');

  console.log(`Hashtable written to ${filename}`);
}

/**
* Inserts a key-value pair into a probing hashtable.
* Automatically resizes and rehashes the table if it gets too full.
* @template K the type of keys
* @template V the type of values
* @param ht the hash table
* @param key the key to insert
* @param value the value to insert
* @returns true iff the insertion succeeded
*/
export function ph_insert_with_resize<K, V>(ht: ProbingHashtable<K, V>, key: K, value: V): boolean {
  // Check if the hashtable is too full (load factor >= 75%)
  if (ht.entries >= ht.keys.length * 0.75) {
      resizeAndRehash(ht);
  }

  // Insert the key-value pair
  return ph_insert(ht, key, value);
}

/**
* Resizes and rehashes the probing hashtable.
* @template K the type of keys
* @template V the type of values
* @param ht the hash table to resize and rehash
*/
function resizeAndRehash<K, V>(ht: ProbingHashtable<K, V>): void {
  const oldKeys = ht.keys;
  const oldValues = ht.values;

  // Double the size of the hashtable
  const newSize = ht.keys.length * 2;
  const newHashtable = ph_empty<K, V>(newSize, ht.hash);

  // Rehash all existing keys and values into the new hashtable
  for (let i = 0; i < oldKeys.length; i++) {
      const key = oldKeys[i];
      if (key !== null && key !== undefined) {
          ph_insert(newHashtable, key, oldValues[i]!);
      }
  }

  // Replace the old hashtable with the new one
  ht.keys = newHashtable.keys;
  ht.values = newHashtable.values;
  ht.entries = newHashtable.entries;

  console.log(`Resized and rehashed hashtable to new size: ${newSize}`);
}

/**
* Reads a hashtable from a file, inserts a key-value pair, and writes the updated hashtable back to the file.
* Uses the universal hash function for hashing keys.
* @template K the type of keys
* @template V the type of values
* @param filename the name of the file
* @param size the size of the hashtable (if a new one needs to be created)
* @param key the key to insert
* @param value the value to insert
*/
export function updateHashTableInFile<K, V>(
  filename: string,
  size: number,
  key: K,
  value: V
): void {
  // Read the hashtable from the file (or create a new one if the file is empty)
  const hashtable = readHashTableFromFile<K, V>(filename, size);

  // Insert the new key-value pair (with automatic resizing and rehashing)
  ph_insert_with_resize(hashtable, key, value);

  // Write the updated hashtable back to the file
  writeHashTableToFile(filename, hashtable);
}

/**
 * Reads a hashtable from a file, removes a key-value pair, and writes the updated hashtable back to the file.
 * Uses the universal hash function for hashing keys.
 * @template K the type of keys
 * @template V the type of values
 * @param filename the name of the file
 * @param size the size of the hashtable (if a new one needs to be created)
 * @param key the key to remove
 * @returns the value associated with the key, or undefined if the key does not exist
 */
export function removeFromHashTableInFile<K, V>(
  filename: string,
  size: number,
  key: K
): V | undefined {
  // Read the hashtable from the file (or create a new one if the file is empty)
  const hashtable = readHashTableFromFile<K, V>(filename, size);

  // Remove the key-value pair
  const value = ph_delete(hashtable, key);

  // Write the updated hashtable back to the file
  writeHashTableToFile(filename, hashtable);

  return value;
}

export function hasValueInHashTable<K, V>(
  filename: string,
  size: number,
  value: V
): boolean {
  // Read the hashtable from the file
  const hashtable = readHashTableFromFile<K, V>(filename, size);

  // Iterate through all values in the hashtable
  for (let i = 0; i < hashtable.values.length; i++) {
      if (hashtable.values[i] === value) {
          return true; // Value found
      }
  }

  return false; // Value not found
}