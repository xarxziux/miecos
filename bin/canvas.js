(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.miecos = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* globals document: false */

const config = require ('./config.js');

function drawCanvas () {
    
    log ('drawCanvas() called');
    
    var canvas = document.getElementById ('viewField');
    
    if (!canvas.getContext) {
        
        canvas.innerHTML = 'Unsupported browser';
        return;
        
    }
    
    log ('Setting canvas size');
    canvas.width = config.SCREENWIDTH;
    canvas.height = config.SCREENHEIGHT;
    
    
    const ctx = canvas.getContext('2d');
    const plantField = ctx.createImageData (
            config.SCREENWIDTH, config.SCREENHEIGHT);
    const whiteDot = {red: 255, green: 255, blue: 255, alpha: 255};
    const redDot = {red: 255, green: 0, blue: 0, alpha: 255};
    const blueDot = {red: 0, green: 0, blue: 255, alpha: 255};
    
    /*
    log ('plantField = ' + JSON.stringify (plantField));
    log ('typeof plantField = ' + typeof plantField);
    log ('typeof plantField.width = ' + typeof plantField.width);
    log ('Array.isArray (plantField.data) = ' + Array.isArray (plantField.data));
    // log ('plantField.data.length = ' + plantField.data.length);
    // log ('plantField.data [193280] = ' + plantField.data [193280]);
    setPixel (plantField, redDot, 320, 240);
    // log ('plantField.data [193280] = ' + plantField.data [193280]);
    
    setPixel (plantField, blueDot, 323, 240);
    setPixel (plantField, blueDot, 320, 243);
    setPixel (plantField, redDot, 323, 243);
    
    plantField.data[3500] = 255;
    plantField.data[3501] = 255;
    plantField.data[3502] = 255;
    plantField.data[3503] = 255;
    
    // log (plantField.data [0]);
    // log (plantField.data [10]);
    // log (plantField.data [100]);
    
    //plantField.data[0] = 34;
    
    const testArr = [0, 0, 0, 0, 0];
    log ('testArr = ' + testArr);
    updateArray (testArr, 0, 20);
    log ('testArr = ' + testArr);
    
    const nonZero = plantField.data.filter (
            (x) => (x !== 0));
    
    log ('nonZero.length = ' + nonZero.length);
    */
    
    // plantField.data.fill (0);
    log (plantField.data [0]);
    log (plantField.data [10]);
    log (plantField.data [100]);
    plantField.data [320] = 255;
    plantField.data [321] = 255;
    plantField.data [322] = 255;
    plantField.data [323] = 255;
    /*plantField.data [3504] = 255;
    plantField.data [3505] = 255;
    plantField.data [3506] = 255;
    plantField.data [3507] = 255;
    plantField.data [3508] = 255;
    plantField.data [3509] = 255;
    plantField.data [3510] = 255;
    plantField.data [3511] = 255;
    plantField.data [3512] = 255;
    plantField.data [3513] = 255;
    plantField.data [3514] = 255;
    plantField.data [3515] = 255;
    log (plantField.data [3500]);
    log (plantField.data [3501]);
    log (plantField.data [3502]);*/
    ctx.putImageData (plantField, 0, 0);
    
    
}


function setPixel (field, pixel, col, row) {
    
    const red = 4 * ((row * field.width) + col);
    log ('red = ' + red + ', pixel.red = ' + pixel.red);
    field.data [red] = pixel.red;
    field.data [red + 1] = pixel.green;
    field.data [red + 2] = pixel.blue;
    field.data [red + 3] = pixel.alpha;

}


function updateArray (arr, i, val) {
    arr[i] = val;
}

function log (message) {
    
    const log = document.getElementById ('log');
    log.innerHTML = log.innerHTML + '<br />' + message;

}

module.exports = {
    
    drawCanvas
    
};

},{"./config.js":2}],2:[function(require,module,exports){
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
exports.INITGRASS = 10;
exports.INITRABBITS = 50;
exports.INITFOXES = 50;

// Sets the maximum size of the gene.
// exports.MAXGENESIZE = 80;

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
exports.TOTALRUNS = 0;

//Sets how the entities will appear on the screen.
exports.BLANKCHAR = '.';
exports.GRASSCHAR = '|';
// exports.RABBITCHAR = 'r';
// exports.FOXCHAR = 'F';
exports.GRASSCOLOUR = 'green';
// exports.RABBITCOLOUR = 'brown';


// The name for the output file.  If it exists, it will be overwritten.
// If not it will be created.
exports.OUTPUTFILENAME = './logs/miecos.output.txt';


},{}]},{},[1])(1)
});