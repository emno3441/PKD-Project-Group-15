import { generate_labyrinth, labyrinth_path } from "./labyrinth";
import { List, head, is_null, tail, append, list } from "../lib/list";
import * as readline from 'readline';

// Global readline interface
let rl: readline.Interface;

/**
 * Allows the user to navigate through the labyrinth using the terminal.
 * @param path A list of numbers representing the way through the labyrinth.
 * @param size The size of the labyrinth.
 * @returns The path through the labyrinth.
 */
export async function labyrinth_navigator(path: List<number>, size: number): Promise<List<number>> {
    const end: number = size - 1;
    const key: List<number> = path;

    // Create the labyrinth
    const lab = generate_labyrinth(size, path);

    // Initialize the current node
    let current: number = 0;

    // Create the readline interface
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Start the navigation loop
    while (current !== end) {
        const possible_paths = lab.adj[current];
        if (is_null(possible_paths)) {
            console.log("Wrong path, restarting from the beginning.");
            current = 0; // Restart from the beginning if a dead end is reached.
        } else {
            current = await askUserChoice(current, possible_paths);
        }
    }

    // Close the readline interface after the game is over
    rl.close();
    return key;
}

/**
 * Maps available choices to directional labels dynamically.
 * @param choices A list of possible next nodes.
 * @returns A list of direction labels (e.g., ["1", "2", "3"]).
 */
function getDirectionLabels(choices: List<number>): List<string> {
    const DIRECTION_LABELS = ["1", "2", "3"];
    let labels: List<string> = list();
    let optionList = choices;
    let index = 0;

    // Add as many direction labels as there are options
    while (!is_null(optionList) && index < DIRECTION_LABELS.length) {
        labels = append(labels, list(DIRECTION_LABELS[index]));
        optionList = tail(optionList);
        index++;
    }

    return labels;
}

/**
 * Asks the user to choose the next node to navigate to.
 * Ensures a valid input and returns the corresponding next node.
 * @param current The current node.
 * @param choices A list of possible next nodes.
 * @returns The next node.
 */
function askUserChoice(current: number, choices: List<number>): Promise<number> {
    return new Promise((resolve) => {
        const labels = getDirectionLabels(choices);

        // Display the available choices
        console.log('');
        console.log(`You are at a junction. Choose a direction:`);
        let labelList = labels;
        while (!is_null(labelList)) {
            console.log(`> ${head(labelList)}`);
            labelList = tail(labelList);
        }

        // Prompt the user for input
        rl.question("Enter your choice: ", (answer) => {
            let labelIndex = 0;
            let searchLabels = labels;

            // Find the index of the selected label
            while (!is_null(searchLabels)) {
                if (head(searchLabels) === answer.toLowerCase()) {
                    break;
                }
                searchLabels = tail(searchLabels);
                labelIndex++;
            }

            // Resolve the corresponding node
            if (!is_null(searchLabels)) {
                let selected = choices;
                for (let i = 0; i < labelIndex; i++) {
                    if (!is_null(selected)) {
                        selected = tail(selected);
                    }
                }
                if (!is_null(selected)) {
                    resolve(head(selected)); // Return the next node
                }
            } else {
                console.log("Invalid choice, try again.");
                resolve(askUserChoice(current, choices)); // Retry if input is invalid
            }
        });
    });
}