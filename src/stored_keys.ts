import {readFile, writeFile} from "node:fs";
import { List } from "../lib/list";
import {ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup, HashFunction} from "../lib/hashtables";
import { labyrinth_path } from "./labyrinth";
import { console } from "node:inspector";

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = hash * 4 + str.charCodeAt(i)
    }
    return hash;
    }

export function listToString(list: List<Number>): string {
    let str: string ="";
    if (list !== null) {
       for (let i = 0; i < list.length; i++) {
       str+=list[i];
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

function writeHashTableToFile(filename: string, data: any): any{
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
const solution = labyrinth_path(10);
const solutionAsList = listToString(solution);

console.log(solutionAsList);