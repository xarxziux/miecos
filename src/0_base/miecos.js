'use strict';
const ents = require ('./entities.js');
const config = require ('./config.js');
// const myBlade = ents.createGrass();
const plantLevel = Array (config.SCREENWIDTH * config.SCREENHEIGHT).fill (null);
// const animalLevel = initField (config.SCREENWIDTH, config.SCREENHEIGHT);
initField (plantLevel, config.INITGRASS);

module.exports = plantLevel;

function findEmpty (arr) {
    
    let i = 0;
    let guess = Math.random() * arr.length;
    
    while (i < config.MAXTRIES) {
        
        if (arr [guess] === null)
            return guess;
        i = i + 1;
        
    }
    
    return null;

}

function initField (arr, grassCount) {
    
    let i = 0;
    
    while (i < grassCount) {
        
        let nextGuess = findEmpty (arr);
        
        if (nextGuess === null) continue;
        
        arr [nextGuess] = ents.createGrass();
        i = i + 1;
        
    }
}

