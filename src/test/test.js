const test = require ('tape');
// const entities = require ('../0_base/entities.js');
const utils = require ('../0_base/utils.js');
console.log (JSON.stringify (utils));
// const utilsInt = utils.getInternal();

test ('Testing toroidal() function', function (t) {
    
    const toro = utils.getInternal().toroidal;
    
    t.plan (10);
    t.equal (typeof toro, 'function',
            'utils.getInternal().toroidal is a function and...');
    t.equal (toro (7, 18), 7);
    t.equal (toro (100, 100), 0);
    t.equal (toro (567, 4), 3);
    t.equal (toro (-7, 18), 11);
    t.equal (toro (45.7, 3.6), 2);
    t.equal (toro (999.999, 9), 1);
    t.equal (toro (-999.999, 9), 8);
    t.equal (toro (-12345678, 15), 12);
    t.equal (toro (-12345677.8, 12344.5), 11667);
    t.end();
    
});

test ('Testing getRowColToIndex() function', function (t) {
    
    const rc2I = utils.getRowColToIndex;
    
    t.plan (10);
    t.equal (typeof rc2I, 'function',
            'utils.getRowColToIndex is a function and...');
    t.equal (rc2I (100, 100, 0, 0), 0);
    t.equal (rc2I (100, 100, 6, 0), 6);
    t.equal (rc2I (100, 100, 6, 6), 606);
    t.equal (rc2I (100, 100, 6, -6), 9406);
    t.equal (rc2I (100, 100, 100, 100), 0);
    t.equal (rc2I (100, 100, 101, 100), 1);
    t.equal (rc2I (100, 100, 1, 100), 1);
    t.equal (rc2I (100, 100, 100, 101), 100);
    t.equal (rc2I (100, 100, -100006, -100006), 9494);
    t.end();
    
});

test ('Testing getIndexToRowCol() function', function (t) {
    
    const i2RC = utils.getIndexToRowCol;
    
    t.plan (10);
    t.equal (typeof i2RC, 'function',
            'utils.getIndexToRowCol is a function and...');
    t.deepEqual (i2RC (100, 100, 0), {row: 0, col: 0});
    t.deepEqual (i2RC (100, 100, 6), {row: 6, col: 0});
    t.deepEqual (i2RC (100, 100, 606), {row: 6, col: 6});
    t.deepEqual (i2RC (100, 100, 9406), {row: 6, col: 94});
    t.deepEqual (i2RC (100, 100, 10000), {row: 0, col: 0});
    t.deepEqual (i2RC (100, 100, 10001), {row: 1, col: 0});
    t.deepEqual (i2RC (100, 100, 10100), {row: 0, col: 1});
    t.deepEqual (i2RC (100, 100, -1), {row: 99, col: 99});
    t.deepEqual (i2RC (100, 100, 123456789), {row: 89, col: 67});
    t.end();
    
});

test ('Test flattenArrays() function', function (t) {
    
    const fa = utils.flattenArrays;
    /*const red = {colours: [255, 0, 0, 255]};
    const green = {colours: [0, 255, 0, 255]};
    const blue = {colours: [0, 0, 255, 255]};
    const grey = {colours: [255, 255, 255, 127]};*/
    const arr1 = [ null,  null,  null,  null];
    /* const arr2 = [ blue,   red,  blue,  grey];
    const arr3 = [ grey,  blue,  grey,   red];
    const arr4 = [  red,  grey,   red,  blue];
    const arr5 = [green, green, green, green]*/
    
    t.plan (2);
    t.equal (typeof fa, 'function',
            'utils.flattenArrays is a function and...');
    t.deepEqual (fa (arr1), new Uint8ClampedArray (
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    /* t.deepEqual (fa (arr1), [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
    t.deepEqual (fa (arr1), [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
    t.deepEqual (fa (arr1), [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
    t.deepEqual (fa (arr1), [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
    t.deepEqual (fa (arr1), [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]); */
    t.end();
    
});
