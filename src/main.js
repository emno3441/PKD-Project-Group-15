"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var encryption_1 = require("./encryption");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var key = "xXX420x69x1337XXx";
var filepath = "..\test_file.txt";
//recursive function that repeats until the ask gets a valid answer in this case (e, d or c input)
function ask() {
    rl.question('Do you wish to encrypt or decrypt? \n[E] Encrypt \n[D] Decrypt \n[C] Cancel \n', function (answer) {
        switch (answer.toLowerCase()) {
            case 'e':
                (0, encryption_1.encrypt_file)(filepath, key);
                console.log('File Succesfully Encrypted');
                process.exit();
            //function of encryption and interface goes here
            case 'd':
                //function of decryption and game interface goes here
                (0, encryption_1.decrypt_file)(filepath, key);
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
