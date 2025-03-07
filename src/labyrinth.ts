import { List, list, append, is_null, head, tail, length, remove, enum_list } from "../lib/list";

import { ListGraph, build_array } from "../lib/graphs";

// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
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

            break;
        }

        const next_node = getRandomInt(start + 1, end); //generates random node

        path = append(path, list(next_node));
        start = next_node;
    }

    return path;
}

/**
 * Creates a labyrinth which only has one solution
 * @param size the number of nodes
 * @param path A list of number which represent the way through the graph from start to end
 * @returns graph which only has one path from start to end
 */
export function generate_labyrinth(size: number, path: List<number>): ListGraph {
    let unvalid_nodes = path;
    const labyrinth: ListGraph = { size, adj: build_array(size, _ => list()) };

    // Inserts path into labyrinth
    while (!is_null(path)) {
        const parent = head(path);
        const test = tail(path);

        if (!is_null(test)) {
            const child = head(test);
            labyrinth.adj[parent] = list(child);
        }

        path = tail(path);
    }

    let valid_nodes = enum_list(0, size - 1)

    // removes unvalid nodes, the nodes from the path, from the valid to be inserted into labyrinth
    while (!is_null(unvalid_nodes)) {
        valid_nodes = remove(head(unvalid_nodes), valid_nodes);
        unvalid_nodes = tail(unvalid_nodes);
    }

    //function decides how many childnodes a node should have with a randomizer
    function numbchild(valid_node: List<number>, parent: number, labyrinth: ListGraph): void {
        // if node is the end node
        if (parent === (size - 1)) {
            labyrinth.adj[parent] = list();
            return;
        }

        // randomize number pf children
        const numb_of_child: number = getRandomInt(0, 7);
        if (length(valid_node) >= (2)) {
            if (numb_of_child === 0) {
                labyrinth.adj[parent] = is_null(labyrinth.adj[parent]) ? list() : labyrinth.adj[parent];
                return;
            } else if (numb_of_child <= 3) {    // adds one child
                one_child(parent, labyrinth, valid_node);
                return;
            } else if (numb_of_child <= 7) {    // adds two children
                two_child(parent, labyrinth, valid_node);
                return;
            }
        }
    }

    //Function adds one child node to parent node
    function one_child(parent: number, labyrinth: ListGraph, valid_node: List<number>): void {
        // for typescript
        if (is_null(valid_node)) {
            return;
        }

        const child = head(valid_node);
        valid_node = tail(valid_node);
        labyrinth.adj[parent] = is_null(labyrinth.adj[parent]) 
                                ? list(child)
                                : append(labyrinth.adj[parent], list(child));
        labyrinth.adj[parent] = shuffle(labyrinth.adj[parent]); //shuffles the choices
        return;
    }

    //Function adds two child nodes to parent node
    function two_child(parent: number, labyrinth: ListGraph, valid_node: List<number>): void {
        // for typescript
        if (is_null(valid_node)) {
            return;
        }

        const child1 = head(valid_node);
        valid_node = tail(valid_node);

        // for typescript
        if (is_null(valid_node)) {
            return;
        }

        const child2 = head(valid_node);
        valid_node = tail(valid_node);

        // add children and change order
        labyrinth.adj[parent] = is_null(labyrinth.adj[parent])
                                ? list(child1, child2)
                                : append(labyrinth.adj[parent], list(child1, child2));
        labyrinth.adj[parent] = shuffle(labyrinth.adj[parent]); //shuffles the choices
        return;
    }

    let pending = list(0); //nodes to be proccesed

    // adds child nodes to parent and then adds children into pending.
    while (!is_null(pending)) {
        const parent = head(pending);

        // randomise number of children
        numbchild(valid_nodes, parent, labyrinth);

        // insert new children to node
        let children = labyrinth.adj[parent];
        pending = append(pending, children);

        // removes children from valid nodes
        while (!is_null(children)) {
            valid_nodes = remove(head(children), valid_nodes);
            children = tail(children);
        }

        pending = is_null(pending) ? pending : tail(pending);
    }
    return labyrinth;
}

/** Shuffles a list with 2 or 3 values, values after 3 stays in the same order
* @param {List<number>} lst list of nodes
* @returns {List<number>} list of numbers
*/
function shuffle(lst: List<number> ): List<number>  {
    let currentIndex = length(lst);

    // if lst has one value
    if (currentIndex === 1) {
        return lst;
    }

    // if lst has two values
    if (currentIndex === 2) {
        const value1 = is_null(lst) ? 1 : head(lst);
        const tail_lst = is_null(lst) ? lst : tail(lst);
        const value2 = is_null(tail_lst) ? 1 : head(tail_lst);
    
        return (Math.random() <= 0.5) ?
            lst
            : lst = list(value2, value1); //switches places of the two choices
    } else { // if lst has three or more values, changes place of first three
        const value1 = is_null(lst) ? 1 : head(lst);
        const lst_without_1 = is_null(lst) ? lst : tail(lst);
        const value2 = is_null(lst_without_1) ? 1 : head(lst_without_1);
        const lst_without_2 = is_null(lst_without_1) ? lst : tail(lst_without_1);
        const value3 = is_null(lst_without_2) ? 1 : head(lst_without_2);

        return (Math.random() <= 0.5) ?
            lst
            : Math.random() <= 0.5 ? lst = list(value2, value1, value3)
                : Math.random() <= 0.5 ? lst = list(value2, value3, value1)
                    : Math.random() <= 0.5 ? lst = list(value3, value2, value1)
                        : Math.random() <= 0.5 ? lst = list(value1, value3, value2)
                            : lst = list(value3, value1, value2); //multiple ways of shuffling the choices
    } 
};