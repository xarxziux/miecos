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
    
    var canvas = document.getElementById ('viewField');
    
    if (!canvas.getContext) {
        
        canvas.innerHTML = 'Unsupported browser';
        return;
        
    }
    
    const flatArray = utils.flattenArrays (dataArrays);
    
    const ctx = canvas.getContext('2d');
    const plantField = ctx.createImageData (canvas.width, canvas.height);
    
    flatArray.forEach ((x, i) => {
        
        if (x === null) return;
        
        plantField.data [i * 4] = x.colour [0];
        plantField.data [(i * 4) + 1] = x.colour [1];
        plantField.data [(i * 4) + 2] = x.colour [2];
        plantField.data [(i * 4) + 3] = x.colour [3];
    
    });
    
    ctx.putImageData (plantField, 0, 0);

}


function logMessage (message) {
    
    const log = document.getElementById ('messages');
    log.innerHTML = log.innerHTML + '\n' + message;

}


function logError (err) {
    
    const log = document.getElementById ('errors');
    log.innerHTML = log.innerHTML + '\n' + err;

}


module.exports = {
    
    init,
    update,
    logMessage,
    logError
    
};
