import { List, list, append } from "../lib/list";
import { Stack } from "../lib/stack";
import { ListGraph } from "../lib/graphs";

function getRandomInt(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
  }


function labyrinth_path(size: number): List<number> {
    let start: number = 0;
    const end = size;
    let path: List<number> = list(start);

    while (start !== end) {
        if (start + 1 === end) {
            path = append(path, list(end));
            break
        }
        const next_node = getRandomInt(start + 1, end);
        
        path = append(path, list(next_node));
        start = next_node
    }
    return path;
}