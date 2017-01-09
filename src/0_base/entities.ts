import * as utils from './utils';
import { config } from './config';

const rabbitSettings: utils.Fixed = {
    
    category: 'herbivore',
    name: 'rabbit',
    appearance: config.RABBITCOLOUR,
    maxHealth: config.MAXRABBITHEALTH
    
}

const grassSettings: utils.Fixed = {
    
    category: 'plant',
    name: 'grass',
    appearance: config.GRASSCOLOUR,
    maxHealth: config.MAXGRASSHEALTH
    
}


export function newRabbit(): utils.Entity {
    
    return {
        
        health: config.MAXRABBITHEALTH/2,
        sated: false,
        gene: utils.getGeneString(),
        visible: true,
        settings: rabbitSettings
        
    }
}


export function newGrass(): utils.Entity {
    
    return {
        
        health: config.MAXGRASSHEALTH/2,
        sated: false,
        gene: '',
        visible: true,
        settings: grassSettings
        
    }
}



