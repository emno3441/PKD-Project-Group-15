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

export function labyrinth_path(size: number): List<number> {
    let start: number = 0;
    const end = size - 1;
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
/**
 * Creates a labyrinth which only has one solution
 * @param size the number of nodes
 * @returns graph which only has one path from start to end
 */
export function labyrinth2(size: number, path: List<number>): ListGraph {
    let unvalid = path
    const lab: ListGraph = { size, adj: build_array(size, _ => list()) };
    while (!is_null(path)) {
        const parent = head(path);
        const test = tail(path);
        if (!is_null(test)) {
            const child = head(test);
            lab.adj[parent] = list(child);
        }
        path = tail(path);
    }

    let valid = enum_list(0, size)
    while (!is_null(unvalid)) {
        valid = remove(head(unvalid), valid);
        unvalid = tail(unvalid)
    }

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

    function one_child(parent: number, lab: ListGraph, valid_node: List<number>) {
        if (is_null(valid_node)) {
            return
        }
        const child = head(valid_node);
        valid_node = tail(valid_node);
        lab.adj[parent] = is_null(lab.adj[parent]) ? list(child) : append(lab.adj[parent], list(child));
        return
    }

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
        return
    }

    let pending = list(0);
    while (!is_null(pending)) {
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

