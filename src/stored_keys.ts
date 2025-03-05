   import {readFile, writeFile} from "node:fs";
   import { List } from "../lib/list";
   import {ProbingHashtable, ch_delete, ch_insert, ch_empty, ch_keys, ch_lookup} from "../lib/hashtables";


   export function listToString(list: List<Number>): string {
     let str: string ="";
     if (list !== null) {
       for (let i = 0; i < list.length; i++) {
       str+=list[i]+"%";
       } 
     }
     return str
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

   export function writeHashTableToFile(filename: string, data) {
    writeFile(filename, data, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
      });
   }