/* globals document: false */

const utils = require ('./utils.js');
const shapeSize = require ('./utils.js').SCREENSCALE - 1;
const colourList = {
    
    red: [0, 255, 0, 255],
    green: [0, 255, 0, 255],
    blue: [0, 255, 0, 255],
    white: [0, 255, 0, 255]
    
};


function init (width, height) {
    
    var canvas = document.getElementById ('viewField');
    
    if (!canvas.getContext) {
        
        canvas.innerHTML = 'Unsupported browser';
        return false;
        
    }
    
    canvas.width = width;
    canvas.height = height;
    return true;
    
}


function update (arrWidth, arrHeight, ...dataArrays) {
    
    const canvas = document.getElementById ('viewField');
    var ctx = canvas.getContext('2d');
    const flatArr = utils.flattArrays (dataArrays);
    flatArr.forEach ((x, i) => {
        
        if (x === 0) return;
        
        ctx.fillStyle = colourList [x.colour];
        ctx.fillRect (shapeSize, shapeSize, i % arrWidth,
                Math.floor (i / arrHeight));
        
    });
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
