import { labyrinth2, labyrinth_path } from "../src/labyrinth";
import { ListGraph } from "../lib/graphs";
test('Labyrinth function makes a Listgraph', () => {
    const lab = labyrinth2(10, labyrinth_path(10));
    console.log(typeof(lab));
    expect(typeof(lab)).toBe("ListGraph");
});

