import { decrypt_file, encrypt_file } from "./encryption";
import { labyrinth_path } from "./labyrinth";
import { labyrinth_navigator } from "./gameloop";
import { List, list, to_string, head, tail } from "../lib/list";
import { error } from "console";
import {ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup} from "../lib/hashtables";
import { getHashTableFromFile } from "./stored_keys";

const hashtableOfPasswords = getHashTableFromFile("../stored_keys.txt")

// Converts list into string
function listToString(list: List<number>): string {
    let str: string ="";    
    while (list !== null){  // Iterates through all elements in list and adds it onto a "clean" string
      str+=head(list); 
      list = tail(list);
      } 
    return str; //returns the clean string
}
   
// Converts list that gets outputed from labirynth_navigation to a string
export async function keyAsList(key: Promise<List<number>>): Promise<string> {
    try {
        const list = await key; // Waits for the promise to resolve
        const resultString = listToString(list); // Convert the path list to a "clean" string
        return resultString;
    } 
    catch (error) { // Throws error if something went wrong
        console.error("Error converting list to string", error);
        throw error;
    }
}
// Handles the decryption of file with input of labirynth_navigation
export async function gameDecryption(filename: string, list: Promise<List<number>>) {
    const inputstring: Promise<List<number>> = Promise.resolve(list); // Creates a promise to resolve

    try {
        const key = await keyAsList(inputstring); // waits to get the resolved string 
        decrypt_file(filename, key); // Decrypts the file using string as key
        console.log('File Succesfully Decrypted');
    } 
    catch (error) { // Throws error if something went wrong
        console.error("Error turning labyrinth solution into key", error);
        throw error; 
    }
};

// Handles the encryption of file with input of labirynth_path
export async function gameEncryption(filename: string, validKey: List<number>) {
    try {
        const key = listToString(validKey); // Makes validpath into key as string
        encrypt_file(filename, key); // Encrypts the file using string as key
        console.log('File Succesfully Encrypted');
    }
    catch (error) { // Throws error if something went wrong
        console.error("Error encrypting file", error);
        throw error; 
    }
};