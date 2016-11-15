var maxGenerations = 50;
var genCount = 0;
var wolframKey = 73;
var baseLattice = [
    false, false, false, false, false, false, false, false];
var fullLattice = baseLattice.concat(baseLattice).concat(baseLattice)
    .concat(baseLattice).concat(baseLattice).concat(baseLattice)
    .concat([true])
    .concat(baseLattice).concat(baseLattice).concat(baseLattice)
    .concat(baseLattice).concat(baseLattice).concat(baseLattice);
var nextGen = fullLattice;
function getNG(current, key) {
    return getNGRecur([], false, current[0], current.slice(1));
    function getNGRecur(accum, left, top, right) {
        // console.log ('accum.length =', accum.length);
        // console.log ('right.length =', right.length);
        if (right.length === 0)
            return accum.concat(getNextCell(left, top, false, key));
        else
            return getNGRecur(accum.concat(getNextCell(left, top, right[0], key)), top, right[0], right.slice(1));
    }
    function getNextCell(left, top, right, key) {
        if (left && top && right)
            return (Math.floor(key / 1) % 2) === 1;
        else if (left && top && !right)
            return (Math.floor(key / 2) % 2) === 1;
        else if (left && !top && right)
            return (Math.floor(key / 4) % 2) === 1;
        else if (left && !top && !right)
            return (Math.floor(key / 8) % 2) === 1;
        else if (!left && top && right)
            return (Math.floor(key / 16) % 2) === 1;
        else if (!left && top && !right)
            return (Math.floor(key / 32) % 2) === 1;
        else if (!left && !top && right)
            return (Math.floor(key / 64) % 2) === 1;
        else if (!left && !top && !right)
            return (Math.floor(key / 128) % 2) === 1;
        else
            throw new Error('This option should be unreachable');
    }
}
function printGeneration(gString) {
    console.log(gString.reduce(function (accum, nextItem) {
        return (nextItem) ? accum + 'X' : accum + '.';
    }, ''));
}
printGeneration(nextGen);
while (genCount < maxGenerations) {
    nextGen = getNG(nextGen, wolframKey);
    printGeneration(nextGen);
    genCount++;
}
