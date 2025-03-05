import * as readline from "readline";
import { decrypt_file, encrypt_file } from "./encryption";
import { labyrinth_path } from "./labyrinth";
import { List, list } from "../lib/list";
import { error } from "console";
import {ProbingHashtable, ph_delete, ph_insert, ph_empty, ph_keys, ph_lookup} from "../lib/hashtables";
import { getHashTableFromFile, listToString } from "./stored_keys";


let key: string;
const filename = "../tests/lorem_ipsum.txt";
const hashtableOfPasswords = getHashTableFromFile("../stored_keys.txt")
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


//recursive function that repeats until the ask gets a valid answer in this case (e, d or c input)
function ask() {
  rl.question('Do you wish to encrypt or decrypt? \n[E] Encrypt \n[D] Decrypt \n[C] Cancel \n', (answer) => {
    switch(answer.toLowerCase()) 
    {
      case 'e':
          //function of encryption and interface goes here
          key = listToString(labyrinth_path(10))
          encrypt_file(filename, key);
          ph_insert(hashtableOfPasswords, [filename, key], )
          console.log('File Succesfully Encrypted');
          process.exit();
      case 'd':
        //function of decryption and game interface goes here
        //filename = openfilepath 
        if (filename in ph_lookup(hashtableOfPasswords, filename)){
          //insert gamelogic
          //if game win
          decrypt_file(filename, key);
          console.log('File Succesfully Decrypted');
          ph_delete(hashtableOfPasswords)
          //if game loss
          console.log('File Failed to be Decrypted');
        }
        else {
          console.log('File not encrypted')
        }

        process.exit();
      case 'c':
        //cancels the ask function
        console.log('Process cancelled');
        rl.close();
        process.exit();
      default:
        //continues the loop if e, d or c wasn't inputed
        console.log('Invalid answer!');
    }

    ask();
  });
}

ask();