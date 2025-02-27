import { List, list, append, is_null, head, tail, length, remove, enum_list } from "../lib/list";
import { Stack } from "../lib/stack";
import { ListGraph, lg_new } from "../lib/graphs";

function build_array<T>(size: number, content: (i: number) => T): Array<T> {
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

function labyrinth_path(size: number): List<number> {
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
// invariant (size > 10)
function labyrinth(size: number): ListGraph {
    let lab_path: List<number> = labyrinth_path(size);
    let unvalid_nodes: List<number> = lab_path;
    const lab: ListGraph = {size, adj: build_array(size, _ => list())};//lg_new(size);
    while(!is_null(lab_path)) {
        const parent = head(lab_path);
        const test = tail(lab_path);
        if(!is_null(test)) {
            const child = head(test);
            lab.adj[parent] = list(child);
        }
        lab_path = tail(lab_path);
    }
    function child_in_unvalid(child:number, unvalid_nodes: List<number>): Boolean {
        let temp = unvalid_nodes;
        while(!is_null(temp)) {
            if (child === head(temp)) {
                return true
            }
            temp = tail(temp);
        }
        return false
    }
    function onefunction(parent: number, lg: ListGraph, size: number, unvalid_nodes: List<number>) {
        let child: number = getRandomInt(1, size - 2);
        while (child_in_unvalid(child, unvalid_nodes)) {
            child = getRandomInt(1, size - 2);
        }
        
            //unvalid_nodes = append(unvalid_nodes, list(child));
            if (is_null(lg.adj[parent])) {
                lg.adj[parent] = list(child);
                return
            }
            else {
                lg.adj[parent] = append(lg.adj[parent], list(child));
                return
            }
        
    }

    function twofunction(parent: number, lg: ListGraph, size: number, unvalid_nodes: List<number>) {
        let child :number = getRandomInt(1, size - 1);
        let child2: number = getRandomInt(1, size -1);
        while (child_in_unvalid(child, unvalid_nodes)) {
            child = getRandomInt(1, size - 2);
        }
        if (child === child2) {
            return twofunction(parent, lg, size, unvalid_nodes);
        }
        else if (child_in_unvalid(child, unvalid_nodes) || child_in_unvalid(child2, unvalid_nodes)) {
            return twofunction(parent, lg, size, unvalid_nodes);
        }
        else {
            unvalid_nodes = append(unvalid_nodes, list(child, child2));
            if (is_null(lg.adj[parent])) {
                lg.adj[parent] = list(child, child2);
                return
            }
            else {
                lg.adj[parent] = append(lg.adj[parent], list(child, child2));
                return
            }
        }  
    }
    function threefunction(parent: number, lg: ListGraph, size: number, unvalid_nodes: List<number>) {
        const child: number = getRandomInt(1, size -1);
        const child2: number = getRandomInt(1, size -1);
        const child3: number = getRandomInt(1, size -1);
        if (child === child2 || child === child3 || child2 === child3) {
            return threefunction(parent, lg, size, unvalid_nodes);
        }
        else if (child_in_unvalid(child, unvalid_nodes) || child_in_unvalid(child2, unvalid_nodes) || child_in_unvalid(child3, unvalid_nodes)) {
            return threefunction(parent, lg, size, unvalid_nodes);
        }
        else {
            unvalid_nodes = append(unvalid_nodes, list(child, child2, child3))
            console.log(lg.adj[parent]);
            return is_null(lg.adj[parent]) ? 
            lg.adj[parent] = list(child, child2, child3)
            : lg.adj[parent] = append(lg.adj[parent], list(child, child2, child3));
        }
    }
    function t(size: number, parent: number, lab: ListGraph, unvalid_nodes: List<number>) {
        const numb_of_child:number = getRandomInt(0, 2);
        if (length(unvalid_nodes) < (size - 1)) {
            if (numb_of_child === 0) {
                return
            }
            else if (numb_of_child === 1) {
                return onefunction(parent, lab, size, unvalid_nodes);
            }
            else if (numb_of_child === 2) {
                return twofunction(parent, lab, size, unvalid_nodes);
            }
            //else if ( numb_of_child === 3) {
                //return threefunction(parent, lab, size, unvalid_nodes);
            //}
            else {
                return
            }
    }}
    
    let pending: List<number> = list(0);
    while(!is_null(pending)) {
        const parent: number = head(pending);
        if (parent === size - 1) {
            break
        }
        t(size, parent, lab, unvalid_nodes);
        const children = lab.adj[parent];
        if (!is_null(children)) {
            pending = append(pending, children);
        }
        if(!is_null(pending)) {
            pending = tail(pending);
    }}
    return lab;
}


function labyrinth2(size: number) {
    let path = labyrinth_path(size);
    let unvalid = path
    const lab: ListGraph = {size, adj: build_array(size, _ => list())};//lg_new(size);
    while(!is_null(path)) {
        const parent = head(path);
        const test = tail(path);
        if(!is_null(test)) {
            const child = head(test);
            lab.adj[parent] = list(child);
        }
        path = tail(path);
    }
    let valid = enum_list(0, size)
    while(!is_null(unvalid)) {
        valid = remove(head(unvalid), valid);
        unvalid = tail(unvalid)
    }
    function numbchild(valid_node: List<number>, parent: number, lab: ListGraph) {
        const numb_of_child: number = getRandomInt(0, 2);
        if (length(valid_node) >= (2)) {
            if (numb_of_child === 0) {
                return lab.adj[parent] = is_null(lab.adj[parent]) ? list() : lab.adj[parent];
            }
            else if (numb_of_child === 1) {
                
                return one_child(parent, lab, valid_node);
            }
            else if (numb_of_child === 2) {
                
                return two_child(parent, lab, valid_node);
            }
    }}
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

console.log(labyrinth2(15));