export const config = {
    // Defines the width of the field, should be less than the width of the
    // screen.
    SCREENWIDTH: 640,
    
    // Defines the height of the field, should be less than the height of
    // the screen.
    SCREENHEIGHT: 480,
    
    // Defines the maximum number of entities allowed, should be less or
    // equal to than (SCREENWIDTH * SCREENHEIGHT)
    MAXPLAYERS: 1000,
    
    // Sets the initial number of the three basic entity types, should be
    // less than or equal to MAXPLAYERS in total
    INITGRASS: 300,
    INITRABBITS: 50,
    // INITFOXES: 50,
    
    // Sets the maximum size of the gene.
    MAXGENESIZE: 80,
    
    // Sets the maximum health for the various entitys.  The higher the
    // value the longer they will "live".
    MAXGRASSHEALTH: 300,
    MAXRABBITHEALTH: 400,
    // MAXFOXHEALTH: 400,
    
    // Sets how much of a health bonus is taken when these entitys are eaten.
    GRASSNUTRITION: 20,
    // RABBITNUTRITION: 300,
    
    // Sets how many times various functions will try searching for a free
    // space in ScreenArray before giving up.
    MAXTRIES: 200,
    
    // Set how many iterations the while() loop will go through before
    // exiting.
    TOTALRUNS: 0,
    
    //Sets how the entities will appear on the screen.
    BLANKCHAR: '.',
    GRASSCHAR: '|',
    RABBITCHAR: 'r',
    FOXCHAR: 'F',
    GRASSCOLOUR: 'green',
    RABBITCOLOUR: 'brown',
    
    
    // The name for the output file.  If it exists, it will be overwritten.
    // If not it will be created.
    OUTPUTFILENAME: './miecos.output.txt'
    
};