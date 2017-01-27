'use strict';
const ents = require ('./entities.js');
const config = require ('./config.js');
// const myBlade = ents.createGrass();
// const animalLevel = initField (config.SCREENWIDTH, config.SCREENHEIGHT);
const plantLevel = function (grassCount) {
    
    // console.log ('init() function called');
    
    const pArr = Array (config.SCREENWIDTH * config.SCREENHEIGHT);
    
    let i = 0;
    
    while (i < grassCount) {
        
        i = i + 1;
        let nextGuess = findEmpty (pArr);
        console.log ('findEmpty() function returned', nextGuess);
        
        if (nextGuess !== null) {
            
            pArr [nextGuess] = ents.createGrass();
        
        }
    }
    
    
    return pArr;
    
};

module.exports = {
    
    plantLevel
    
};
