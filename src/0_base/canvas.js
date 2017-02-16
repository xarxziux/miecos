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
    
    logMessage ('dataArrays [0] non-null count = ' +
        
        dataArrays [0].reduce (function (a, x) {
            
            if (x !== null) return a + 1;
            return a;
            
        }, 0)
    );
    
    var canvas = document.getElementById ('viewField');
    
    if (!canvas.getContext) {
        
        canvas.innerHTML = 'Unsupported browser';
        return;
        
    }

    const ctx = canvas.getContext('2d');
    const plantField = ctx.createImageData (canvas.width, canvas.height);
    const newData = utils.flattenArrays (dataArrays);
    
    console.log ('plantField.data.length', plantField.data.length);
    console.log ('newData.length', newData.length);
    console.log ('dataArrays [0].length', dataArrays [0].length);
    
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
