import { writeFile } from 'node:fs';


// should be removed? Usefull for creating files
/** 
 * Creates a file with given data as text
 * taken from Node.js documentation at 
 * https://nodejs.org/docs/latest/api/fs.html#fswritefilefile-data-options-callback
 * @param filename {string} - name of file to write
 * @param data {string} - text in created file
 */
function write_file(filename: string, data: string): void {
    writeFile(filename, data, (err) => {
        if (err) throw err;
    });
}
const data: string = 'Hello world';

write_file('test1.txt', data);
write_file('test2.txt', data);
write_file('test3.txt', data);
write_file('test4.txt', data);