(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.miecos = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* globals document: false */

const utils = require ('./utils.js');

function init (width, height) {
    
    logMessage ('initCanvas() called');
    
    var canvas = document.getElementById ('viewField');
    
    if (!canvas.getContext) {
        
        canvas.innerHTML = 'Unsupported browser';
        return;
        
    }
    
    logMessage ('Setting canvas size');
    canvas.width = width;
    canvas.height = height;
    
}


function update (...dataArrays) {
    
    console.log ('dataArrays.length', dataArrays.length);
    console.log ('dataArrays [0].length', dataArrays [0].length);
    
    var canvas = document.getElementById ('viewField');
    
    if (!canvas.getContext) {
        
        canvas.innerHTML = 'Unsupported browser';
        return;
        
    }
    
    const ctx = canvas.getContext('2d');
    const plantField = ctx.createImageData (canvas.width, canvas.height);
    const newData = utils.flattenArrays (dataArrays [0]);
    
    console.log ('plantField.data.length', plantField.data.length);
    console.log ('newData.length', newData.length);
    console.log ('dataArrays [0].length', dataArrays [0].length);
    console.log ('newData', newData);
    
    let i = 0;
    
    while (i < plantField.data.length) {
        
        plantField.data [i] = 127;
        i = i + 1;
        
    }
    
    ctx.putImageData (plantField, 0, 0);
    
}


function logMessage (message) {
    
    const log = document.getElementById ('messages');
    log.innerHTML = log.innerHTML + '<br />' + message;

}


function logError (err) {
    
    const log = document.getElementById ('errors');
    log.innerHTML = log.innerHTML + '<br />' + err;

}


module.exports = {
    
    init,
    update,
    logMessage,
    logError
    
};

},{"./utils.js":5}],2:[function(require,module,exports){
// Defines the width of the field, should be less than the width of the
// screen.
exports.SCREENWIDTH = 640;

// Defines the height of the field, should be less than the height of
// the screen.
exports.SCREENHEIGHT = 480;

// Defines the maximum number of entities allowed, should be less or
// equal to than (SCREENWIDTH * SCREENHEIGHT)
exports.MAXPLAYERS = 1000;

// Sets the initial number of the three basic entity types, should be
// less than or equal to MAXPLAYERS in total
exports.INITGRASS = 100;
exports.INITRABBITS = 50;
exports.INITFOXES = 50;

// Sets the maximum size of the gene.
exports.MAXGENESIZE = 80;

// Sets the maximum health for the various entitys.  The higher the
// value the longer they will "live".
exports.MAXGRASSHEALTH = 300;
// exports.MAXRABBITHEALTH = 400;
exports.INITGRASSHEALTH = 150;
// exports.INITRABBITHEALTH = 300;
exports.GRASSMATURITYLEVEL = 100;
// MAXFOXHEALTH = 400;
exports.GRASSSPAWNHEALTH = 100;

// Sets how much of a health bonus is taken when these entitys are eaten.
exports.GRASSNUTRITION = 20;
// RABBITNUTRITION = 300;

// Sets how many times various functions will try searching for a free
// space in ScreenArray before giving up.
exports.MAXTRIES = 5;

// Set how many iterations the while() loop will go through before
// exiting.
exports.TOTALRUNS = 1000;

// Sets how the entities will appear on the screen.
// exports.BLANKCHAR = '.';
// exports.GRASSCHAR = [false, true, false, false, true, false, false, true, false];
// exports.RABBITCHAR = 'r';
// exports.FOXCHAR = 'F';
exports.GRASSCOLOUR = [0, 255, 0, 255];
// exports.RABBITCOLOUR = [255, 0, 0, 255];


// The name for the output file.  If it exists, it will be overwritten.
// If not it will be created.
exports.OUTPUTFILENAME = './logs/miecos.output.txt';

exports.GRASSSPAWNDISTANCE = 50;
exports.GRASSSPAWNNUMBER = 3;

},{}],3:[function(require,module,exports){
const config = require ('./config.js');

const entity = {
    
    isSated: function () {
        
        return this.health >= this.maxHealth;
        
    },
    base: 'entity'
};

const plant = Object.create (entity);
plant.category = 'plant';
plant.grow = function() {
    
    const newPlant = Object.create (Object.getPrototypeOf (this));
    newPlant.health = Math.min (this.health + 1, this.maxHealth);
    return newPlant;
    
};
plant.eat = function() {
    
    const newPlant = Object.create (Object.getPrototypeOf (this));
    newPlant.health = 0;
    return newPlant;
    
};
plant.isVisible = function() {
    
    return this.health >= this.maturityLevel;
    
};
plant.spawn = function () {
    
    const newPlant = Object.create (Object.getPrototypeOf (this));
    this.health = this.spawnHealth;
    return newPlant;
    
};
plant.init = function () {
    
    const newPlant = Object.create (Object.getPrototypeOf (this));
    this.health = this.initHealth;
    return newPlant;
    
};

const grass = Object.create (plant);
grass.initHealth = config.INITGRASSHEALTH;
grass.spawnHealth = config.GRASSSPAWNHEALTH;
grass.maxHealth = config.MAXGRASSHEALTH;
grass.maturityLevel = config.GRASSMATURITYLEVEL;
grass.name = 'grass';
grass.colour = config.GRASSCOLOUR;


function createGrass () {
    
    const newGrass = Object.create (grass);
    newGrass.health = config.INITGRASSHEALTH;
    return newGrass;
    
}

module.exports = {
    
    createGrass,
    
    getInternal: () => ({
        
        entity,
        plant,
        grass
        
    })
};


},{"./config.js":2}],4:[function(require,module,exports){
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

},{"./canvas.js":1,"./config.js":2,"./entities.js":3}],5:[function(require,module,exports){
// const log = require ('./canvas.js').logMessage;

function getRowColToIndex (maxRow, maxCol, row, col) {
    
    return ((toroidal (col, maxCol) * maxCol) + (toroidal (row, maxRow)));
    
}


function getIndexToRowCol (maxRow, maxCol, _index) {
    
    const index = toroidal (_index, maxRow * maxCol);
    return {
        
        row: index % maxRow,
        col: Math.floor (index/maxCol)
        
    };
}


function toroidal (_x, _max) {
    
    const x = Math.round (_x);
    const max = Math.round (_max);
    if (x >= 0) return x % max;
    return max + (x % max);
    
}


function flattenArrays (...arrList) {
    
    console.log ('arrList.length', arrList.length);
    console.log ('arrList [0].length', arrList [0].length);
    
    const mappedArr =  Array (arrList [0].length)
        .fill (void 0)
        .map (function (x, i) {
        
            let j = 0;
            
            while (j < arrList.length) {
                
                if (arrList [j][i] !== null)
                    return arrList [j][i].colour;
                
                j = j + 1;
                
            }
            
            return [0, 0, 0, 0];
            
        });
    
    console.log ('mappedArr.length', mappedArr.length);
    const reducedArr = mappedArr.reduce ((a, x) => (a.concat (x)), []);
    console.log ('reducedArr.length', reducedArr.length);
    
    return new Uint8ClampedArray (reducedArr);
    
}


module.exports = {
    
    getRowColToIndex,
    getIndexToRowCol,
    flattenArrays,
    
    getInternal: () => ({
        
        toroidal
        
    })
};

},{}]},{},[4])(4)
});