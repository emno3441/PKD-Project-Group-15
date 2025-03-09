import { encrypt_file, decrypt_file } from "./encryption";
import { List, length, head, tail, pair } from "../lib/list";
import {ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup} from "../lib/hashtables";
import { labyrinth_path } from "./labyrinth";
import { console } from "node:inspector";
import * as fs from 'fs';
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

function universalHash(key: any, size: number): number {
  const keyString = JSON.stringify(key);
  let hash = 0;
  for (let i = 0; i < keyString.length; i++) {
      hash += keyString.charCodeAt(i);
  }
  return hash % size;
}

function ph_insert_with_resize<K, V>(ht: ProbingHashtable<K, V>, key: K, value: V): boolean {
  // Check if the hashtable is too full (load factor >= 75%)
  if (ht.entries >= ht.keys.length * 0.75) {
      resizeAndRehash(ht);
  }

  // Insert the key-value pair
  return ph_insert(ht, key, value);
}


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

function readHashTableFromFile<K, V>(filename: string, size: number): ProbingHashtable<K, V> {
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

function updateHashTableInFile<K, V>(filename: string, size: number, key: K, value: List<number>): void {  // Change the type to List<number>
  // Read the hashtable from the file (or create a new one if the file is empty)
  const hashtable = readHashTableFromFile<K, string>(filename, size); // Change V to string

  // Convert the list value to a string before insertion
  const valueString = numberListToString(value);

  // Insert the new key-value pair (with automatic resizing and rehashing)
  ph_insert_with_resize(hashtable, key, valueString);

  // Write the updated hashtable back to the file
  writeHashTableToFile(filename, hashtable);
}

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

/**
 * Encrypts a file and stores the encryption key in a hashtable.
 * @template K The type of the key in the hashtable (e.g., string).
 * @template V The type of the value in the hashtable (e.g., string).
 * @param filename The name of the file to encrypt.
 * @param stored_keys The filename of the hashtable storing the encryption keys.
 * @param size The size of the hashtable (if a new one needs to be created).
 */
export async function gameEncryption<K, V>(filename: string, stored_keys: string, size: number): Promise<void> {
  try {
    // Generate a valid key using labyrinth_path
    const validKey = labyrinth_path(10);

    // Convert the key (List<number>) to a string
    const key = numberListToString(validKey);

    // Encrypt the file using the key
    encrypt_file(filename, key);

    // Store the key in the hashtable
    updateHashTableInFile<K, V>(stored_keys, size, filename as K, validKey);

    console.log('File successfully encrypted.');
  } catch (error) {
    // Handle errors and provide meaningful error messages
    console.error("Error encrypting file:", error);
    throw error;
  }
}

/**
 * Decrypts a file using the key stored in a hashtable and removes the key-value pair after decryption.
 * @template K The type of the key in the hashtable (e.g., string).
 * @template V The type of the value in the hashtable (e.g., string).
 * @param filename The name of the file to decrypt.
 * @param stored_keys The filename of the hashtable storing the encryption keys.
 * @param size The size of the hashtable (if a new one needs to be created).
 */
export async function gameDecryption<K, V>( filename: string, stored_keys: string, size: number): Promise<void> {
  try {
    // Read the hashtable from the file
    const hashtable = readHashTableFromFile<K, V>(stored_keys, size);

    // Check if the filename exists as a key in the hashtable
    const passwordToFile = ph_lookup(hashtable, filename as K);

    if (passwordToFile !== undefined) {
      // Convert the password string to a list of numbers
      const passwordPath = stringToNumberList(passwordToFile as string);

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
      removeFromHashTableInFile<K, V>(stored_keys, size, filename as K);

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