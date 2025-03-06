import {
    List, is_null, head, tail, list
} from '../lib/list';
import {
    ListGraph
} from "../lib/graphs";
import { 
    lg_find_path
} from '../lib/find_path';


export function lg_find_multiple_paths({adj, size}: ListGraph,
                                 initial: number, end: number, path: List<number>): boolean {
    let found_path: List<number> = list();

    while (!is_null(path) && is_null(found_path)) {
        const current: number = head(path);
        let adj_without = adj;
        adj_without[current] = list();

        const new_lg: ListGraph = {
            adj: adj_without,
            size: size - 1
        };

        found_path = lg_find_path(new_lg, initial, end);
        path = tail(path);
    }

    if (!is_null(found_path)) {
        return false;
    } else {
        return true;
    }
}