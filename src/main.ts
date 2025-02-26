import * as readline from "readline";

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function ask() {
  rl.question('Do you wish to encrypt or decrypt? \n[E] Encrypt \n[D] Decrypt \n[C] Cancel \n', (answer) => {
    switch(answer.toLowerCase()) {
      case 'e':
      console.log('File Succesfully Encrypted');
      break;
      case 'd':
      console.log('File Succesfully Decrypted');
      break;
      case 'c':
      console.log('Cancelled');
      rl.close();
      process.exit();
      default:
      console.log('Invalid answer!');
    }

    ask();
  });
}

ask();