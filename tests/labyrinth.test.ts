import { generate_labyrinth, labyrinth_path } from "../src/labyrinth";
import { ListGraph } from "../lib/graphs";
import { List, is_null, head, reverse } from '../lib/list';
import { lg_find_path } from '../lib/find_path';
import { lg_find_multiple_paths } from './lg_find_multiple_paths';

test('Labyrinth has a path to the end', () => {
    const path_to_exit: List<number> = labyrinth_path(10);
    const exit_to_begining: List<number> = reverse(path_to_exit);
    const labyrinth: ListGraph = generate_labyrinth(10, path_to_exit);

    if (!is_null(path_to_exit) && !is_null(exit_to_begining)) {
        const initial: number = head(path_to_exit);
        const end: number = head(exit_to_begining);

        expect(lg_find_path(labyrinth, initial, end)).toStrictEqual(reverse(path_to_exit));
    } else {
        expect(false).toBe(true)
    }
});

test('Labyrinth does not have multiple paths to exit', () => {
    const path_to_exit: List<number> = labyrinth_path(10);
    const exit_to_begining: List<number> = reverse(path_to_exit);
    const labyrinth: ListGraph = generate_labyrinth(10, path_to_exit);


    if (!is_null(path_to_exit) && !is_null(exit_to_begining)) {
        const initial: number = head(path_to_exit);
        const end: number = head(exit_to_begining);


        expect(lg_find_multiple_paths(labyrinth, initial, end, path_to_exit)).toBe(true);
    } else {
        expect(false).toBe(true)
    }
});