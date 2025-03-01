import * as readline from "readline";
import { openExplorer } from 'explorer-opener';
import { fileURLToPath } from "url";
import { decrypt_file, encrypt_file } from "./encryption";

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let key = "xXX420x69x1337XXx";
let filepath = "..\test_file.txt"
//recursive function that repeats until the ask gets a valid answer in this case (e, d or c input)

function ask() {
  rl.question('Do you wish to encrypt or decrypt? \n[E] Encrypt \n[D] Decrypt \n[C] Cancel \n', (answer) => {
    switch(answer.toLowerCase()) 
    {
      case 'e':
          //function of encryption and interface goes here
          encrypt_file(filepath, key);
          console.log('File Succesfully Encrypted');
          process.exit();
      case 'd':
        //function of decryption and game interface goes here
        decrypt_file(filepath, key);
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