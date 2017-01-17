const ents = require ('./entities.js');
const myBlade = ents.getNewGrass();
console.log (typeof myBlade);


console.log ('myBlade =', JSON.stringify (myBlade));

console.log ('myBlade.getHealth() = ', myBlade.getHealth());
console.log ('myBlade.getMaxHealth() = ', myBlade.getMaxHealth());
console.log ('myBlade.health = ', myBlade.health);
console.log ('myBlade.maturityLevel = ', myBlade.maturityLevel);
console.log ('prototype = ', JSON.stringify (Object.getPrototypeOf (myBlade)));
console.log ('myBlade.isVisible() = ', myBlade.isVisible());
console.log ('myBlade.category) = ', myBlade.category);
console.log ('myBlade.head = ', myBlade.head);


