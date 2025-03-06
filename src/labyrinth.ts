import { List, list, append, is_null, head, tail, length, remove, enum_list } from "../lib/list";
import { ListGraph } from "../lib/graphs";

export function build_array<T>(size: number, content: (i: number) => T): Array<T> {
    const result = Array<T>(size);
    for (var i = 0; i < size; i = i + 1) {
        result[i] = content(i);
    }
    return result;
}

function getRandomInt(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
/** Creates a path through the labyrinth
* @param size the number of nodes
* @precondition size > 2
* @returns A list of numbers from 0 to end
*/
export function labyrinth_path(size: number): List<number> {
    let start: number = 0;
    const end = size - 1;
    let path: List<number> = list(start);

    while (start !== end) {
        if (start + 1 === end) {
            path = append(path, list(end));
            break
        }
        const next_node = getRandomInt(start + 1, end); //generates random node

        path = append(path, list(next_node));
        start = next_node
    }
    return path;
}
/**
 * Creates a labyrinth which only has one solution
 * @param size the number of nodes
 * @param path A list of number which represent the way through the graph from start to end
 * @returns graph which only has one path from start to end
 */
export function labyrinth2(size: number, path: List<number>): ListGraph {
    let unvalid = path
    const lab: ListGraph = { size, adj: build_array(size, _ => list()) };
    while (!is_null(path)) { //Makes the correct child nodes of path
        const parent = head(path);
        const test = tail(path);
        if (!is_null(test)) {
            const child = head(test);
            lab.adj[parent] = list(child);
        }
        path = tail(path);
    }

    let valid = enum_list(0, size - 1)
    while (!is_null(unvalid)) { //removes unvalid nodes from the valid
        valid = remove(head(unvalid), valid);
        unvalid = tail(unvalid)
    }

    //function decides how many childnodes a node should have with a randomizer.
    function numbchild(valid_node: List<number>, parent: number, lab: ListGraph) {
        if (parent === (size - 1)) {
            return lab.adj[parent] = list();
        }
        const numb_of_child: number = getRandomInt(0, 7);
        if (length(valid_node) >= (2)) {
            if (numb_of_child === 0) {
                return lab.adj[parent] = is_null(lab.adj[parent]) ? list() : lab.adj[parent];
            }
            else if (numb_of_child <= 3) {

                return one_child(parent, lab, valid_node);
            }
            else if (numb_of_child <= 7) {

                return two_child(parent, lab, valid_node);
            }
        }
    }

    //Function adds one child node to parent node
    function one_child(parent: number, lab: ListGraph, valid_node: List<number>) {
        if (is_null(valid_node)) {
            return
        }
        const child = head(valid_node);
        valid_node = tail(valid_node);
        lab.adj[parent] = is_null(lab.adj[parent]) ? list(child) : append(lab.adj[parent], list(child));
        lab.adj[parent] = shuffle(lab.adj[parent]); //shuffles the choices
        return
    }

    //Function adds two child nodes to parent node
    function two_child(parent: number, lab: ListGraph, valid_node: List<number>) {
        if (is_null(valid_node)) {
            return
        }
        const child1 = head(valid_node);
        valid_node = tail(valid_node);
        if (is_null(valid_node)) {
            return
        }
        const child2 = head(valid_node);
        valid_node = tail(valid_node);
        lab.adj[parent] = is_null(lab.adj[parent]) ? list(child1, child2) : append(lab.adj[parent], list(child1, child2));
        lab.adj[parent] = shuffle(lab.adj[parent]); //shuffles the choices
        return
    }

    let pending = list(0); //nodes to be proccesed
    while (!is_null(pending)) { // adds child nodes to parent and then adds children into pending.
        const parent = head(pending);
        numbchild(valid, parent, lab);
        let children = lab.adj[parent];
        pending = append(pending, children);
        while (!is_null(children)) {
            valid = remove(head(children), valid);
            children = tail(children);
        }
        pending = is_null(pending) ? pending : tail(pending);
    }
    return lab;
}

/** A function that sometimes shuffles a list
* @param list1 list of nodes
* @returns list of numbers
*/
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
            : list1 = list(val3, val1); //switches places of the two choices
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
                            : list1 = list(val5, val1, val3); //multiple ways of shuffling the choices
    } 
};