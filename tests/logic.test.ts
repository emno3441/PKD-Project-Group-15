import { numberListToString, stringToNumberList } from '../src/logic';
import { ph_empty, ProbingHashtable, hash_id, ph_insert} from '../lib/hashtables'
import { List, list } from '../lib/list';

const test_ht: ProbingHashtable<number, number> = ph_empty(4, hash_id);
ph_insert(test_ht, 1, 1);
const filename: string = './test4.txt'

test('numberListToString creates string', () => {
    const str: string = '1234';
    const lst: List<number> = list(1, 2, 3, 4);
    expect(numberListToString(lst)).toBe(str);
});

test('stringToNumberList makes list of numbers', () => {
    const str: string = '1234';
    const lst: List<number> = list(1, 2, 3, 4);
    expect(stringToNumberList(str)).toStrictEqual(lst);
});

test('string with invalid character results in error', () => {
    const str: string = '12a';
    expect(() => stringToNumberList(str)).toThrow();
});