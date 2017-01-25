'use strict';
const ents = require ('./entities.js');
const config = require ('./config.js');
// const myBlade = ents.createGrass();
// const animalLevel = initField (config.SCREENWIDTH, config.SCREENHEIGHT);
const plantLevel = function (grassCount) {
    
    console.log ('init() function called');
    
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
    
    pArr.update = function () {
        
        let i = 0;
        let newCount = 0;
        
        while (i < this.length) {
            
            if ((this [i] === undefined) ||
                    (this [i].category !== 'plant'))
                continue;
            
            this [i] = this [i].grow();
            
            if (this [i].isSated()) {
                
                this [i] = ents.createGrass();
                newCount = newCount + 1;
                
            }
            
            i = i + 1;
            
        }
        
        i = 0;
        
        while (i < newCount) {
            
            let nextGuess = findEmpty (this);
            
            if (nextGuess === null) continue;
            
            this [nextGuess] = ents.createGrass();
            
        }
    };
    
    pArr.render = function () {
        
        let rArr = [];
        let i = 0;
        
        while (i < config.SCREENHEIGHT) {
            
            let j = 0;
            
            while (j < config.SCREENWIDTH) {
                
                let index = (i * config.SCREENWIDTH) + j;
                
                if (this [index] === undefined)
                    rArr [i][j] = undefined;
                
                else rArr [i][j] = this [index].colour;
                
                j = j + 1;
            }
            
            i = i + 1;
            
        }
    };
    
    return pArr;
    
};

function findEmpty (arr) {
    
    let i = 0;
    
    while (i < config.MAXTRIES) {
        
        let guess = Math.floor (Math.random() * arr.length);
        if (arr [guess] === undefined)
            return guess;
        
        console.log (arr [guess], arr [guess] === undefined);
        i = i + 1;
        
    }
    
    return null;

}

module.exports = {
    
    plantLevel
    
};
