"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_array = build_array;
exports.labyrinth_path = labyrinth_path;
exports.labyrinth2 = labyrinth2;
var list_1 = require("../lib/list");
function build_array(size, content) {
    var result = Array(size);
    for (var i = 0; i < size; i = i + 1) {
        result[i] = content(i);
    }
    return result;
}
function getRandomInt(min, max) {
    var minCeiled = Math.ceil(min);
    var maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
/** Creates a path through the labyrinth
* @param size the number of nodes
* @precondition size > 2
* @returns A list of numbers from 0 to end
*/
function labyrinth_path(size) {
    var start = 0;
    var end = size - 1;
    var path = (0, list_1.list)(start);
    while (start !== end) {
        if (start + 1 === end) {
            path = (0, list_1.append)(path, (0, list_1.list)(end));
            break;
        }
        var next_node = getRandomInt(start + 1, end); //generates random node
        path = (0, list_1.append)(path, (0, list_1.list)(next_node));
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
function labyrinth2(size, path) {
    var unvalid = path;
    var lab = { size: size, adj: build_array(size, function (_) { return (0, list_1.list)(); }) };
    while (!(0, list_1.is_null)(path)) { //Makes the correct child nodes of path
        var parent_1 = (0, list_1.head)(path);
        var test_1 = (0, list_1.tail)(path);
        if (!(0, list_1.is_null)(test_1)) {
            var child = (0, list_1.head)(test_1);
            lab.adj[parent_1] = (0, list_1.list)(child);
        }
        path = (0, list_1.tail)(path);
    }
    var valid = (0, list_1.enum_list)(0, size - 1);
    while (!(0, list_1.is_null)(unvalid)) { //removes unvalid nodes from the valid
        valid = (0, list_1.remove)((0, list_1.head)(unvalid), valid);
        unvalid = (0, list_1.tail)(unvalid);
    }
    //function decides how many childnodes a node should have with a randomizer.
    function numbchild(valid_node, parent, lab) {
        if (parent === (size - 1)) {
            return lab.adj[parent] = (0, list_1.list)();
        }
        var numb_of_child = getRandomInt(0, 7);
        if ((0, list_1.length)(valid_node) >= (2)) {
            if (numb_of_child === 0) {
                return lab.adj[parent] = (0, list_1.is_null)(lab.adj[parent]) ? (0, list_1.list)() : lab.adj[parent];
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
    function one_child(parent, lab, valid_node) {
        if ((0, list_1.is_null)(valid_node)) {
            return;
        }
        var child = (0, list_1.head)(valid_node);
        valid_node = (0, list_1.tail)(valid_node);
        lab.adj[parent] = (0, list_1.is_null)(lab.adj[parent]) ? (0, list_1.list)(child) : (0, list_1.append)(lab.adj[parent], (0, list_1.list)(child));
        lab.adj[parent] = shuffle(lab.adj[parent]); //shuffles the choices
        return;
    }
    //Function adds two child nodes to parent node
    function two_child(parent, lab, valid_node) {
        if ((0, list_1.is_null)(valid_node)) {
            return;
        }
        var child1 = (0, list_1.head)(valid_node);
        valid_node = (0, list_1.tail)(valid_node);
        if ((0, list_1.is_null)(valid_node)) {
            return;
        }
        var child2 = (0, list_1.head)(valid_node);
        valid_node = (0, list_1.tail)(valid_node);
        lab.adj[parent] = (0, list_1.is_null)(lab.adj[parent]) ? (0, list_1.list)(child1, child2) : (0, list_1.append)(lab.adj[parent], (0, list_1.list)(child1, child2));
        lab.adj[parent] = shuffle(lab.adj[parent]); //shuffles the choices
        return;
    }
    var pending = (0, list_1.list)(0); //nodes to be proccesed
    while (!(0, list_1.is_null)(pending)) { // adds child nodes to parent and then adds children into pending.
        var parent_2 = (0, list_1.head)(pending);
        numbchild(valid, parent_2, lab);
        var children = lab.adj[parent_2];
        pending = (0, list_1.append)(pending, children);
        while (!(0, list_1.is_null)(children)) {
            valid = (0, list_1.remove)((0, list_1.head)(children), valid);
            children = (0, list_1.tail)(children);
        }
        pending = (0, list_1.is_null)(pending) ? pending : (0, list_1.tail)(pending);
    }
    return lab;
}
/** A function that sometimes shuffles a list
* @param list1 list of nodes
* @returns list of numbers
*/
function shuffle(list1) {
    var currentIndex = (0, list_1.length)(list1);
    if (currentIndex === 1) {
        return list1;
    }
    if (currentIndex === 2) {
        var val1 = (0, list_1.is_null)(list1) ? 1 : (0, list_1.head)(list1);
        var val2 = (0, list_1.is_null)(list1) ? list1 : (0, list_1.tail)(list1);
        var val3 = (0, list_1.is_null)(val2) ? 1 : (0, list_1.head)(val2);
        return (Math.random() <= 0.5) ?
            list1
            : list1 = (0, list_1.list)(val3, val1); //switches places of the two choices
    }
    else {
        var val1 = (0, list_1.is_null)(list1) ? 1 : (0, list_1.head)(list1);
        var val2 = (0, list_1.is_null)(list1) ? list1 : (0, list_1.tail)(list1);
        var val3 = (0, list_1.is_null)(val2) ? 1 : (0, list_1.head)(val2);
        var val4 = (0, list_1.is_null)(val2) ? list1 : (0, list_1.tail)(val2);
        var val5 = (0, list_1.is_null)(val4) ? 1 : (0, list_1.head)(val4);
        return (Math.random() <= 0.5) ?
            list1
            : Math.random() <= 0.5 ? list1 = (0, list_1.list)(val3, val1, val5)
                : Math.random() <= 0.5 ? list1 = (0, list_1.list)(val3, val5, val1)
                    : Math.random() <= 0.5 ? list1 = (0, list_1.list)(val5, val3, val1)
                        : Math.random() <= 0.5 ? list1 = (0, list_1.list)(val1, val5, val3)
                            : list1 = (0, list_1.list)(val5, val1, val3); //multiple ways of shuffling the choices
    }
}
;
