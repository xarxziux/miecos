'use strict';
/* globals describe: false */
/* globals it: false */
/* jshint expr: true */

const config = require ('../0_base/config.js');
// const assert = require('chai').assert;
const expect = require('chai').expect;
const entities = require ('../0_base/entities.js');
const miecos = require ('../0_base/miecos.js');
const blade1 = entities.createGrass();
const initHealth = blade1.health;
const blade2 = blade1.grow();
const blade3 = blade1.eat();

describe ('Testing entities module', function () {
    
    it ('should contain a health property', function() {
        
        expect (blade1.health).to.equal (initHealth);
        expect (blade2.health).to.equal (initHealth + 1);
        expect (blade3.health).to.equal (0);
        
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
        
        expect (miecos.plantLevel).to.be.function;
        
    });
    
    it ('should return an array when called', function () {
        
        expect (plants).to.be.array;
        
    });
    
    it ('should be a non-empty array', function () {
        
        expect (i).to.be.below (pLen);
        
    });
    
    it ('should return a grass element', function () {
        
        expect (plants [i].name).to.equal ('grass');
        
    });
    
    it ('should have two members', function () {
        
        expect (plants.grow).to.be.function;
        expect (plants.render).to.be.function;
        
    });
});


