// Defines the width of the field, should be less than the width of the
// screen.
exports.SCREENWIDTH = 50;

// Defines the height of the field, should be less than the height of
// the screen.
exports.SCREENHEIGHT = 30;

// Set how big the canvas should be compared to the underlying data array.
exports.SCREENSCALE = 10;

// Defines the maximum number of entities allowed, should be less or
// equal to than (SCREENWIDTH * SCREENHEIGHT)
exports.MAXPLAYERS = 1000;

// Sets the initial number of the three basic entity types, should be
// less than or equal to MAXPLAYERS in total
exports.INITGRASS = 100;
exports.INITRABBITS = 50;
exports.INITFOXES = 50;

// Sets the maximum size of the gene.
exports.MAXGENESIZE = 80;

// Sets the maximum health for the various entitys.  The higher the
// value the longer they will "live".
exports.MAXGRASSHEALTH = 300;
// exports.MAXRABBITHEALTH = 400;
exports.INITGRASSHEALTH = 150;
// exports.INITRABBITHEALTH = 300;
exports.GRASSMATURITYLEVEL = 100;
// MAXFOXHEALTH = 400;
exports.GRASSSPAWNHEALTH = 100;

// Sets how much of a health bonus is taken when these entitys are eaten.
exports.GRASSNUTRITION = 20;
// RABBITNUTRITION = 300;

// Sets how many times various functions will try searching for a free
// space in ScreenArray before giving up.
exports.MAXTRIES = 5;

// Set how many iterations the while() loop will go through before
// exiting.
exports.TOTALRUNS = 1000;

// Sets how the entities will appear on the screen.
// exports.BLANKCHAR = '.';
// exports.GRASSCHAR = [false, true, false, false, true, false, false, true, false];
// exports.RABBITCHAR = 'r';
// exports.FOXCHAR = 'F';
exports.GRASSCOLOUR = [0, 255, 0, 255];
// exports.RABBITCOLOUR = [255, 0, 0, 255];


// The name for the output file.  If it exists, it will be overwritten.
// If not it will be created.
exports.OUTPUTFILENAME = './logs/miecos.output.txt';

exports.GRASSSPAWNDISTANCE = 50;
exports.GRASSSPAWNNUMBER = 3;
