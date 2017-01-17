const config = require ('./config.js');

// Basic getters
// const getHealth = () => this.health;
const getHealth = () => {console.log ('getHealth() says hello');};
const getMaxHealth = () => {console.log (this);};
const getCategory = () => this.category;
const getName = () => this.name;
const isSated = () => (this.health >= this.maxHealth);
const head = 'entity';

const entity = {
    
    getHealth,
    getMaxHealth,
    getCategory,
    getName,
    isSated,
    head
    
};

const growPlant = () => {
    
    const newHealth = (this.getHealth() < this.getMaxHealth()) ?
        this.getHealth() + 1 :
        this.getMaxHealth();
    
    const newPlant = Object.create (entity);
    newPlant.health = newHealth;
    newPlant.maxHealth = this.getMaxHealth();
    newPlant.name = this.getName();
    newPlant.maturityLevel = this.getMaturityLevel();
    
    return newPlant;
    
};

const eatPlant = () => {
    
    const newPlant = Object.create (entity);
    newPlant.health = 0;
    newPlant.maxHealth = this.getMaxHealth();
    newPlant.maturityLevel = () => this.getMaturityLevel();
    newPlant.name = this.getName();
    
    return newPlant;
    
};

const plant = Object.create (entity);
plant.category = 'plant';
plant.grow = growPlant;
plant.eat = eatPlant;
plant.getMaturityLevel = () => this.maturityLevel;
plant.isVisible = () => (this.health >= this.maturityLevel);

const newGrass = Object.create (plant);
newGrass.health = config.INITGRASSHEALTH;
newGrass.maxHealth = config.MAXGRASSHEALTH;
newGrass.maturityLevel = config.GRASSMATURITYLEVEL;
newGrass.name = 'grass';

exports.getNewGrass = () => newGrass;
    

