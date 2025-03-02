import { Stack, push, top, empty, is_empty, pop} from "../lib/stack";
import { labyrinth2, build_array } from "./labyrinth";
import { List, head, is_null, length } from "../lib/list";
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function labyrinth_navigator(path: List<number>, size: number) {
    const end: number = (size - 1);
    const key: List<number> = path
    const lab = labyrinth2(size, path);
    let obama: Stack<number> = empty<number>();
    let parent: Array<number> = build_array(size, _ => -1);
    obama = push(0, obama);
    let current = 0;

    while (current !== end) {
        const possible_paths = lab.adj[current];
        if (is_null(possible_paths)) {

        }
        else if (length(possible_paths) === 1) {
            let next_node: number = head(possible_paths);
        }
        else if (length(possible_paths) === 2) {

        }
        else if (length(possible_paths) === 3) {
            
        }
    }

    function one_path(node: number, parent: number, obama: Stack<number>) {
        rl.question('[Forward] or [Backward]', (answer) => {
            switch(answer.toLowerCase()) {
            case "forward":
                obama = push(node, obama);
                console.log('You moved forward');
                break;
            case 'backward':
                console.log('You moved backward');
                break;
            default:
                console.log('Invalid answer!');
            }
            rl.close();
        });
    }
}



rl.question('Is this example useful? [y/n] ', (answer) => {
    switch(answer.toLowerCase()) {
    case 'y':
        console.log('Super!');
        break;
    case 'n':
        console.log('Sorry! :(');
        break;
    default:
        console.log('Invalid answer!');
    }
    rl.close();
});