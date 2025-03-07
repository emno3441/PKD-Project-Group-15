import * as readline from "readline";
import { labyrinth_navigator } from "./gameloop";
import { List, list } from "../lib/list";
import { gameDecryption, gameEncryption } from "./main functions";

const solutionTest: List<number> = list(0, 2, 5, 7, 8, 9);
const filename = "../../Code/PKD-Project-Group-15/tests/lorem_ipsum.txt";
async function main() {
const options = ["Encrypt File", "Decrypt File", "Cancel"];
const selectedOption = await createMenu(options, "Welcome to Gameified Encryption");


console.log(`You selected: ${selectedOption}`);
function createMenu(options: string[], question: string = "Choose an option:"): Promise<string> {
    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    });

    // Display the menu
    console.log(question);
    options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
    });


    // Return a promise that resolves with the selected option
    return new Promise((resolve) => {
        rl.question("Press the number of your choice and hit Enter: ", (answer) => {
            rl.close(); // Close the readline interface
            const choice = parseInt(answer, 10); // Parse the input as a number
            if (choice >= 1 && choice <= options.length) {
                resolve(options[choice - 1]); // Resolve with the selected option
            } else {
                resolve("Invalid choice"); // Handle invalid input
            }
        });
    });
}

// Perform actions based on the selected option
switch (selectedOption) {
    case "Encrypt File":
        console.log("Encrypting File...");
        gameEncryption(filename, solutionTest)
        break;
    case "Decrypt File":
        console.log("Decrypting File...");
        gameDecryption(filename, labyrinth_navigator(solutionTest, 10));
        break;
    case "Cancel":
        console.log("Cancelling process...");
        break;
    default:
        console.log("Invalid option selected.");
        break;
    }
}


main();