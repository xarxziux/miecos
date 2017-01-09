interface Fixed {
    
    category: string;
    name: string;
    appearance: string;
    maxHealth: number;
    
}


interface Entity {
    
    health: number;
    sated: boolean;
    gene: string;
    visible: boolean;
    settings: Fixed;
    
};


function moveAnimal (oldAnimal: Entity): Entity {
    
    return {
        
        readonly health: oldAnimal.health - 1,
        readonly sated: false,
        readonly gene: oldAnimal.gene.slice (1) + oldAnimal.gene.slice (0,1),
        readonly visible: true,
        readonly settings: oldAnimal.settings
        
    }
}


function feedAnimal (oldAnimal: Entity, foodValue: number): Entity {
    
    const newHealth: number = oldAnimal.health + foodValue;
    const fullHealth: boolean = newHealth >= oldAnimal.settings.maxHealth;
    
    return {
        
        readonly health: (fullHealth) ? newHealth * (3/4) : newHealth,
        readonly sated: fullHealth,
        readonly gene: oldAnimal.gene.slice (1) + oldAnimal.gene.slice (0,1),
        readonly visible: true,
        readonly settings: oldAnimal.settings
        
    }
}


function growPlant (oldPlant: Entity): Entity {
    
    const newHealth: number = oldPlant.health + 1;
    const fullHealth: newHealth >= oldPlant.settings.maxHealth;
    
    return {
        
        readonly health: (fullHealth) ? newHealth * (3/4) : newHealth,
        readonly sated: fullHealth,
        readonly gene: '',
        readonly visible: newHealth >= oldPlant.setting.maxHealth/2,
        readonly settings: oldPlant.settings
        
    }
}


function eatPlant (oldPlant: Entity): Entity {
    
    return {
        
        readonly health: 0,
        readonly sated: false,
        readonly gene: '',
        readonly visible: false,
        readonly settings: oldPlant.settings
        
    }
}

