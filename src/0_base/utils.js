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
    
    const flatArray = Array (arrList [0].length)
        .fill ([0, 0, 0, 0])
        .map (function (x, i) {
            
            let j = 0;
            
            while (j < arrList.length) {
                
                if (arrList [j][i] !== null) return arrList [j][i].colours;
                j = j + 1;
                
            }
            
            return x;
            
        })
        .reduce ((a, x) => (a.concat (x)), []);
        
    return new Uint8ClampedArray (flatArray);
    
}


module.exports = {
    
    getRowColToIndex,
    getIndexToRowCol,
    flattenArrays,
    
    getInternal: () => ({
        
        toroidal
        
    })
};
