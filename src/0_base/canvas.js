/* globals document: false */

const utils = require ('./utils.js');
const shapeSize = require ('./config.js').BLOCKSIZE;
const shapePadding = require ('./config.js').BLOCKPADDING;
const colourList = [
    
    'black',
    'red',
    'green',
    'blue',
    'white'
    
];


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
    const ctx = canvas.getContext('2d');
    const flatArr = utils.flattenArrays (dataArrays);
    
    flatArr.forEach ((x, i) => {
        
        if (x === 0) return;
        
        ctx.fillStyle = colourList [x];
        ctx.fillRect (((i % arrWidth) * shapeSize) + shapePadding,
                ((Math.floor (i / arrWidth)) * shapeSize) + shapePadding,
                shapeSize - (shapePadding * 2),
                shapeSize - (shapePadding * 2));
        
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
