'use strict';
/* globals describe: false */
/* globals it: false */

const config = require ('../0_base/config.js');
const assert = require('chai').assert;
const entities = require ('../0_base/entities.js');
const miecos = require ('../0_base/fields.js');
const blade1 = entities.createGrass();
const initHealth = blade1.health;
const blade2 = blade1.grow();
const blade3 = blade1.eat();

describe ('Testing entities module', function () {
    
    it ('should contain a health property', function() {
        
        assert.strictEqual (blade1.health, initHealth);
        assert.strictEqual (blade2.health, initHealth + 1);
        assert.strictEqual (blade3.health, 0);
        
    });
});

describe ('Testing field module', function () {
    
    const plants = miecos.plantLevel (config.INITGRASS);
    let i = 0;
    const pLen = plants.length;
    
    while (i < pLen) {
        
        if (plants [i] !== undefined) break;
        i = i + 1;
        
    }
    
    it ('should return a function', function () {
        
        assert.strictEqual (typeof miecos.plantLevel, 'function');
        
    });
    
    it ('should return an array when called', function () {
        
        assert.strictEqual (Array.isArray (plants), true);
        
    });
    
    it ('should be a non-empty array', function () {
        
        assert.strictEqual (i < pLen, true);
        
    });
    
    it ('should return a grass element', function () {
        
        assert.strictEqual (plants [i].name, 'grass');
        
    });
    
    it ('should have two members', function () {
        
        assert.strictEqual (typeof plants.grow, 'function');
        assert.strictEqual (typeof plants.render, 'function');
        
    });
});


