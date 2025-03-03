import { Stack, push, top, empty, is_empty, pop} from "../lib/stack";
import { labyrinth2, build_array, labyrinth_path } from "./labyrinth";
import { List, head, is_null, length, tail, append, list } from "../lib/list";
import * as readline from 'readline';
import { lstat } from "fs";



export async function labyrinth_navigator(path: List<number>, size: number) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const end: number = (size - 1);
    const key: List<number> = path
    const lab = labyrinth2(size, path);
    
    let current: number = 0;

    while (current !== end) {
        const possible_paths = lab.adj[current];
        if (is_null(possible_paths)) {
            current = 0;
        }
        else {
             current = await askUserChoice(current, possible_paths, rl);
        }
    }
    rl.close();
    return key;
}
labyrinth_navigator(labyrinth_path(25), 25);


function shuffle(list1: List<number> ): List<number>  {
    let currentIndex = length(list1);
    if (currentIndex === 1) {
        return list1
    }

    if (currentIndex === 2) {
        const val1 = is_null(list1) ? 1 : head(list1);
        const val2 = is_null(list1) ? list1 : tail(list1);
        const val3 = is_null(val2) ? 1 : head(val2);
    
        return (Math.random() <= 0.5) ?
            list1
            : list1 = list(val3, val1);
    }
    else {
        const val1 = is_null(list1) ? 1 : head(list1);
        const val2 = is_null(list1) ? list1 : tail(list1);
        const val3 = is_null(val2) ? 1 : head(val2);
        const val4 = is_null(val2) ? list1 : tail(val2);
        const val5 = is_null(val4) ? 1 : head(val4);

        return (Math.random() <= 0.5) ?
            list1
            : Math.random() <= 0.5 ? list1 = list(val3, val1, val5)
                : Math.random() <= 0.5 ? list1 = list(val3, val5, val1)
                    : Math.random() <= 0.5 ? list1 = list(val5, val3, val1)
                        : Math.random() <= 0.5 ? list1 = list(val1, val5, val3)
                            : list1 = list(val5, val1, val3);
    } 
};

function askUserChoice(current: number, choices: List<number>, rl: readline.Interface): Promise<number> {
    const DIRECTIONS = ["forward", "left", "right"];
    return new Promise((resolve) => {
        console.log(`You are at ${current}. Choose your next step:`);

        let index = 0;
        let optionList = choices;
        while (!is_null(optionList)) {
            console.log(`${DIRECTIONS[index]} -> ${head(optionList)}`);
            optionList = tail(optionList);
            index++;
        }

        rl.question("Enter 'forward', 'left', or 'right': ", (answer) => {
            const choiceIndex = DIRECTIONS.indexOf(answer.toLowerCase());
            if (choiceIndex >= 0 && choiceIndex < length(choices)) {
                let selected = choices;
                for (let i = 0; i < choiceIndex; i++) {
                    if (!is_null(selected)) {
                        selected = tail(selected);
                    }
                }
                if (!is_null(selected)) {
                    resolve(head(selected));
                }
            } else {
                console.log("Invalid choice, try again.");
                resolve(askUserChoice(current, choices, rl));
            }
        });
    });
}
