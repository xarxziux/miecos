'use strict';
const ents = require ('./entities.js');
const config = require ('./config.js');

const plantLayer = Array (config.SCREENWIDTH * config.SCREENHEIGHT)
        .fill (null);

initLayer (plantLayer, [{
    
    ent: ents.createGrass
    
}]);

function initLayer (layer, ...entList) {
    
    entList.forEach (nextItem => {
        
        let i = 0;
        
        while (i < nextItem.count) {
            
            const nextGuess = findEmpty (layer);

            if (nextGuess !== null)
                layer [nextGuess] = nextItem.ent();
            
            i = i + 1;
            
        }
    });
}


function updatePlantLayer (arr) {
    
    let newCount = [];
    
    arr.forEach (function (nextItem, i) {
        
        if ((nextItem === null) ||  (nextItem.category !== 'plant'))
            return;
        
        const newItem = nextItem.grow();
        
        if (newItem.isSated()) {
            
            arr [i] = newItem.spawn();
            newCount.push (newItem.init);
            
        } else arr [i] = newItem;

        i = i + 1;
        
    });
    
    newCount.forEach (function (nextItem) {
        
        const nextGuess = findEmpty (arr);
        if (nextGuess !== null)
            arr [nextGuess] = nextItem();
        
    });
}


function renderLayer (arr) {
    
    return Array (config.SCREENHEIGHT)
        .fill (null)
        .map (function (_, i) {
            
            return Array (config.SCREENWIDTH)
                .fill (null)
                .map (function (_, j) {
                    
                    const index = (i * config.SCREENWIDTH) + j;
                    
                    return ((arr [index] === null) ||
                            (!arr [index].isVisible())) ?
                        null :
                        arr [index].colour;
                    
                });
        });
}


function findEmpty (arr) {
    
    let i = 0;
    
    while (i < config.MAXTRIES) {
        
        const guess = Math.floor (Math.random() * arr.length);
        if (arr [guess] === null)
            return guess;
        
        i = i + 1;
        
    }
    
    return null;
    
}


