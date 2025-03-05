import { labyrinth2, labyrinth_path } from "../src/labyrinth";
import { ListGraph } from "../lib/graphs";
test('Labyrinth function makes a Listgraph with the correct size', () => {
    const lab = labyrinth2(10, labyrinth_path(10));
    expect(lab.size).toBe(10);
});

