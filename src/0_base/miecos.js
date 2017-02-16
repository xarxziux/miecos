'use strict';
const ents = require ('./entities.js');
const config = require ('./config.js');
const output = require ('./canvas.js');
// const utils = require ('./utils.js');
/*
const rcToIndex = utils.getRowColToIndex.bind (
        null, config.SCREENWIDTH, config.SCREENHEIGHT);
const indexToRC = utils.getIndexToRowCol.bind (
        null, config.SCREENWIDTH, config.SCREENHEIGHT);
*/

const plantLayer = Array (config.SCREENWIDTH * config.SCREENHEIGHT)
        .fill (null);
let updateCount = 0;

function init () {
    
    /*initLayer (plantLayer, [{
        
        init: ents.createGrass,
        count: config.INITGRASS
        
    }]);*/
    
    let i = 0;
    let blade = ents.createGrass();
    
    while (i < 5) {
        
        plantLayer [i] = blade;
        i = i + 1;
        
    }
    
    output.logMessage ('Grass count = ' +
        
        plantLayer.reduce (function (a, x) {
            
            if (x !== null) return a + 1;
            return a;
            
        }, 0)
    );
    
    output.init (config.SCREENWIDTH, config.SCREENHEIGHT);
    
    console.log (typeof plantLayer [0],
            plantLayer [1],
            plantLayer [2],
            plantLayer [3],
            plantLayer [4],
            plantLayer [5]);
    
    console.log ('Update Count ', updateCount);
    updateCount = updateCount + 1;
    output.update (plantLayer);
    
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
