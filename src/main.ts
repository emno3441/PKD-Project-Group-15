import * as readline from "readline";
import { labyrinth_navigator } from "./gameloop";
import { List, list, pair, tail, head } from "../lib/list";
import { gameDecryption, gameEncryption} from "./logic";
import { labyrinth_path } from "./labyrinth";
import { ph_lookup } from "../lib/hashtables";
import { dialog } from "electron";
import * as path from "path";
import * as fs from "fs";


const stored_keys = "./../PKD-Project-Group-15/stored_keys.json";
const options = ["Encrypt File", "Decrypt File", "Cancel"];

/**
 * Creates a menu and prompts the user to select an option.
 * @param options The list of options to display.
 * @param question The question to ask the user.
 * @returns A promise that resolves to the selected option.
 */
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

async function askFilePath(): Promise<string> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Enter the full path of the file: ", (filePath) => {
            if (!fs.existsSync(filePath)) {
                console.log("File does not exist. Please try again.");
                process.exit(1);
            }
            rl.close();
            resolve(path.resolve(filePath));
        });
    });
}

async function main() {
    const selectedOption = await createMenu(options, "Welcome to Gameified Encryption");
    console.log(`You selected: ${selectedOption}`);

    // Perform actions based on the selected option
    switch (selectedOption) {
        case "Encrypt File":
            try {
                const fileToEncrypt = await askFilePath(); // Open file dialog to select a file
                console.log(`Selected file: ${fileToEncrypt}`);
                console.log("Encrypting File...");
                await gameEncryption(fileToEncrypt, stored_keys, 10); // Encrypt the file (await for completion)
            } catch (error) {
                console.error("Error during encryption:", error);
            }
            break;

        case "Decrypt File":
            try {
                const fileToDecrypt = await askFilePath(); // Open file dialog to select a file
                console.log(`Selected file: ${fileToDecrypt}`);
                console.log("Decrypting File...");
                await gameDecryption(fileToDecrypt, stored_keys, 10)
            } catch (error) {
                console.error("Error during decryption:", error);
            }
            break;

        case "Cancel":
            console.log("Cancelling process...");
            break;

        default:
            console.log("Invalid option selected.");
            break;
    }
}

// Run the main function
main().catch((error) => {
    console.error("An error occurred:", error);
});