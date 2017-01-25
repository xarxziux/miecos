const config = require ('./config.js');

const entity = {
    
    isSated: function () {
        
        return this.health >= this.maxHealth;
        
    },
    base: 'entity'
};

const plant = Object.create (entity);
plant.category = 'plant';
plant.grow = function() {
    
    const newPlant = Object.create (Object.getPrototypeOf (this));
    newPlant.health = Math.min (this.health + 1, this.maxHealth);
    
    return newPlant;
    
};
plant.eat = function() {
    
    const newPlant = Object.create (Object.getPrototypeOf (this));
    newPlant.health = 0;
    
    return newPlant;
    
};
plant.isVisible = function() {
    
    return this.health >= this.maturityLevel;
    
};

const grass = Object.create (plant);
grass.maxHealth = config.MAXGRASSHEALTH;
grass.maturityLevel = config.GRASSMATURITYLEVEL;
grass.name = 'grass';
grass.colour = '#00ff00';

function createGrass () {
    
    const newGrass = Object.create (grass);
    newGrass.health = config.INITGRASSHEALTH;
    
    return newGrass;
    
}

module.exports = {
    
    createGrass
    
};

