const maxGenerations: number = 50;
let genCount: number = 0;
let wolframKey: number = 73;
const baseLattice: boolean[] = [
        false, false, false, false, false, false, false, false];
const fullLattice: boolean[] = 
        baseLattice.concat (baseLattice).concat (baseLattice)
        .concat (baseLattice).concat (baseLattice).concat (baseLattice)
        .concat ([true])
        .concat (baseLattice).concat (baseLattice).concat (baseLattice)
        .concat (baseLattice).concat (baseLattice).concat (baseLattice);
let nextGen: boolean[] = fullLattice;


function getNG (current: boolean[], key: number): boolean[] {
    
    return getNGRecur ([], false, current [0], current.slice (1));
    
    function getNGRecur (accum: boolean[], left: boolean, top: boolean,
            right: boolean[]): boolean[] {
        
        // console.log ('accum.length =', accum.length);
        // console.log ('right.length =', right.length);
        
        if (right.length === 0)
            return accum.concat (getNextCell (left, top, false, key));
        
        else return getNGRecur (
                accum.concat (getNextCell (
                    left, top, right [0], key)),
                top, right [0], right.slice (1));
                
    }
    
    function getNextCell (left: boolean, top: boolean, right: boolean,
        key: number): boolean {
        
        if (left && top && right)
            return (Math.floor (key/1) % 2) === 1;
        else if (left && top && !right)
            return (Math.floor (key/2) % 2) === 1;
        else if (left && !top && right)
            return (Math.floor (key/4) % 2) === 1;
        else if (left && !top && !right)
            return (Math.floor (key/8) % 2) === 1;
        else if (!left && top && right)
            return (Math.floor (key/16) % 2) === 1;
        else if (!left && top && !right)
            return (Math.floor (key/32) % 2) === 1;
        else if (!left && !top && right)
            return (Math.floor (key/64) % 2) === 1;
        else if (!left && !top && !right)
            return (Math.floor (key/128) % 2) === 1;
        else throw new Error ('This option should be unreachable');
        
    }
}

function printGeneration (gString: boolean[]): void {
    
    console.log (gString.reduce (function (accum: string, nextItem: boolean):
            string {
        
        return (nextItem) ? accum + 'X' : accum + '.';
        
    }, ''));
}

printGeneration (nextGen);

while (genCount < maxGenerations) {
    
    nextGen = getNG (nextGen, wolframKey);
    printGeneration (nextGen);
    genCount++;
    
}



