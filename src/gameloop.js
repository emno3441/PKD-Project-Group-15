"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.labyrinth_navigator = labyrinth_navigator;
var labyrinth_1 = require("./labyrinth");
var list_1 = require("../lib/list");
var readline = require("readline");
/** Allows the user to navigate through the labyrinth using the terminal
* @param size the size of the labyrinth
* @param path A list of number which represent the way through the labyrinth
* @returns the path through the labyrinth
*/
function labyrinth_navigator(path, size) {
    return __awaiter(this, void 0, void 0, function () {
        var rl, end, key, lab, current, possible_paths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    end = (size - 1);
                    key = path;
                    lab = (0, labyrinth_1.labyrinth2)(size, path);
                    current = 0;
                    _a.label = 1;
                case 1:
                    if (!(current !== end)) return [3 /*break*/, 5];
                    possible_paths = lab.adj[current];
                    if (!(0, list_1.is_null)(possible_paths)) return [3 /*break*/, 2];
                    console.log("Wrong path, Restart from the beginning");
                    current = 0; //if you reach a dead end. Restart from the beginning.
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, askUserChoice(current, possible_paths, rl)];
                case 3:
                    current = _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 1];
                case 5:
                    rl.close();
                    return [2 /*return*/, key];
            }
        });
    });
}
labyrinth_navigator((0, labyrinth_1.labyrinth_path)(25), 25);
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
/**
 * Maps available choices to directional labels dynamically.
 *
 * @param choices - A list of possible next nodes.
 * @returns A list of direction labels (e.g., ["left"], ["left", "forward"], etc.).
 */
function getDirectionLabels(choices) {
    var DIRECTION_LABELS = ["forward", "left", "right"];
    var labels = (0, list_1.list)();
    var optionList = choices;
    var index = 0;
    // Adds as many direction as there are options
    while (!(0, list_1.is_null)(optionList) && index < DIRECTION_LABELS.length) {
        labels = (0, list_1.append)(labels, (0, list_1.list)(DIRECTION_LABELS[index]));
        optionList = (0, list_1.tail)(optionList);
        index++;
    }
    return labels;
}
/**
 * Asks the user to choose the next node to navigate to.
 * Ensures a valid input and returns the corresponding next node.
 *
 * @param current - The current node.
 * @param choices - A list of possible next nodes.
 * @param rl - Readline interface for user input.
 * @returns The next node.
 */
function askUserChoice(current, choices, rl) {
    //choices = shuffle(choices);
    return new Promise(function (resolve) {
        var labels = getDirectionLabels(choices);
        console.log('');
        console.log("You are at a junction. Choose a direction:");
        // Display only the available choices dynamically
        var index = 0;
        var labelList = labels;
        while (!(0, list_1.is_null)(labelList)) {
            console.log("> ".concat((0, list_1.head)(labelList)));
            labelList = (0, list_1.tail)(labelList);
            index++;
        }
        rl.question("Enter your choice: ", function (answer) {
            var labelIndex = 0;
            var searchLabels = labels;
            while (!(0, list_1.is_null)(searchLabels)) { //checks if answer matches a label
                if ((0, list_1.head)(searchLabels) === answer.toLowerCase()) {
                    break;
                }
                searchLabels = (0, list_1.tail)(searchLabels);
                labelIndex++;
            }
            if (!(0, list_1.is_null)(searchLabels)) { //Checks if valid label was found
                var selected = choices;
                for (var i = 0; i < labelIndex; i++) { //Selects the correct node according to input
                    if (!(0, list_1.is_null)(selected)) {
                        selected = (0, list_1.tail)(selected);
                    }
                }
                if (!(0, list_1.is_null)(selected)) {
                    resolve((0, list_1.head)(selected)); // returns next node
                }
            }
            else {
                console.log("Invalid choice, try again.");
                resolve(askUserChoice(current, choices, rl)); // Retry if input is invalid
            }
        });
    });
}
