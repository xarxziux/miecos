import { config } from './config';
import * as utils from './utils';
import * as entities from './entities';

const field: utils.Entity[][] | null = (function () {
    
    const row: utils.Entity[] | null =
            new Array (config.SCREENWIDTH).fill (null);
    return new Array (config.SCREENHEIGHT).fill (row);
    
}());

// console.log (field.length);
// console.log (field [0].length);

// Set the initial population of the field 
field [100][100] = entities.newRabbit();

console.log (field [100][100].settings.name);
console.log (field [100][100].gene);