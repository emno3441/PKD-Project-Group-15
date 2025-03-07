import {readFile, writeFile} from "node:fs";
import { List, length, head, tail } from "../lib/list";
import {ChainingHashtable, ch_delete, ch_insert, ch_empty, ch_keys, ch_lookup, HashFunction} from "../lib/hashtables";
import { labyrinth_path } from "./labyrinth";
import { console } from "node:inspector";

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = hash * 4 + str.charCodeAt(i)
    }
    return hash;
    }

export function getHashTableFromFile(filename: string){
    let hashTable = readFile(filename, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
      });
    return hashTable
   }

export function writeHashTableToFile(filename: string, data: any): any{
    writeFile(filename, data, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
    });
}
//const file: string = "../stored_keys.txt"
//const data: any = ph_empty(20, simpleHash)

//writeHashTableToFile(file, data)
