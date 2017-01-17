// import * as utils from './utils';
// import { config } from './config';

enum Direction {
    
    Stay = 0,
    Up,
    UpRight,
    Right,
    DownRight,
    Down,
    DownLeft,
    Left,
    UpLeft
    
}

interface EntType {
    
    health: number;
    readonly startHealth: number;
    readonly maxHealth: number;
    readonly category: string;
    readonly name: string;
    readonly appearance: string;
    
}

interface AnimalType extends entType {
    
    readonly getMove (): Direction;
    readonly feed (x: number): AnimalType;
    readonly breed (): AnimalType;
    readonly move (): AnimalType;
    
}

const entity: entType = {
    
    health: this.health,
    maxhealth: this.maxhealth,
    category: this.category,
    name: this.name,
    appearance: this.appearance
    
};

const animal: AnimalType = Object.create (entity);

/*
animal
{
    
    move: : this.move;
    
    
};

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
*/


