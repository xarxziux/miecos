const test = require ('tape');
// const entities = require ('../0_base/entities.js');
const utils = require ('../0_base/utils.js');
// console.log (JSON.stringify (utils));
// const utilsInt = utils.getInternal();


/*
test.skip ('Testing toroidal() function', function (t) {
// */ test ('Testing toroidal() function', function (t) {
    
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

/*
test.skip ('Testing getRowColToIndex() function', function (t) {
// */ test ('Testing getRowColToIndex() function', function (t) {
    
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

/*
test.skip ('Testing getIndexToRowCol() function', function (t) {
// */ test ('Testing getIndexToRowCol() function', function (t) {
    
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

/*
test.skip ('Test flattenArrays() function', function (t) {
// */ test ('Test flattenArrays() function', function (t) {
    
    const fa = utils.flattenArrays;
    const red = {colour: 1};
    const green = {colour: 2};
    const blue = {colour: 3};
    const grey = {colour: 4};
    const arr1 = [ null,  null,  null,  null];
    const arr2 = [ blue,  null,  blue,  null];
    const arr3 = [ null,  null,  null,   red];
    const arr4 = [ null,  grey,  null,  null];
    const arr5 = [green,  null,  null, green];
    
    console.log ('arr1', arr1, fa (arr1));
    
    t.plan (10);
    t.equal (typeof fa, 'function',
            'utils.flattenArrays is a function and...');
    t.deepEqual (fa (arr1), new Uint8ClampedArray (
            [0, 0, 0, 0]));
    t.deepEqual (fa (arr2),new Uint8ClampedArray (
            [3, 0, 3, 0]));
    t.deepEqual (fa (arr5, arr2), new Uint8ClampedArray (
            [2, 0, 3, 2]));
    t.deepEqual (fa (arr4, arr3, arr5), new Uint8ClampedArray (
            [2, 4, 0, 1]));
    t.deepEqual (fa (arr4, arr2, arr1, arr3, arr5), new Uint8ClampedArray (
            [3, 4, 3, 1]));
    t.deepEqual (fa (arr1, arr5, arr3, arr4, arr2), new Uint8ClampedArray (
            [2, 4, 3, 2]));
    t.deepEqual (fa (arr3, arr2, arr1, arr5, arr4), new Uint8ClampedArray (
            [3, 4, 3, 1]));
    t.deepEqual (fa (arr2, arr1, arr5, arr4, arr3), new Uint8ClampedArray (
            [3, 4, 3, 2]));
    t.deepEqual (fa (arr5, arr3, arr1, arr4, arr2), new Uint8ClampedArray (
            [2, 4, 3, 2]));
    t.end();
    
});



