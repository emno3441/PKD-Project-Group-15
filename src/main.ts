import * as readline from "readline";
import { decrypt_file, encrypt_file } from "./encryption";
import { labyrinth_path } from "./labyrinth";
import { List, list } from "../lib/list";
import { error } from "console";
//import {openfilepath} from './openfile';
const key: string = "10101011010";
const filename = "../tests/lorem_ipsum.txt";

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function listToString(list: Array<Number>): String | undefined{
  let str: String ="";
  if (list !== null) {
    for (let i = 0; i < list.length; i++) {
    str+=list[i]+"%";
    return str
    }
  }
}

//recursive function that repeats until the ask gets a valid answer in this case (e, d or c input)
function ask() {
  rl.question('Do you wish to encrypt or decrypt? \n[E] Encrypt \n[D] Decrypt \n[C] Cancel \n', (answer) => {
    switch(answer.toLowerCase()) 
    {
      case 'e':
          //function of encryption and interface goes here
          encrypt_file(filename, key);
          console.log('File Succesfully Encrypted');
          process.exit();
      case 'd':
        //function of decryption and game interface goes here
        //filename = openfilepath 
        decrypt_file(filename, key);
        console.log('File Succesfully Decrypted');
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