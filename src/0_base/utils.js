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


function flattenArrays (...dataArrays) {
    
    const flatArr = Array (dataArrays [0].length)
        .fill (0)
        .map ((x, j) => {
            
            let i = 0;
            
            while (i < dataArrays.length) {
                
                if (dataArrays [i][j] !== null)
                    return dataArrays [i][j].colour;
                
                i = i + 1;
                
            }
            
            return x;
            
        });
    
    return flatArr;
    
}


module.exports = {
    
    getRowColToIndex,
    getIndexToRowCol,
    flattenArrays,
    
    getInternal: () => ({
        
        toroidal
        
    })
};
