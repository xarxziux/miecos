'use strict';
const ents = require ('./entities.js');
const config = require ('./config.js');
const output = require ('./canvas.js');
const update = output.update.bind (
        null, config.SCREENWIDTH, config.SCREENHEIGHT);

// const utils = require ('./utils.js');
/*
const rcToIndex = utils.getRowColToIndex.bind (
        null, config.SCREENWIDTH, config.SCREENHEIGHT);
const indexToRC = utils.getIndexToRowCol.bind (
        null, config.SCREENWIDTH, config.SCREENHEIGHT);
*/

const plantLayer = Array (config.SCREENWIDTH * config.SCREENHEIGHT)
        .fill (null);

function init () {
    
    if (!output.init (config.SCREENWIDTH * 10, config.SCREENHEIGHT * 10))
        return;
    
    let i = 0;
    let blade = ents.createGrass();
    
    while (i < 50) {
        
        plantLayer [i] = blade;
        i = i + 1;
        
    }

    update (plantLayer);
    return;
    
}


/*function initLayer (layer, entList) {
    
    entList.forEach (nextItem => {
        
        let i = 0;
        
        while (i < nextItem.count) {
            
            const nextGuess = findEmptyIndex (layer);
            
            if (nextGuess !== null)
                layer [nextGuess] = nextItem.init();
            
            i = i + 1;
            
        }
    });
}*/


/* function updatePlantLayer (arr) {
    
    let newCount = [];
    
    arr.forEach (function (nextItem, i) {
        
        if (nextItem === null)
            return;
        
        if (nextItem.category !== 'plant') {
            
            output.logMessage ('Non-plant item detected in plant layer');
            return;
            
        }
        
        const newItem = nextItem.grow();
        
        if (newItem.isSated()) {
            
            arr [i] = newItem.spawn();
            newCount.push (newItem.init());
            
        } else arr [i] = newItem;

        i = i + 1;
        
    });
    
    newCount.forEach (function (nextItem) {
        
        const nextGuess = findEmptyIndex (arr);
        if (nextGuess !== null)
            arr [nextGuess] = nextItem();
        
    });
} */


/*function findEmptyIndex (arr) {
    
    let i = 0;

    while (i < config.MAXTRIES) {
        
        const guess = getRandomInt (0, arr.length);
        if (arr [guess] === null) return guess;
        
        i = i + 1;
        
    }
    
    return null;
    
}*/


/* function findEmptyRC (arr, row, col, range) {
    
    let i = 0;
    
    while (i < config.MAXTRIES) {
        
        const rowGuess = getRandomInt (row - range, row + range + 1);
        const colGuess = getRandomInt (col - range, col + range + 1);
        const indexGuess = utils.rcToIndex (rowGuess, colGuess);
        if (arr [indexGuess] === null) return indexGuess;
        
        i = i + 1;
        
    }
    
    return null;
    
} */


/*function getRandomInt(_min, max) {
    
    const min = Math.ceil(_min);
    return Math.floor (Math.random() * (Math.floor(max) - min)) + min;
    
}*/


module.exports = init;
