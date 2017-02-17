const config = require ('./config.js');

function initLayer (layer, ...entList) {
    
    entList.forEach (nextItem => {
        
        let i = 0;
        
        while (i < nextItem.count) {
            
            const nextGuess = findEmptyIndex (config.MAXTRIES, layer);
            
            if (nextGuess !== null)
                layer [nextGuess] = nextItem.init();
            
            i = i + 1;
            
        }
    });
}


function findEmptyIndex (tries, arr) {
    
    let i = 0;

    while (i < tries) {
        
        const guess = getRandomInt (0, arr.length);
        if (arr [guess] === null) return guess;
        
        i = i + 1;
        
    }
    
    return null;
    
}


function getRandomInt(_min, max) {
    
    const min = Math.ceil(_min);
    return Math.floor (Math.random() * (Math.floor(max) - min)) + min;
    
}


module.exports = {
    
    initLayer,
    
    getInternal: () => ({
        
        findEmptyIndex,
        getRandomInt
        
    })
};

