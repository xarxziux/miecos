/*
const config = require ('./config.js');

const entity = {
    
    // getHealth: () => this.health,
    // getMaxHealth: () => this.maxHealth,
    // update: () => this.update,
    // getName: () => this.name,
    // getCategory: () => this.category
    
};

const plant = Object.create (entity);
plant.category = 'plant';
// plant.getMaturityLevel = () => this.maturityLevel,
// plant.visibility = () => (this._health() >= this._maturityLevel)

plant.update = () => {
    
    // const health = this.getHealth();
    // const maxHealth = this.getMaxHealth();
    // const category = this.getCategory();
    // const 
    // const name = this.name;
    
    const newPlant = Object.create (plant);
    newPlant.getHealth = () => this.getHealth() + 1;
    newPlant.maxHealth = this.getMaxHealth;
    newPlant.getMaturityLevel = this.getMaturityLevel;
    newPlant.category = this.getCategory;
    newPlant.name = this.getName;
    
}
*/

const newGrass = function () {
    
    return {
        
        getHealth: () => config.INITGRASSHEALTH,
        getMaxHealth: () => config.MAXGRASSHEALTH,
        getMaturityLevel: () => config.GRASSMATURITYLEVEL,
        getCategory: () => 'plant',
        getName: () => 'grass',
        update: () => {
            
            getHealth: () => (this.getHealth + 1),
            getMaxHealth: this.getMaxHealth,
            getMaturityLevel: this.getMaturityLevel,
            getCategory: this.getCategory,
            getName: this.getName,
            update: this.update
            
        }
        
    };
    
    const grassObj = Object.create (plant);
    
}

const animal = Object.create (entity);

plant.grow = function () {
    
    if (this.health < this.maxHealth) {
        
        
        
    }
    
}


