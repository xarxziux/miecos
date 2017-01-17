// Defines the width of the field, should be less than the width of the
// screen.
export.SCREENWIDTH = 640;

// Defines the height of the field, should be less than the height of
// the screen.
export.SCREENHEIGHT = 480;

// Defines the maximum number of entities allowed, should be less or
// equal to than (SCREENWIDTH * SCREENHEIGHT)
export.MAXPLAYERS = 1000;

// Sets the initial number of the three basic entity types, should be
// less than or equal to MAXPLAYERS in total
export.INITGRASS = 300;
export.INITRABBITS = 50;
export.INITFOXES = 50;

// Sets the maximum size of the gene.
export.MAXGENESIZE = 80;

// Sets the maximum health for the various entitys.  The higher the
// value the longer they will "live".
export.MAXGRASSHEALTH = 300;
export.MAXRABBITHEALTH = 400;
export.INITGRASSHEALTH = 150;
export.INITRABBITHEALTH = 300;
// MAXFOXHEALTH = 400;

// Sets how much of a health bonus is taken when these entitys are eaten.
export.GRASSNUTRITION = 20;
// RABBITNUTRITION = 300;

// Sets how many times various functions will try searching for a free
// space in ScreenArray before giving up.
export.MAXTRIES = 200;

// Set how many iterations the while() loop will go through before
// exiting.
export.TOTALRUNS = 0;

//Sets how the entities will appear on the screen.
export.BLANKCHAR = '.';
export.GRASSCHAR = '|';
export.RABBITCHAR = 'r';
export.FOXCHAR = 'F';
export.GRASSCOLOUR = 'green';
export.RABBITCOLOUR = 'brown';


// The name for the output file.  If it exists, it will be overwritten.
// If not it will be created.
export.OUTPUTFILENAME = './miecos.output.txt';

