/* globals describe: false */
/* globals it: false */

const assert = require('chai').assert;
const entities = require ('../src/0_base/entities.js');
const blade1 = entities.createGrass();
const initHealth = blade1.health;
const blade2 = blade1.grow();
const blade3 = blade1.eat();

describe ('Testing health', function () {
    
    it ('should contain a health property', function() {
        
        assert.strictEqual (blade1.health, initHealth);
        assert.strictEqual (blade2.health, initHealth + 1);
        assert.strictEqual (blade3.health, 0);
        
    });
});




