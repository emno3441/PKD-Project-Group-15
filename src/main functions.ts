import { decrypt_file, encrypt_file } from "./encryption";
import { labyrinth_path } from "./labyrinth";
import { labyrinth_navigator } from "./gameloop";
import { List, list, to_string } from "../lib/list";
import { error } from "console";
import {ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup} from "../lib/hashtables";
import { getHashTableFromFile, listToString } from "./stored_keys";

const solutionTest = list(0, 2, 5, 7, 8, 9);
const filename = "../../Code/PKD-Project-Group-15/tests/lorem_ipsum.txt";
const hashtableOfPasswords = getHashTableFromFile("../stored_keys.txt")


export async function keyAsList(key: Promise<List<number>>): Promise<string> {
    try {
        const list = await key; // Wait for the promise to resolve
        const resultString = listToString(list); // Convert the list to a string
        return resultString; // Return the resulting string
    } 
    catch (error) {
        console.error("Error converting list to string", error);
        throw error;
    }
}

export async function gameDecryption(list: Promise<List<number>>) {
    const key: Promise<List<number>> = Promise.resolve(list);

    try {
        const resultString = await keyAsList(key); // Get the resolved string
        decrypt_file(filename, resultString)
        console.log('File Succesfully Decrypted');
    } 
    catch (error) {
        console.error("Error turning labyrinth solution into key", error);
        throw error; 
    }
};

export async function gameEncryption(filename: string, validsolution: List<number>) {
    try {
        const key = listToString(validsolution)
        encrypt_file(filename, key);
        console.log('File Succesfully Encrypted');
    }
    catch (error) {
        console.error("Error encrypting file", error);
        throw error; 
    }
};