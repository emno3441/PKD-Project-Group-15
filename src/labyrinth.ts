import { List, list, append, is_null, head, tail, length } from "../lib/list";
import { Stack } from "../lib/stack";
import { ListGraph, lg_new } from "../lib/graphs";

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

function labyrinth(size: number): ListGraph {
    let lab_path: List<number> = labyrinth_path(size);
    let unvalid_nodes: List<number> = lab_path;
    const lab: ListGraph = lg_new(size);
    while(!is_null(lab_path)) {
        const parent = head(lab_path);
        const test = tail(lab_path);
        if(!is_null(test)) {
            const child = head(test);
            lab.adj[parent] = list(child);
        }
        lab_path = tail(lab_path);
    }
    lab.adj[0] //börja flera gångar
    //lägg till i unvalid
    // använda randomiseraren för att hitta nästa nod
    //kolla så att nästa nod inte är med i unvalid
    //om den inte är det, lägg till som child till nuvarande noden.
    //reptera


    return lab;
}

console.log(labyrinth(15));