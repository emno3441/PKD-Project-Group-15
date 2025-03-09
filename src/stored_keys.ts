import { encrypt_file, decrypt_file } from "./encryption";
import {readFile, writeFile} from "node:fs";
import { List, length, head, tail, pair } from "../lib/list";
import {ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup, HashFunction} from "../lib/hashtables";
import { labyrinth_path } from "./labyrinth";
import { console } from "node:inspector";
import * as fs from 'fs';
import * as path from 'path'
import { labyrinth_navigator } from "./gameloop";

// Converts list into string
function numberListToString(list: List<number>): string {
    let str: string ="";    
    while (list !== null){  // Iterates through all elements in list and adds it onto a "clean" string
      str+=head(list); 
      list = tail(list);
      } 
    return str; //returns the clean string
}

function stringToNumberList(str: string): List<number> {
  let result: List<number> = null; // Start with an empty list

  // Iterate through the string in reverse order and build the list
  for (let i = str.length - 1; i >= 0; i--) {
    const char = str[i];
    if (!isNaN(Number(char))) { // Ensure the character is a valid number
      result = pair(Number(char), result); // Add the number to the front of the list
    } else {
      throw new Error(`Invalid character in input string: ${char}. Expected a number.`);
    }
  }

  return result;
}

// Converts list that gets outputed from labirynth_navigation to a string
async function keyAsList(key: Promise<List<number>>): Promise<string> {
    try {
        const list = await key; // Waits for the promise to resolve
        const resultString = numberListToString(list); // Convert the path list to a "clean" string
        return resultString;
    } 
    catch (error) { // Throws error if something went wrong
        console.error("Error converting list to string", error);
        throw error;
    }
}

function universalHash(key: any, size: number): number {
  const keyString = JSON.stringify(key);
  let hash = 0;
  for (let i = 0; i < keyString.length; i++) {
      hash += keyString.charCodeAt(i);
  }
  return hash % size;
}

function readHashTableFromFile<K, V>(
  filename: string,
  size: number
): ProbingHashtable<K, V> {
  try {
      console.log(`Attempting to read file: ${filename}`);
      
      // Check if the file exists and is not empty
      if (!fs.existsSync(filename)) {
          console.log(`File ${filename} does not exist. Creating a new empty hashtable.`);
          return ph_empty<K, V>(size, (key: K) => universalHash(key, size));
      }

      const fileContent = fs.readFileSync(filename, 'utf-8');
      if (fileContent.trim() === '') {
          console.log(`File ${filename} is empty. Creating a new empty hashtable.`);
          return ph_empty<K, V>(size, (key: K) => universalHash(key, size));
      }

      console.log(`File content: ${fileContent}`);

      // Parse the JSON string back into an object
      const parsedData = JSON.parse(fileContent);
      console.log(`Parsed data: ${JSON.stringify(parsedData, null, 2)}`);

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
function writeHashTableToFile<K, V>(filename: string, hashtable: ProbingHashtable<K, V>): void {
  try {
      // Convert the hashtable to a JSON string with proper formatting
      const data = JSON.stringify(
          {
              keys: hashtable.keys,
              values: hashtable.values,
              entries: hashtable.entries,
              // Note: The hash function is not serialized because functions cannot be serialized to JSON.
              // If you need to store the hash function, you would need to store its name or logic separately.
          },
          null,  // Add indentation for readability (optional)
          2      // Use 2 spaces for indentation (optional)
      );

      // Write the JSON string to the file
      fs.writeFileSync(filename, data, 'utf-8');

      console.log(`Hashtable successfully written to ${filename}`);
  } catch (error) {
      console.error(`Error writing hashtable to file ${filename}:`, error);
      throw error; // Re-throw the error to handle it in the calling function
  }
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
function ph_insert_with_resize<K, V>(ht: ProbingHashtable<K, V>, key: K, value: V): boolean {
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
function updateHashTableInFile<K, V>(
  filename: string,
  size: number,
  key: K,
  value: List<number> // Change the type to List<number>
): void {
  // Read the hashtable from the file (or create a new one if the file is empty)
  const hashtable = readHashTableFromFile<K, string>(filename, size); // Change V to string

  // Convert the list value to a string before insertion
  const valueString = numberListToString(value);

  // Insert the new key-value pair (with automatic resizing and rehashing)
  ph_insert_with_resize(hashtable, key, valueString);

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
function removeFromHashTableInFile<K, V>(
  filename: string,
  size: number,
  key: K
): void { // Change the return type to List<number>
  // Read the hashtable from the file (or create a new one if the file is empty)
  const hashtable = readHashTableFromFile<K, string>(filename, size); // Change V to string

  // Remove the key-value pair
  ph_delete(hashtable, key);

  // Write the updated hashtable back to the file
  writeHashTableToFile(filename, hashtable);

  return
}


export async function gameEncryption(filename: string, stored_keys: string) {
  try {
      const validKey = labyrinth_path(10);
      const key = numberListToString(validKey); // Makes validpath into key as string
      encrypt_file(filename, key); // Encrypts the file using string as key
      updateHashTableInFile(stored_keys, 10, filename, validKey); // Store the key in the hashtable
      console.log('File Succesfully Encrypted');
  }
  catch (error) { // Throws error if something went wrong
      console.error("Error encrypting file", error);
      throw error; 
  }
};

// Handles the decryption of file with input of labyrinth_navigation
// Handles the decryption of file with input of labyrinth_navigation
export async function gameDecryption(filename: string, stored_keys: string) {
  try {
    // Read the hashtable from the file
    const hashtable = readHashTableFromFile<string, string>(stored_keys, 10);

    // Check if the filename exists as a key in the hashtable
    const passwordToFile = ph_lookup(hashtable, filename);

    if (passwordToFile !== undefined) {
      // Convert the password string to a list of numbers
      const passwordPath = stringToNumberList(passwordToFile);

      // Use the labyrinth_navigator to get the key (as a Promise<List<number>>)
      const keyPromise = labyrinth_navigator(passwordPath, 10);

      // Wait for the key (List<number>) to be resolved
      const key = await keyPromise;

      // Convert the key (List<number>) to a string
      const password = numberListToString(key);

      // Decrypt the file using the password
      decrypt_file(filename, password);

      console.log("File decrypted successfully.");

      // Remove the key-value pair from the hashtable since decryption succeeded
      removeFromHashTableInFile(stored_keys, 10, filename);

      console.log("Key-value pair removed from the hashtable.");
    } else {
      console.log("Failed to find file in table of encrypted files.");
    }
  } catch (error) {
    // Handle errors and provide meaningful error messages
    console.error("Error during decryption process:", error);
    throw error;
  }
}