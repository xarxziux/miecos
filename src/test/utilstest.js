const utils = require ('../0_base/utils.js');
const fa = utils.flattenArrays;
const red = {colour: 'red'};
const green = {colour: 'green'};
const blue = {colour: 'blue'};
const grey = {colour: 'grey'};
const blank = [0, 0, 0, 0];
const arr1 = [ null,  null,  null,  null];
const arr2 = [ blue,  null,  blue,  null];
const arr3 = [ null,  null,  null,   red];
const arr4 = [ null,  grey,  null,  null];
const arr5 = [green,  null,  null, green];

console.log ('arr1', getFlat (arr1));
console.log ('arr1', fa ([arr1]));
console.log ('arr2', getFlat (arr2));
console.log ('arr2', fa ([arr2]));

function getFlat (arr) {
    
    return arr.reduce ((a, x) => {
        
        if (x === null) return a.concat (0);
        return a.concat (x.colour);
        
    }, []);
}

