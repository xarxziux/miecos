import { config } from './config';

export interface Fixed {
    
    readonly category: string;
    readonly name: string;
    readonly appearance: string;
    readonly maxHealth: number;
    
}


export interface Entity {
    
    readonly health: number;
    readonly sated: boolean;
    readonly gene: string;
    readonly visible: boolean;
    readonly settings: Fixed;
    
};


export function moveAnimal (oldAnimal: Entity): Entity {
    
    return {
        
        health: oldAnimal.health - 1,
        sated: false,
        gene: oldAnimal.gene.slice (1) + oldAnimal.gene.slice (0,1),
        visible: true,
        settings: oldAnimal.settings
        
    }
}


export function feedAnimal (oldAnimal: Entity, foodValue: number): Entity {
    
    const newHealth: number = oldAnimal.health + foodValue;
    const fullHealth: boolean = newHealth >= oldAnimal.settings.maxHealth;
    
    return {
        
        health: (fullHealth) ? newHealth * (3/4) : newHealth,
        sated: fullHealth,
        gene: oldAnimal.gene.slice (1) + oldAnimal.gene.slice (0,1),
        visible: true,
        settings: oldAnimal.settings
        
    }
}


export function growPlant (oldPlant: Entity): Entity {
    
    const newHealth: number = oldPlant.health + 1;
    const fullHealth: boolean = newHealth >= oldPlant.settings.maxHealth;
    
    return {
        
        health: (fullHealth) ? newHealth * (3/4) : newHealth,
        sated: fullHealth,
        gene: '',
        visible: newHealth >= oldPlant.settings.maxHealth/2,
        settings: oldPlant.settings
        
    }
}


export function eatPlant (oldPlant: Entity): Entity {
    
    return {
        
        health: 0,
        sated: false,
        gene: '',
        visible: false,
        settings: oldPlant.settings
        
    }
}


export function getGeneString(): string {
    
    const geneLength: number = getRandomInt (2, config.MAXGENESIZE);
    const blankArr: string[] = new Array (geneLength).fill ('I');
    
    return blankArr.reduce (function (accum) {
        
        return accum + String.fromCharCode (getRandomInt (65, 74));
        
    }, '');
}


function getRandomInt(min: number, max: number) {
    
    return Math.floor (Math.random() * (max - min)) + min;
    
}
