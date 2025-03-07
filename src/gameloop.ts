import { Stack, push, top, empty, is_empty, pop} from "../lib/stack";
import { generate_labyrinth, labyrinth_path } from "./labyrinth";
import { List, head, is_null, length, tail, append, list } from "../lib/list";
import * as readline from 'readline';

/** Allows the user to navigate through the labyrinth using the terminal
* @param size the size of the labyrinth
* @param path A list of number which represent the way through the labyrinth
* @returns the path through the labyrinth
*/
export async function labyrinth_navigator(path: List<number>, size: number): Promise<List<number>> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const end: number = (size - 1);
    const key: List<number> = path

    const lab = generate_labyrinth(size, path); //Creates the labyrinth

    
    let current: number = 0;

    while (current !== end) {
        const possible_paths = lab.adj[current];
        if (is_null(possible_paths)) {
            console.log("Wrong path, Restart from the beginning");
            current = 0; //if you reach a dead end. Restart from the beginning.
        }
        else {
             current = await askUserChoice(current, possible_paths, rl);
        }
    }
    rl.close();
    return key
}
    

/**
 * Maps available choices to directional labels dynamically.
 * 
 * @param choices - A list of possible next nodes.
 * @returns A list of direction labels (e.g., ["left"], ["left", "forward"], etc.).
 */
function getDirectionLabels(choices: List<number>): List<string> {
    const DIRECTION_LABELS = ["1", "2", "3"];
    let labels: List<string> = list();
    let optionList = choices;
    let index = 0;
    // Adds as many direction as there are options
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
 * 
 * @param current - The current node.
 * @param choices - A list of possible next nodes.
 * @param rl - Readline interface for user input.
 * @returns The next node.
 */
function askUserChoice(current: number, choices: List<number>, rl: readline.Interface): Promise<number> {
    
    //choices = shuffle(choices);
    return new Promise((resolve) => {
        const labels = getDirectionLabels(choices);
        console.log('');
        console.log(`You are at a junction. Choose a direction:`);

        // Display only the available choices dynamically
        let index = 0;
        let labelList = labels;
        while (!is_null(labelList)) {
            console.log(`> ${head(labelList)}`);
            labelList = tail(labelList);
            index++;
        }

        rl.question("Enter your choice: ", (answer) => {
            let labelIndex = 0;
            let searchLabels = labels;
            while (!is_null(searchLabels)) { //checks if answer matches a label
                if (head(searchLabels) === answer.toLowerCase()) {
                    break;
                }
                searchLabels = tail(searchLabels);
                labelIndex++;
            }

            if (!is_null(searchLabels)) { //Checks if valid label was found
                let selected = choices;
                for (let i = 0; i < labelIndex; i++) { //Selects the correct node according to input
                    if (!is_null(selected)) { 
                        selected = tail(selected);
                    }
                }
                if (!is_null(selected)) {
                    resolve(head(selected)); // returns next node
                }
            } else {
                console.log("Invalid choice, try again.");
                resolve(askUserChoice(current, choices, rl)); // Retry if input is invalid
            }
        });
    });
}

