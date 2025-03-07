;import * as readline from "readline";
import { decrypt_file, encrypt_file } from "./encryption";
import { labyrinth_path } from "./labyrinth";
import { labyrinth_navigator } from "./gameloop";
import { List, list, to_string } from "../lib/list";
import { error } from "console";
import {ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup} from "../lib/hashtables";
import { getHashTableFromFile, listToString } from "./stored_keys";

const solution: List<number> = list(0, 2, 5, 7, 8, 9);
let key = listToString(solution);
const filename = "../../Code/PKD-Project-Group-15/tests/lorem_ipsum.txt";
const hashtableOfPasswords = getHashTableFromFile("../stored_keys.txt")

encrypt_file(filename, key);

labyrinth_navigator(solution, 10);
key = listToString(solution); 
decrypt_file(filename, key);