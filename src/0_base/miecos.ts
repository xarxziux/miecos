import { config } from './config';
import * as utils from './utils';
import * as entities from './entities';

const plantLayer: utils.Entity[][] | null = (function () {
    
    const row: utils.Entity[] | null = 
            new Array (config.SCREENWIDTH).fill (null);
    return new Array (config.SCREENHEIGHT).fill (row);
    
}());

const animalLayer: utils.Entity[][] | null = (function () {
    
    const row: utils.Entity[] | null = 
            new Array (config.SCREENWIDTH).fill (null);
    return new Array (config.SCREENHEIGHT).fill (row);
    
}());

// Set the initial population of the field 
initField();

function addEntity (newEnt: Entity): void {
    
    let i = config.MAXTRIES;
    
    while (i > 0) {
        
        let r1 = getRandomInt (0, SCREENWIDTH);
        let r2 = getRandomInt (0, SCREENHEIGHT);
        
        if (field [r1][r2] === null) {
            
            field [r1][r2] = newEnt;
            break;
            
        }
        
        i++;
        
    }
}


function initAnimalLayer (): void {
    
    let i = 0;
    
    while (i < config.INITRABBITS) {
        
        addEntity (entities.newRabbit());
        i++;
        
    }
}


function updateField (): void {
    
    let j = 0;
    
    while (j < SCREENWIDTH) {
        
        let i = 0;
        
        while (i < SCREENHEIGHT) {
            
            if (field[j][i] === null) break;
            
        }
        
    }
}
