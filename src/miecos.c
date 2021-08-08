#include <stdio.h>
#include <string.h>
#include <ncurses.h>
#include <stdlib.h>
#include <time.h>

int SCREENWIDTH = 150;
int SCREENHEIGHT = 40;
int ARBLIMIT = 100;
int MAXGENESIZE = 80;
int MAXTRIES = 5;

char BLANKCHAR = '.';
char GRASSCHAR = '|';
char RABBITCHAR = 'r';
char FOXCHAR = 'F';

int MAXGRASSHEALTH = 20;
int MAXRABBITHEALTH = 40;
int MAXFOXHEALTH = 100;

int INITGRASS = 200;
int INITRABBITS = 50;
int INITFOXES = 0;

int Speed = 1;
int Mode = 2;

int TOTALRUNS = 0;
int MAXPLAYERS = 10000;
int GRASSNUTRITION = 10;
int RABBITNUTRITION = 60;

typedef enum {
  AllOK = 0,
  GeneralError,
  NoFreeSpaceError,
  OutOfRangeError,
  NoFreePointError,
  SlotNotFreeError,
  ForcedExitError,
  OutOfMemError,
  MallocError
} ReturnState;

struct ScreenPoint {
  int X;
  int Y;
};

typedef enum {
  False = 0,
  True
} Boolean;

typedef enum {
  clNone = 0,
  clPlant,
  clHerb,
  clCarn
} EntityClass;

typedef enum {
  idNone = 0,
  idGrass,
  idRabbit,
  idFox
} EntityName;

typedef enum {
  Stay = 0,
  Continue,
  MoveRight,
  MoveUpRight,
  MoveUp,
  MoveUpLeft,
  MoveLeft,
  MoveDownLeft,
  MoveDown,
  MoveDownRight
} Action;

struct Entity {
  EntityClass Class;
  EntityName Name;

  char Appearance;

  int X, Y;

  char *GString;

  int MaxHealth, Health, GenePointer;

  Boolean Visible;

  Action (*GetMove) (struct Entity **this);
  Action (*HandleObstacle) (struct Entity *this, struct Entity *that);
  ReturnState (*HideEntity) (struct Entity *this);
  ReturnState (*KillEntity) (struct Entity **this);
  ReturnState (*SpawnEntity) (void);
};

struct Entity **EntityArray; 
// Trust me, I know how it looks, but this next line is an absolute necessity!
struct Entity ****ScreenArray;


// Grass functions
Action GrowGrass (struct Entity **this);
// HandleObstacle = NULL
ReturnState CrushGrass (struct Entity *this);
ReturnState EatGrass (struct Entity **this);
ReturnState SpawnGrass (void);

// Rabbit functions
Action MoveRabbit (struct Entity **this);
Action BlockedRabbit (struct Entity *this, struct Entity *that);
ReturnState HideRabbit (struct Entity *this);
ReturnState KillRabbit (struct Entity **this);
ReturnState DoWhatRabbitsDoBest (void);

// Fox functions
Action MoveFox (struct Entity **this);
Action BlockedFox (struct Entity *this, struct Entity *that);
//ReturnState HideFox (struct Entity *this); // Shares this function with the rabbit.
//ReturnState KillFox (struct Entity **this); // Shares this function with the rabbit.
ReturnState TheFoxesAreAtItAgain (void);


// Additional Miecos-specific functions
ReturnState GetNewScreenPoint (struct ScreenPoint **NewPoint);
int SetGString (char **NewGString);

// Additional general functions
int Rand (int MaxNum);
//void LogMessage (char *Message);
//void LogStat (char *Message, int Stat);

/*
 * This was and will be used for testing/debugging purposes.  It is not used
 * in the release version but it seems simpler to comment all the lines out
 * rather than remove them outright and maintain a separate copy for upgrades
 */

FILE *OutputFile;

int main(int argc, char *argv[])
{
  printf("Here we go!");
  
  int i = 0, j = 0, Iterations = 0, StillAlive = 0;

  ReturnState ReturnedError = AllOK;
  struct timespec DELAY;

  // Before we do ANYTHING lets check the command line arguements

  for (i=1; i<argc; i++) {
    if (!(strcmp ("--help", argv[i]))) {
      printf ("Usage: miecos [--help | --version | OPTION]\n");
      printf ("Example: miecos --mode=ncurses --speed=fast --runlimit 500 --width 120 --height 40 --grass 200 --rabbits 100 --foxes 300 --maxplayers 3000 --genesize 100\n\n");
      printf ("  --help                show this message\n");
      printf ("  --version             show version number\n");
      printf ("  --mode=xxx            choose display mode, xxx can be 'ncurses' to use the ncurses library for\n");
      printf ("                        screen output, 'basic' for output using simple printf() statements\n");
      printf ("                        or 'noecho' for disabling all screen output (useful for when Miecos is\n");
      printf ("                        invoked from a script file)\n");
      printf ("                        the default is ncurses if no option or an invalid option is selected\n");
      printf ("  --speed=xxx           sets the size of the delay entered in the main loop, valid values for xxx\n");
      printf ("                        are 'instant', 'vfast', 'fast', 'medium', 'slow' or 'vslow'\n");
      printf ("                        the default is 'medium' unless the 'noecho' mode is set which case this\n");
      printf ("                        option is ignored and the speed is set to 'instant'\n");
      printf ("  --runlimit num        normally the program exits when all animals in the program die off however\n");
      printf ("                        this value can be used to limit the number of iterations of the main loop\n");
      printf ("                        the default is zero (not set)\n");
      printf ("  --width num           sets the width of the field\n");
      printf ("                        the default is %i, when the ncurses library is being used the\n", SCREENWIDTH);
      printf ("                        maximum value is set to COLS as defined by ncurses.h, if the 'noecho' or 'basic'\n");
      printf ("                        modes are being used then this value has an arbitrary limit of %i\n", ARBLIMIT);
      printf ("  --height num          sets the height of the field\n");
      printf ("                        the default is %i, when the ncurses library is being used the\n", SCREENHEIGHT);
      printf ("                        maximum value is set to LINES as defined by ncurses.h, if the 'noecho' or 'basic'\n");
      printf ("                        modes are being used then this value has an arbitrary limit of %i\n", ARBLIMIT);
      printf ("  --grass num           this defines the amount of grass that is present at the start of the current run\n");
      printf ("                        the default is %i\n", INITGRASS);
      printf ("  --rabbits num         this defines the number of rabbits that are present at the start of the current run\n");
      printf ("                        the default is %i\n", INITRABBITS);
      printf ("  --foxes num           this defines the number of foxes that are present at the start of the current run\n");
      printf ("                        the default is %i\n", INITRABBITS);
      printf ("  --maxplayers          this defines the maximum number of entities (grass + rabbits + foxes) that can\n");
      printf ("                        exist simultaneously\n");
      printf ("                        the default is (SCREENWIDTH * SCREENHEIGHT)\n");
      printf ("  --genesize            this defines the maximum size of the entitys genestring\n");
      printf ("                        the default is %i\n\n", MAXGENESIZE);

      printf ("Miecos is copyright (C) 2005, 2015 Alan Delaney and licensed\n");
      printf ("under the GNU General Public License, version 2.\n\n");
      printf ("Report bugs or send praise to https://github.com/xarxziux/miecos\n\n");

      return 0;
    }
  }

  for (i=1; i<argc; i++) {
    if (!(strcmp ("--version", argv[i]))) {
      printf ("Miecos 0.0.1 (pre-release)\n");
      printf ("Copyright (C) 2005 Alan Delaney.\n");
      printf ("Miecos comes with ABSOLUTELY NO WARRANTY.\n");
      printf ("You may redistribute copies of Miecos under the\n");
      printf ("terms of the GNU General Public License, version 2.\n");

      return 0;
    }
  }

  /*
   * The "--mode=" arguement determines how the output will be presented.  Currently there
   * are three modes: 
   * ncurses - use the ncurses library, this is the default.
   * basic - this uses simple printf() statements to provide the output, useful perhaps for debugging purposes
   * noecho - does not print anything to the screen, designed to be used as a background program run
   *   from within a shell script, for example.
   */
  i=1;
  while (i<argc) {
    if (!(strncmp ("--mode=", argv[i], 7))) {
      if (!(strcmp ("--mode=ncurses", argv[i]))) {
	Mode = 2;
      }
      else if (!(strcmp ("--mode=basic", argv[i]))) {
	Mode = 1;
      }
      else if (!(strcmp ("--mode=noecho", argv[i]))) {
	Mode = 0;
      }
      i = argc; // If a "--mode" arguement was found then exit this loop, even if the arguement was invalid.
    }
    i++;
  }

/*
 * The "-speed" arguement sets the amount of delay between the iterations of the while() loop.  There are 
 * currently six settings: vslow, slow, medium, fast, vfast, instant.  The last sets NO time limit and is
 * automatically selected if the mode is noecho.  On invalid values the default is medium.
 */
  if (Mode) {
    i=1;
    while (i<argc) {
      if (!(strncmp ("--speed=", argv[i], 8))) {
        if (!(strcmp ("--speed=instant", argv[i]))) {
	  Speed = 0;
        }
        else if (!(strcmp ("--speed=vfast", argv[i]))) {
          Speed = 1;
        }
        else if (!(strcmp ("--speed=fast", argv[i]))) {
	  Speed = 2;
        }
        else if (!(strcmp ("--speed=medium", argv[i]))) {
	  Speed = 3;
        }
        else if (!(strcmp ("--speed=slow", argv[i]))) {
	  Speed = 4;
        }
        else if (!(strcmp ("--speed=vslow", argv[i]))) {
	  Speed = 5;
        }
	i = argc;
      }
      i++;
    }
  }
  else {
    Speed = 0;
  }

  switch (Speed) {
  case 0:

    DELAY.tv_sec = 0;
    DELAY.tv_nsec = 0;
    break;

  case 1:
    DELAY.tv_sec = 0;
    DELAY.tv_nsec = 25000000;
    break;

  case 2:
    DELAY.tv_sec = 0;
    DELAY.tv_nsec = 100000000;
    break;

  case 3:
    DELAY.tv_sec = 0;
    DELAY.tv_nsec = 500000000;
    break;

  case 4:
    DELAY.tv_sec = 1;
    DELAY.tv_nsec = 0;
    break;

  case 5:
    DELAY.tv_sec = 3;
    DELAY.tv_nsec = 0;
    break;

  default:
    break;

  } // switch (Speed) {



  /* 
   * The program normally ends when all of the rabbits and foxes have died off.  The "--runlimit" arguement 
   * allows for the program to exit after a set number of iterations are run.  The default is zero, i.e. no limit.
   */
  i=1;
  while (i<argc) {
    if (!(strncmp ("--runlimit", argv[i], 10))) {
      if ((i + 1) < argc) {
        TOTALRUNS = atoi (argv[i+1]);
      }
    }
    i++;
  }

  /*
   * This we need to have here so that the value of LINES and COLS in ncurses.h will be set.  Then we can use
   * these values to provide error-checking for the command-line arguements of SCREENHEIGHT and SCREENWIDTH.
   */
  if (Mode == 2) {
    initscr();
  }

  /*
   * We now search the command-line arguements for values for SCREENWIDTH and SCREENHEIGHT.  If we are using
   * the Ncurses library for output then we will check the values against LINES and COLS as defined by Ncurses,
   * otherwise we don't bother and *hope* the user enters sensible values.
   */
  i=1;
  while (i<argc) {
    if (!(strncmp ("--width", argv[i], 7))) {
      if ((i + 1) < argc) {
        int Temp = atoi (argv[i+1]);
	if (Temp <= 0) {
	  if (Mode == 1) {
	    printf ("Invalid negative argument for SCREENWIDTH.\n");
	  }
	  endwin();
	  return -1;
	}
        else {
          if (Mode == 2) {
	    if (Temp > COLS) {
	      endwin();
	      printf ("Invalid argument for SCREENWIDTH (range = 1 to %i).\n", COLS);
	      return -1;
	    }
	  }
	  else if (Temp > ARBLIMIT) {
	    printf ("Invalid argument for SCREENWIDTH (range = 1 to %i).\n", ARBLIMIT);
	    return -1;
	  }
	  SCREENWIDTH = Temp;
	  i = argc;
        }
      }
    }
    i++;
  }

  i=1;
  while (i<argc) {
    if (!(strncmp ("--height", argv[i], 8))) {
      if ((i + 1) < argc) {
        int Temp = atoi (argv[i+1]);
	if (Temp <= 0) {
	  if (Mode == 1) {
	    printf ("Invalid negative argument for SCREENHEIGHT.\n");
	  }
	  endwin();
	  return -1;
	}
        else {
          if (Mode == 2) {
	    if (Temp > LINES) {
	      endwin();
	      printf ("Invalid argument for SCREENHEIGHT (range = 1 to %i).\n", LINES);
	      return -1;
  	    }
          }
	  else if (Temp > ARBLIMIT) {
	    printf ("Invalid argument for SCREENHEIGHT (range = 1 to %i).\n", ARBLIMIT);
	    return -1;
	  }
	  SCREENHEIGHT = Temp;
	  i = argc;
        }
      }
    }
    i++;
  }

  MAXPLAYERS = (SCREENWIDTH * SCREENHEIGHT);

  /*
   * These three arguements allow the user to alter the basic starting line-up.  If no arguements are found then 
   * the default values are used.  If arguements are used but are out-of-range then the program will display an
   * error-message and exit.
   */
  i=1;
  while (i<argc) {
    if (!(strncmp ("--grass", argv[i], 7))) {
      if ((i + 1) < argc) {
        int Temp = atoi (argv[i+1]);
        if ((Temp < 0) || (Temp >= MAXPLAYERS)) {
	  if (Mode == 2) {
	    endwin();
	  }
	  if (Mode) {
	    printf ("Invalid argument for INITGRASS (range 0 to %i).\n", MAXPLAYERS);
	  }
	  return -1;
        }
        else {
	  INITGRASS = Temp;
	  i = argc;
	}
      }
    }
    i++;
  }

  i=1;
  while (i<argc) {
    if (!(strncmp ("--rabbits", argv[i], 9))) {
      if ((i + 1) < argc) {
        int Temp = atoi (argv[i+1]);
        if ((Temp <= 0) || (Temp >= MAXPLAYERS)) {
	  if (Mode == 2) {
	    endwin();
	  }
	  if (Mode) {
	    printf ("Invalid argument for INITRABBITS (range 1 to %i).\n", MAXPLAYERS);
          }
	  return -1;
        }
        else {
	  INITRABBITS = Temp;
	  i = argc;
        }
      }
    }
    i++;
  }

  i=1;
  while (i<argc) {
    if (!(strncmp ("--foxes", argv[i], 7))) {
      if ((i + 1) < argc) {
        int Temp = atoi (argv[i+1]);
        if ((Temp <= 0) || (Temp >= MAXPLAYERS)) {
	  if (Mode == 2) {
	    endwin();
	  }
	  if (Mode) {
	    printf ("Invalid argument for INITFOXES (range 1 to %i).\n", MAXPLAYERS);
	  }
	  return -1;
        }
        else {
	  INITFOXES = Temp;
	  i = argc;
	}
      }
    }
    i++;
  }

  /*
   * Having now gotten the width and height of the screen we now search for and set the value of MAXPLAYERS
   * which is dependent upon those values for error-checking purposes.
   */
  i=1;
  while (i<argc) {
    if (!(strncmp ("--maxplayers", argv[i], 12))) {
      if ((i + 1) < argc) {
        int Temp = atoi (argv[i+1]);
        if ((Temp <= 0) || (Temp >= (SCREENWIDTH * SCREENHEIGHT))) {
	  if (Mode == 2) {
	    endwin();
	  }
	  if (Mode) {
	    printf ("Invalid argument for MAXPLAYERS (range 1 to %i).\n", (SCREENWIDTH*SCREENHEIGHT));
	  }
	  return -1;
        }
        else {
	  MAXPLAYERS = Temp;
	  i = argc;
	}
      }
    }
    i++;
  }

  printf("Still going");
  
  if ((INITGRASS + INITRABBITS + INITFOXES) > MAXPLAYERS) {
    if (Mode == 2) {
      endwin();
    }
    if (Mode) {
      printf ("Initial values are set too high.\n");
      printf ("Please ensure the values entered\n");
      printf ("total less then %i.\n", MAXPLAYERS);
      printf ("Note: if you have only entered values\n");
      printf ("for the height and height of the screen\n");
      printf ("please ensure you also alter the values\n");
      printf ("of the initial grass, rabbits and foxes\n");
      printf ("if the default values are too large to\n");
      printf ("fit on the screen you have defined.\n");
    }
    return -1;
  } 

  i=1;
  while (i<argc) {
    if (!(strncmp ("--genesize", argv[i], 10))) {
      if ((i + 1) < argc) {
        MAXGENESIZE = atoi (argv[i+1]);
      }
      if ((MAXGENESIZE <= 0) || (MAXGENESIZE > 1000)) {
	if (Mode == 2) {
	  endwin();
	}
	if (Mode) {
	  printf ("Invalid entry for MAXGENESIZE (range 1 to 1000).\n");
	}
	return -1;
      }
    }
    i++;
  }





  srand (time (0));

  // Initialise the two arrays
  ScreenArray = (struct Entity ****) malloc ((sizeof (struct Entity ***)) * SCREENWIDTH);
  EntityArray = (struct Entity **) malloc ((sizeof (struct Entity *)) * MAXPLAYERS);  

  /*
   * You would not believe how many hours it took me to figure out
   * that the next few lines of code are an absolute necessity.
   * Without NULLing all of the elements of the array, the program
   * is prone to random and bugger-to-find Segmentation errors.
   * Trust me, I've wasted a large part of my life to discover this!
   */
  for (i=0; i<SCREENWIDTH; i++) {
    ScreenArray[i] = (struct Entity ***) malloc ((sizeof (struct Entity **)) * SCREENHEIGHT);

    for (j=0; j<SCREENHEIGHT; j++) {
      ScreenArray[i][j] = NULL;
    }
  }

  for (i=0; i<MAXPLAYERS; i++) {
    EntityArray[i] = NULL;
  }

/*
  // Initialise the output file and put some intro text into it.
  if ((OutputFile = fopen (OUTPUTFILENAME, "w")) != NULL) {
    fprintf (OutputFile, "output.txt - Miecos run-time error-message and debug data file.\n");
    fprintf (OutputFile, "===============================================================\n");
    fprintf (OutputFile, "\nFile ready to recieve data.\n\n\n");
  }
  else {
    printf ("Error opening file.");
  }
  
  fclose (OutputFile);
*/

  //Initialise the grass
  for (i=0; i< INITGRASS; i++) {
    ReturnedError = SpawnGrass();
    
    if (ReturnedError) {
      //LogMessage ("Error in SpawnGrass() call from INITGRASS loop.");
    } // if (ReturnedError)
  } // for (i=0; i< INITGRASS; i++)     
  
  //Initialise the rabbits
  for (i=0; i< INITRABBITS; i++)
  {
    ReturnedError = DoWhatRabbitsDoBest();
    
    if (ReturnedError) {
      //LogMessage ("Error in DoWhatRabbitsDoBest() call from INITRABBITS loop.");
    } // if (FunctionChecker != AllOK)
  } // for (i=0; i< INITRABBITS; i++)     
  
  //Initialise the foxes
  for (i=0; i< INITFOXES; i++) {
    ReturnedError = TheFoxesAreAtItAgain();
    
    if (ReturnedError) {
      //LogMessage ("Error in TheFoxesAreAtItAgain() call from INITFOXES loop.");
    } // if (FunctionChecker != AllOK)
  } // for (i=0; i< INITFOXES; i++)     
  

  printf("Drawing screen");
  
  if (Mode == 2) {
    // Now we put it all on the screen ...    
    for (j=0; j<SCREENHEIGHT; j++) {
      for (i=0; i<SCREENWIDTH; i++) {
        if (ScreenArray[i][j] == NULL) {
          mvaddch (j, i, BLANKCHAR);
        }
        else {
        mvaddch (j, i, ScreenArray[i][j][0]->Appearance);      
        } // if (ScreenArray[NewIndex] == NULL)
      } // for (i=0; i<SCREENWIDTH; i++)
    } // for (j=0; j<SCREENHEIGHT; j++)   
  
    //for (i=0; i<100; i++) {
    //  mvaddch (43, (i+1), '.');
    //}

    // ... and draw it.
    refresh();
    getch();
  }

  else if (Mode == 1) {  
    for (j=0; j<SCREENHEIGHT; j++) {
      for (i=0; i<SCREENWIDTH; i++) {
        if (ScreenArray[i][j]) {
	  printf ("%c", ScreenArray[i][j][0]->Appearance);
        }
        else {
	  printf (".");
        }
      }
      printf ("\n");
    }
    printf ("\nCompleted iteration 0.\n");
    getchar();
  }

  StillAlive = 1;

  //while (Iterations < TOTALRUNS) {
  while ((!TOTALRUNS || (Iterations < TOTALRUNS)) && StillAlive) {
    for (i=0; i<MAXPLAYERS; i++) {
      if (EntityArray[i]) {

	Action NextMove = Stay, RevisedMove = Stay;
        int dX = 0, dY = 0, OldX = 0, OldY = 0, NewX = 0, NewY = 0;

	OldX = EntityArray[i]->X;
	OldY = EntityArray[i]->Y;
        //ReturnState RecieptValue = AllOK;
        
        /*
         * OK, so we have a live entity here (hopefully) so the first thing
         * we need to do is ask it what it wants to do.  
         */
        //LogStat ("Calling EntityArray[]->GetMove for i = ", i);
            
        NextMove = EntityArray[i]->GetMove (&EntityArray[i]);
        
        //LogStat ("NextMove = ", NextMove);
            
        // Now we act upon that request.
        switch (NextMove) {
          /*
           * If the function returns Stay, Die or Hide, the handling for this
           * will be taken care of by the function so this loop need not worry
           * about it.  The same may well be true for Spawn but needs to be
           * coded in and tested yet.  Eat and Continue only appear when 
           * HandleObstacle is called but are included anyway for completeness
           * and possible debugging purposes.  All other possible, legal return
           * values are movements which will be handled separately in their own 
           * nested switch statement.
           */
          case Stay:
          break;
          
          case Continue:
            //LogMessage ("NextMove returned illegal value Continue.");
          break;
          
          default:
            /*
             * In theory, if the switch reaches the default then the return value
             * was a movement order.  Therefore we now need to work out how to
             * handle such an order.  The first step is to convert the enum into
             * a pair of ints, dX and dY, which can hold only the values of -1, 0
             * and 1 which dictate the relative change of the entity. Using that
             * we then calculate the absolute value of the entitys' new position.
             * Next we see if the space it wants to move to is free and, if so,
             * permit it to do so.  If not we get the data on the obstacle and pass
             * that to the HandleObstacle() method for further instructions.
             */
	    //LogStat ("GetMove returned ", NextMove);

	    switch (NextMove) {
              case MoveRight:
                dX = 1;
                dY = 0;
              break;

              case MoveUpRight:
                dX = 1;
                dY = -1;
              break;

     	      case MoveUp:
      		dX = 0;
    		dY = -1;
    	      break;

     	      case MoveUpLeft:
      		dX = -1;
    		dY = -1;
    	      break;

     	      case MoveLeft:
      		dX = -1;
    		dY = 0;
    	      break;

     	      case MoveDownLeft:
      		dX = -1;
    		dY = 1;
    	      break;

     	      case MoveDown:
      		dX = 0;
    		dY = 1;
    	      break;

     	      case MoveDownRight:
      		dX = 1;
    		dY = 1;
    	      break;
					   
    	      default:
      		dX = 0;
    		dY = 0;
    	      break;	
	    } // switch (NextAction) -- movement-specific switch
            
            /*
             * Note to self: we have left the nested switch but are still in
             * the default clause of the original switch.
             */

	    //Translate from relative to absolute figures.
	    NewX = OldX + dX;
	    NewY = OldY + dY;
            
            /*
             * These four lines check if the movement will take it off the
             * boundary and wrap it round in a toroidal system to the other
             * side of the screen if such is the case.
             */
	    if (NewX < 0) NewX = (SCREENWIDTH-1);
	    if (NewY < 0) NewY = (SCREENHEIGHT-1);

	    if (NewX >= SCREENWIDTH ) NewX = 0;
	    if (NewY >= SCREENHEIGHT ) NewY = 0;
						
//            if ((OutputFile = fopen ("./output.txt", "a")) != NULL)
//            {
//              fprintf (OutputFile, "(dX, dY) = (%i,%i).\n\n", dX, dY);
//              fprintf (OutputFile, "(NewX, NewY) = (%i,%i).\n\n", NewX, NewY);
//              fclose (OutputFile);
//            }
            
            // If the point is free then move there.
	    if (ScreenArray[NewX][NewY] == NULL) {
	      //LogStat ("Moving EntityArray[i].", i);
	      EntityArray[i]->X = NewX;
	      EntityArray[i]->Y = NewY;
	      ScreenArray[NewX][NewY] = &(EntityArray[i]);
	      ScreenArray[OldX][OldY] = NULL;
	    }
            else
            {
              //LogStat ("Calling EntityArray[i]->HandleObstacle() for i = ", i);
              //LogStat ("EntityArray[i]->Name = ", EntityArray[i]->Name);
            
              RevisedMove = EntityArray[i]->HandleObstacle (EntityArray[i], ScreenArray[NewX][NewY][0]);
              
              //LogStat ("EntityArray[i]->HandleObstacle() returned ", RevisedMove);
            
              /*
               * RevisedMove will be either Continue or Stay, no other possibilities
               * exist in the current design.  As Stay simply means to do nothing
               * we then only need to handle the return value of Continue.  All actions
               * associated with eating whatever was there before have (fingers 
               * crossed) already been taken care of.  Innit beautiful!
               */
              if (RevisedMove == Continue)
              {
		EntityArray[i]->X = NewX;
		EntityArray[i]->Y = NewY;
                ScreenArray[NewX][NewY] = &(EntityArray[i]);
                ScreenArray[OldX][OldY] = NULL;
              }  
            } // if (ScreenArray[NewX][NewY] == NULL)   
        } // switch (NextMove) -- from GetMove()
      }
    }

    if (Mode == 2) {
      // Now we put it all on the screen ...    
      for (j=0; j<SCREENHEIGHT; j++) {
        for (i=0; i<SCREENWIDTH; i++) {
          if (ScreenArray[i][j] == NULL) {
             mvaddch (j, i, BLANKCHAR);
          }
          else {
            mvaddch (j, i, ScreenArray[i][j][0]->Appearance);      
          } // if (ScreenArray[NewIndex] == NULL)
        } // for (i=0; i<SCREENWIDTH; i++)
      } // for (j=0; j<SCREENHEIGHT; j++)   
  
      //for (i=0; i<100; i++) {
      //  mvaddch (43, (i+1), BLANKCHAR);
      //}

      // ... and draw it.
      refresh();
      //getch();

    }

    else if (Mode == 1) {
      for (j=0; j<SCREENHEIGHT; j++) {
        for (i=0; i<SCREENWIDTH; i++) {
          if (ScreenArray[i][j]) {
	    printf ("%c", ScreenArray[i][j][0]->Appearance);
          }
          else {
	    printf (".");
          }
        }
        printf ("\n");
      }

      printf ("\nCompleted iteration %i.\n", (Iterations + 1));
      //getchar();
    }

    StillAlive = 0;
    for (i=0; i<MAXPLAYERS; i++) {
      if (EntityArray[i]) {
        if (EntityArray[i]->Class >= 2)
	  StillAlive = 1;
      }
    }

    if (Speed) {
      nanosleep (&DELAY, NULL);
    }

    Iterations++;
    //getch();
  } // while ((!TotalRuns || (Iterations < TotalRuns)) && StillAlive) {
  
  /*
   * This section may be technically unnecessary as it cleans up all of the arrays of pointers
   * that were used in the program and, as the program is about to end soon anyway, it will
   * probably be done by the OS automatically but, hey, I'm a perfectionist.  Besides, it keeps
   * Valgrind happy and if Valgrind's happy them I'm happy!
   */
  for (i=0; i<SCREENWIDTH; i++) {
    for (j=0; j<SCREENHEIGHT; j++) {
      if (ScreenArray[i][j]) {
      free (ScreenArray[i][j][0]->GString);   
      ScreenArray[i][j][0]->GString = NULL;   

      free (ScreenArray[i][j][0]);
      ScreenArray[i][j][0] = NULL;
      }
      /*
       * The program runs fine, no crashes, no memory leaks (per Valgrind) with the following
       * line commented out. With it included I get "*** glibc detected ***" errors.  Why this
       * is I haven't figured out yet therefore I'm leaving the line in until I get my head
       * around this problem!
       */
      //free (ScreenArray[i][j]);
      ScreenArray[i][j] = NULL;
    }
    free (ScreenArray[i]);
    ScreenArray[i] = NULL;
  }

  free (ScreenArray);
  ScreenArray = NULL;

  for (i=0; i<MAXPLAYERS; i++) {
    free (EntityArray[i]);
    EntityArray[i] = NULL;
  }

  free (EntityArray);
  EntityArray = NULL;

  if (Mode == 2) {
    endwin();
  }

  if (Mode) {
    printf ("Normal end reached!\n");
    printf ("%i iterations performed.\n", Iterations);
  }

  return Iterations;
} // int main()

// Grass functions
Action GrowGrass (struct Entity **this)
{
  Action ReturnValue = Stay;

  //LogMessage ("Function GrowGrass() answering.");
  
  (*this)->Health++;
  
  if ((*this)->Visible == False)
  {
    if ((*this)->Health >= ((*this)->MaxHealth)/2)
    {
      if (ScreenArray[(*this)->X][(*this)->Y] == NULL)
      {
      (*this)->Visible = True;
      ScreenArray[(*this)->X][(*this)->Y] = this;
      }
    }  
  }
  
  if ((*this)->Health >= (*this)->MaxHealth)
  {
    (*this)->Health = ((*this)->Health)/2; 
    (*this)->SpawnEntity();
  }
  
  //LogMessage ("Function GrowGrass() returning.");
  
  return ReturnValue;
} // Action GrowGrass (struct Entity ***this) 

ReturnState CrushGrass (struct Entity *this)
{
  //LogMessage ("Function CrushGrass() answering.");

  ReturnState ReturnValue = AllOK;

  this->Health = (this->MaxHealth)/4;
  this->Visible = False;

  ScreenArray[this->X][this->Y] = NULL;

  //LogMessage ("Function CrushGrass() returning.");
  
  return ReturnValue;
} // ReturnState CrushGrass (struct Entity *this)

ReturnState EatGrass (struct Entity **this)
{
  //LogMessage ("Function EatGrass() answering.");

  ReturnState ReturnValue = AllOK;
  int X = (*this)->X, Y = (*this)->Y;

  free (ScreenArray[X][Y][0]);   
  ScreenArray[X][Y][0] = NULL;   

  ScreenArray[X][Y] = NULL;   
  
  return ReturnValue;
} // ReturnState EatGrass (struct Entity **this)

ReturnState SpawnGrass (void)
{
  //LogMessage ("Function SpawnGrass() answering.");
  /*
   * My usual convention is to set ReturnValue to AllOK by default
   * but here I take the "guilty until proven innocent" approach
   * by making the function find a free space before it is allowed
   * to set ReturnValue to AllOK
   */
  ReturnState ReturnedError = AllOK;             // What the function gets back ...
  ReturnState ReturnValue = NoFreeSpaceError;   // ... and what it gives back.
              
  int i = 0, FreeSlot = 0;

  struct ScreenPoint *NewScreenPoint = NULL;

  //LogMessage ("Function SpawnGrass() looking for a free space.");
 
  // First we find somewhere to put it ...
  while ((i < MAXPLAYERS) && (ReturnValue == NoFreeSpaceError)) {
    if (!(EntityArray[i])) {
      // We got one!
      //LogStat ("Function SpawnGrass() found one for i = ", i);
      EntityArray[i] = (struct Entity *) malloc (sizeof (struct Entity));
      //LogMessage ("SpawnGrass() called malloc().");

      if (!(EntityArray[i])) {
        // Or have we?
        ReturnValue = MallocError;
      }  
      else {
        FreeSlot = i;
        ReturnValue = AllOK;
      } // if (EntityArray[i] == NULL) -- from malloc()
    } // if (EntityArray[i] == NULL) -- initial test  

    i++;
  } // while ((i<MAXPLAYERS) && (ReturnState == NoFreeSpaceError)) 
        
  // If we've got one then use it.
  if (!(ReturnValue)) {
    // ... then we find somewhere to display it.
    //LogMessage ("Function SpawnGrass() calling GetNewScreenPoint().");

    ReturnedError = GetNewScreenPoint (&NewScreenPoint);
    
    if (ReturnedError) {
      // If some thing went wrong null the pointer and return the error code.
      //LogStat ("Function SpawnGrass() recieved an error from GetNewScreenPoint(), code = ", RecieptValue);
      free (NewScreenPoint);
      NewScreenPoint = NULL;
      free (EntityArray[FreeSlot]);
      EntityArray[FreeSlot] = NULL;
      ReturnValue = ReturnedError;
    }
    else {
      // In order to get here all function calls **must** have worked
      // so no Segmentation faults :)
      
      // First the basic settings
      EntityArray[FreeSlot]->Class = clPlant;
      EntityArray[FreeSlot]->Name = idGrass;
      EntityArray[FreeSlot]->Appearance = GRASSCHAR;
      EntityArray[FreeSlot]->X = NewScreenPoint->X;
      EntityArray[FreeSlot]->Y = NewScreenPoint->Y;
      EntityArray[FreeSlot]->GString = '\0';
      EntityArray[FreeSlot]->MaxHealth = MAXGRASSHEALTH;
      EntityArray[FreeSlot]->Health = (MAXGRASSHEALTH)/2;
      EntityArray[FreeSlot]->GenePointer = 0;
      EntityArray[FreeSlot]->Visible = True;  
      
      // Now the function pointers
      EntityArray[FreeSlot]->GetMove = GrowGrass;
      EntityArray[FreeSlot]->HandleObstacle = NULL;
      EntityArray[FreeSlot]->HideEntity = CrushGrass;
      EntityArray[FreeSlot]->KillEntity = EatGrass;
      EntityArray[FreeSlot]->SpawnEntity = SpawnGrass;

      //Now we need to put it on the ScreenArray
      //Index = (EntityArray[FreeSlot]->X + (EntityArray[FreeSlot]->Y * SCREENWIDTH));
      ScreenArray[EntityArray[FreeSlot]->X][EntityArray[FreeSlot]->Y] = &(EntityArray[FreeSlot]);

//      if ((OutputFile = fopen ("./output.txt", "a")) != NULL)
//      {
//        fprintf (OutputFile, "Index = %i.\n\n", Index);
//        fprintf (OutputFile, "FreeSlot = %i.\n\n", FreeSlot);
//        fprintf (OutputFile, "EntityArray[%i] (X, Y) = (%i, %i).\n\n", FreeSlot, EntityArray[FreeSlot]->X, 
//         EntityArray[FreeSlot]->Y);
//        fprintf (OutputFile, "ScreenArray[%i] (X, Y) = (%i, %i).\n\n", Index, ScreenArray[Index]->X, 
//         ScreenArray[Index]->Y);
//        fclose (OutputFile);
//      }
    } // if (RecieptValue != AllOK) -- from GetNewScreenPoint()
  } // if (RecieptValue != AllOK) -- from GetNewEntitySpace()
  //LogMessage ("Function SpawnGrass() returning.");
  
  free (NewScreenPoint);
  NewScreenPoint = NULL;
  
  return ReturnValue;
} // ReturnState SpawnGrass (void)
    
// Rabbit functions
Action MoveRabbit (struct Entity **this)
{
  //LogStat ("Function MoveRabbit() answering, health = ", (*this)->Health);

  Action ReturnValue = Stay;
  ReturnState ReturnedError = AllOK;

  (*this)->Health--;
  
  // If it was hiding then unhide it.
  (*this)->Visible = True;
	
  if ((*this)->Health >= (*this)->MaxHealth) {
    (*this)->Health = ((*this)->MaxHealth)/2;
    //LogMessage ("Function MoveRabbit() calling (*this)->SpawnEntity().");
    ReturnedError = (*this)->SpawnEntity();

    //LogStat ("Function MoveRabbit() called (*this)->SpawnEntity(), RecieptValue = ", RecieptValue);

    ReturnValue = Stay;
  }
  else if ((*this)->Health <= 0) {
    //LogMessage ("Function MoveRabbit() calling (*this)->KillEntity().");

    ReturnedError = (*this)->KillEntity (this);
    //LogStat ("Function MoveRabbit() called (*this)->KillEntity(), RecieptValue = ", RecieptValue);

    ReturnValue = Stay;
  }
      
  else if (!((*this)->GString)) {
    //LogMessage ("(*this)->GString == NULL.");
    ReturnValue = Stay;
  }
	
  /*
   * If the flow reaches here them everything should be OK
   * to move the rabbit.  Any conditions that would prevent 
   * the rabbit from moving should be handled before this
   * point.
   */
  else {
    //fprintf (OutputFile, "\n");
    //LogMessage ("Function MoveRabbit() choosing next move.");

    // WARNING -- no error-checking of GenePointer value
    if (((*this)->GString[(*this)->GenePointer] == 'O') &&
        ((*this)->GString[(*this)->GenePointer + 1] == 'O') &&
	((*this)->GString[(*this)->GenePointer + 2] == 'O')) {
      ReturnValue = MoveRight;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'O')) {
      ReturnValue = MoveUpRight;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'O')&&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'O')) {
      ReturnValue = MoveUp;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'O')) {
      ReturnValue = MoveUpLeft;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'I')) {
      ReturnValue = MoveLeft;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'I')) {
      ReturnValue = MoveDownLeft;
    }
		
    else if (((*this)->GString[(*this)->GenePointer] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'I')) {
      ReturnValue = MoveDown;
    }
		
    else if (((*this)->GString[(*this)->GenePointer] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'I')) {
      ReturnValue = MoveDownRight;
    }

    else {		
      /* 
       * If this runs there is problem with the GString so
       * some extra coding is needed here to investigate and
       * report the problem.  For now lets just ignore it and
       * carry on gracefully.
       */
      ReturnValue = Stay;
    }
		
    //LogStat ("Function MoveRabbit() chose next move = ", ReturnValue);
    
    (*this)->GenePointer += 3;

    if ((*this)->GenePointer >= strlen ((*this)->GString)) {
      (*this)->GenePointer = 0;
    }  
  } // if ((*this)->GString == 0)

  //LogMessage ("Function MoveRabbit() returning.");
  return ReturnValue;
}

Action BlockedRabbit (struct Entity *this, struct Entity *that)
{
  //LogMessage ("Function BlockedRabbit() answering.");
  /*
   * In this very key function we define what the animal actually eats.
   * What happens is that when the controller gets a movement order from
   * the animal and tries to move in that direction but finds its way
   * blocked, it will then call this function, passing a pointer to
   * obstacle, to ask the animal how to handle it.  If the animal
   * eats that obstacle or performs any other type of action with that
   * obstacle then there will be an entry within the switch() statement
   * in this function.  If there is no entry in the switch() statement
   * then the function defaults to Action Stay meaning that the blockage
   * is unresolveable.
   */
  Action ReturnValue = Stay;
  ReturnState ReturnedError = AllOK;
  
  //LogStat ("BlockedRabbit() ready to run switch statement on Name = ", that->Name);
  
  switch (that->Name) {
    case idGrass:
      //LogMessage ("BlockedRabbit() found some grass, calling that->KillEntity().");
            
      ReturnedError = that->KillEntity (&that);
      
      //LogMessage ("BlockedRabbit() called that->KillEntity().");
            
      if (!ReturnedError) {
        // Yum!
        this->Health += GRASSNUTRITION;
      }
    break;
    
    default:
      //LogMessage ("BlockedRabbit() hit an unknown obstacle.");
            
    break; // Prevents compiler warning messages!
  } // switch (that->EntityName)    

  //LogMessage ("BlockedRabbit() returning.");
            
  return ReturnValue;
}

ReturnState HideRabbit (struct Entity *this)
{
  //LogMessage ("HideRabbit() answering.");
  /*
   * This function is used for situations where the rabbit is in hiding
   * (underground!) and therefore does not appear on the screen.  There
   * is no implementation of the function at present but it's here
   * because it **will** be useful and beacuse it helps to keep the code
   * consistent with the GRAND DESIGN (TM).
   */
  ReturnState ReturnValue = AllOK;
    
  this->Visible = False; 
  
  // Short and sweet.
  //LogMessage ("HideRabbit() returning.");
  return ReturnValue;
}
   
ReturnState KillRabbit (struct Entity **this)
{
  //LogMessage ("KillRabbit() answering.");
  /* This function does exactly what it says on the tin!  The parameter
   * (struct Entity **this) is necessary because this function needs to
   * free() the memory and NULL it.  Using (struct Entity *this) does
   * not allow for this to be done.
   */
  ReturnState ReturnValue = AllOK;
  int X = (*this)->X, Y = (*this)->Y;
  
  free (ScreenArray[X][Y][0]->GString);   
  ScreenArray[X][Y][0]->GString = NULL;   

  free (ScreenArray[X][Y][0]);   
  ScreenArray[X][Y][0] = NULL;   

  ScreenArray[X][Y] = NULL;   

  //LogMessage ("KillRabbit() returning.\n\n");
  return ReturnValue;
}

ReturnState DoWhatRabbitsDoBest (void)
{
  //LogMessage ("DoWhatRabbitsDoBest() answering.");
  /*
   * My usual convention is to set ReturnValue to AllOK by default
   * but here I take the "guilty until proven innocent" approach
   * by making the function find a free space before it is allowed
   * to set ReturnValue to AllOK
   */

  /*
   * 10-05-05 Re-design notification
   * Currently this function has the inefficiency of calling malloc()
   * for the struct before we know that all of the functions calls necessary 
   * to get it running are working first
   */
  /* 
   * The flow of this function goes something like this:
   * Check for a free space in EntityArray
   * if there is...
   *     set up the temp values (chromosomes and screen position)
   *     if not successful...
   *         report and exit
   *     else...
   *         malloc() the struct
   *         if not successful...
   *             report and exit
   *         else...
   *             init the GString
   *             if it didn't work
   *                 free() and exit
   *             else
   *                 set up the attributes and methods
   *             end if
   *         end if
   *     end if
   * end if
   * return
   */
   

  ReturnState ReturnedError = AllOK;             // What the function gets back ...
  ReturnState ReturnValue = NoFreeSpaceError;   // ... and what it gives back.
              
  int i = 0, Index = 0, FreeSlot = 0, NumChromos = 0;
  char *TempGString = NULL;
  struct ScreenPoint *NewScreenPoint = NULL;

  // First we find somewhere to put it ...
  //LogMessage ("DoWhatRabbitsDoBest() looking for a free space.");

  while ((i < MAXPLAYERS) && (ReturnValue == NoFreeSpaceError)) {
    if (EntityArray[i] == NULL) {
      //LogMessage ("DoWhatRabbitsDoBest() found one.");

      // We got one!
      /*
       * 11 May 2005 - Design alteration
       * Previously, the entity was malloc()'ed at this point before 
       * the GString was set. THEN the GString was set and if it failed 
       * then the GString had to be free()'d.  Instead we now create a temporary
       * value for the GString, check if it suceeded and only then malloc() the
       * entity and copy it across if successful.
       */

      // Ditto for the GetNewScreenPoint() call.
      //LogMessage ("DoWhatRabbitsDoBest() setting up entity data.");
      NumChromos = SetGString (&TempGString);
      ReturnedError = GetNewScreenPoint (&NewScreenPoint);
      //LogMessage ("DoWhatRabbitsDoBest() has set up entity data.");

      // if no chromosomes OR the return value is not equal to AllOK (zero)...
      if ((!NumChromos) || (ReturnedError)) {
	//LogMessage ("Error setting up entity data in function DoWhatRabbitsDoBest().");
        ReturnValue = ReturnedError;
      }
      else {
	EntityArray[i] = (struct Entity *) malloc (sizeof (struct Entity));

	if (EntityArray[i] == NULL) {
            
          // Or have we?
	  //LogMessage ("DoWhatRabbitsDoBest() recieved error from malloc() call.");
	  ReturnValue = MallocError;
	}
	else {
	  EntityArray[i]->GString = (char *) malloc ((NumChromos * 3) + 1);

	  if (!(EntityArray[i]->GString)) {
	    free (EntityArray[i]);
	    ReturnValue = MallocError;
	  }
	  else {
	    // In order to get here all function calls **must** have worked
            // so no Segmentation faults :)
	    FreeSlot = i;
	    ReturnValue = AllOK;

	    //LogMessage ("Copying GString.");
	    strncpy (EntityArray[FreeSlot]->GString, TempGString, ((NumChromos * 3) + 1));

	    //LogMessage ("DoWhatRabbitsDoBest() setting attributes and methods.");

            // First the basic settings
            EntityArray[FreeSlot]->Class = clHerb;
            EntityArray[FreeSlot]->Name = idRabbit;
            EntityArray[FreeSlot]->Appearance = RABBITCHAR;
            EntityArray[FreeSlot]->X = NewScreenPoint->X;
            EntityArray[FreeSlot]->Y = NewScreenPoint->Y;
            EntityArray[FreeSlot]->MaxHealth = MAXRABBITHEALTH;
            EntityArray[FreeSlot]->Health = (MAXRABBITHEALTH)/2;
            EntityArray[FreeSlot]->GenePointer = 0;
            EntityArray[FreeSlot]->Visible = True;  
    
            // Now the function pointers
            EntityArray[FreeSlot]->GetMove = MoveRabbit;
            EntityArray[FreeSlot]->HandleObstacle = BlockedRabbit;
            EntityArray[FreeSlot]->HideEntity = HideRabbit;
            EntityArray[FreeSlot]->KillEntity = KillRabbit;
            EntityArray[FreeSlot]->SpawnEntity = DoWhatRabbitsDoBest;
            
            //Now we need to put it on the ScreenArray
            Index = (EntityArray[FreeSlot]->X + (EntityArray[FreeSlot]->Y * SCREENWIDTH));
            ScreenArray[NewScreenPoint->X][NewScreenPoint->Y] = &(EntityArray[FreeSlot]);
          } // if (!(EntityArray[i]->GString))
        } // if (EntityArray[i] == NULL)
      } // if ((!NumChromos) || (RecieptValue))
    } // if (EntityArray[i] == NULL)
    i++;
  } // while ((i<MAXPLAYERS) && (ReturnState == NoFreeSpaceError)) 


  //LogMessage (EntityArray[FreeSlot]->GString);
  //LogMessage ("DoWhatRabbitsDoBest() returning.");

  free (TempGString);
  free (NewScreenPoint);

  return ReturnValue;
}

// Fox functions.
Action MoveFox (struct Entity **this)
{
  //LogStat ("MoveFox() answering, health = ", (*this)->Health);

  Action ReturnValue = Stay;
  ReturnState ReturnedError = AllOK;

  (*this)->Health--;
  
  // If it was hiding then unhide it.
  (*this)->Visible = True;
   
  if ((*this)->Health >= (*this)->MaxHealth) {
    (*this)->Health = ((*this)->MaxHealth)/2;
    //LogMessage ("MoveFox() calling (*this)->SpawnEntity().");
    ReturnedError = (*this)->SpawnEntity();

    //LogMessage ("MoveFox() called (*this)->SpawnEntity().");

    ReturnValue = Stay;
  }

  else if ((*this)->Health <= 0) {
    //LogMessage ("MoveFox() calling (*this)->KillEntity().");

    ReturnedError = (*this)->KillEntity (this);

    //LogMessage ("MoveFox() called (*this)->KillEntity().");
    ReturnValue = Stay;
  }     

  else if (!((*this)->GString)) {
    //LogMessage ("(*this)->GString == NULL.");
  }  
  /*
   * If the flow reaches here them everything should be OK
   * to move the rabbit, ahem, fox.  Any conditions that
   * would prevent the fox from moving should be handled
   * before this point.
   */
  else {
    //LogMessage ("Function MoveFox() choosing next move.");

    if (((*this)->GString[(*this)->GenePointer] == 'O') &&
	((*this)->GString[(*this)->GenePointer + 1] == 'O') &&
	((*this)->GString[(*this)->GenePointer + 2] == 'O')) {
		
      ReturnValue = MoveRight;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'O')) {
      ReturnValue = MoveUpRight;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'O')&&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'O')) {		
      ReturnValue = MoveUp;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'O')) {
      ReturnValue = MoveUpLeft;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'I')) {
      ReturnValue = MoveLeft;
    }

    else if (((*this)->GString[(*this)->GenePointer] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'I')) {
      ReturnValue = MoveDownLeft;
    }
		
    else if (((*this)->GString[(*this)->GenePointer] == 'O') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'I')) {
      ReturnValue = MoveDown;
    }
		
    else if (((*this)->GString[(*this)->GenePointer] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 1] == 'I') &&
	     ((*this)->GString[(*this)->GenePointer + 2] == 'I')) {
      ReturnValue = MoveDownRight;
    }
       
    else {
      /* 
       * If this runs there is problem with the GString so
       * some extra coding is needed here to investigate and
       * report the problem.  For now lets just ignore it and
       * carry on gracefully.
       */
      ReturnValue = Stay;
    }
    
    //LogStat ("Function MoveFox() choose next move = ", ReturnValue);
    
    (*this)->GenePointer += 3;

    if ((*this)->GenePointer >= strlen ((*this)->GString)) {
      (*this)->GenePointer = 0;
    }
  } // if ((*this)->GString == 0)

  //LogMessage ("MoveFox() returning.");
  return ReturnValue;
}

Action BlockedFox (struct Entity *this, struct Entity *that)
{
  //LogMessage ("BlockedFox() answering.");
  /*
   * In this very key function we define what the animal actually eats.
   * What happens is that when the controller gets a movement order from
   * the animal and tries to move in that direction but finds its way
   * blocked, it will then call this function, passing a pointer to
   * obstacle, to ask the animal how to handle it.  If the animal
   * eats that obstacle or performs any other type of action with that
   * obstacle then there will be an entry within the switch() statement
   * in this function.  If there is no entry in the switch() statement
   * then the function defaults to Action Stay meaning that the blockage
   * is unresolveable.
   */
  Action ReturnValue = Stay;
  ReturnState ReturnedError = AllOK;
  
  //LogMessage ("BlockedFox() ready to run switch statement.");
            
  switch (that->Name) {
    case idRabbit:
      //LogMessage ("BlockedFox() caught a rabbit.");
            
      ReturnedError = that->KillEntity (&that);
      
      //LogMessage ("BlockedFox() killed a rabbit.");
            
      if (!ReturnedError) {
        // Yum!
        this->Health += RABBITNUTRITION;
      }
    break;

    // If it's not a rabbit but it is a plant then walk over it!
    default:    
      switch (that->Class) {
        case clPlant:
          //LogMessage ("BlockedFox() found some grass.");
            
          ReturnedError = that->HideEntity (that);
          
          if (!ReturnedError) {
            // Onwards!
            ReturnValue = Continue;
          }

        break;
            
        default:
        break; // Prevents compiler warning messages!
      } // switch (that->EntityClass)  
  } // switch (that->EntityName)    

  //LogMessage ("BlockedFox() returning.");
            
  return ReturnValue;
} // Action BlockedFox (struct Entity *this, struct Entity *that)




//ReturnState HideFox (struct Entity *this);
//ReturnState KillFox (struct Entity **this);

ReturnState TheFoxesAreAtItAgain (void)
{
  //LogMessage ("TheFoxesAreAtItAgain() answering.");
  /*
   * My usual convention is to set ReturnValue to AllOK by default
   * but here I take the "guilty until proven innocent" approach
   * by making the function find a free space before it is allowed
   * to set ReturnValue to AllOK
   */

  /*
   * 10-05-05 Re-design notification
   * Currently this function has the inefficiency of calling malloc()
   * for the struct before we know that all of the functions calls necessary 
   * to get it running are working first
   */
  /* 
   * The flow of this function goes something like this:
   * Check for a free space in EntityArray
   * if there is...
   *     set up the temp values (chromosomes and screen position)
   *     if not successful...
   *         report and exit
   *     else...
   *         malloc() the struct
   *         if not successful...
   *             report and exit
   *         else...
   *             init the GString
   *             if it didn't work
   *                 free() and exit
   *             else
   *                 set up the attributes and methods
   *             end if
   *         end if
   *     end if
   * end if
   * return
   */
   

  ReturnState ReturnedError = AllOK;             // What the function gets back ...
  ReturnState ReturnValue = NoFreeSpaceError;   // ... and what it gives back.
              
  int i = 0, Index = 0, FreeSlot = 0, NumChromos = 0;
  char *TempGString = NULL;
  struct ScreenPoint *NewScreenPoint = NULL;

  // First we find somewhere to put it ...
  //LogMessage ("TheFoxesAreAtItAgain() looking for a free space.");
  while ((i < MAXPLAYERS) && (ReturnValue == NoFreeSpaceError)) {
    if (EntityArray[i] == NULL) {
      //LogMessage ("TheFoxesAreAtItAgain() found one.");

      // We got one!
      /*
       * 11 May 2005 - Design alteration
       * Previously, the entity was malloc()'ed at this point before 
       * the GString was set. THEN the GString was set and if it failed 
       * then the GString had to be free()'d.  Instead we now create a temporary
       * value for the GString, check if it suceeded and only then malloc() the
       * entity and copy it across if successful.
       */
      // Ditto for the GetNewScreenPoint() call.
      //LogMessage ("TheFoxesAreAtItAgain() setting up entity data.");
      NumChromos = SetGString (&TempGString);
      ReturnedError = GetNewScreenPoint (&NewScreenPoint);
      //LogMessage ("TheFoxesAreAtItAgain() has set up entity data.");

      // if no chromosomes OR the return value is not equal to AllOK (zero)...
      if ((!NumChromos) || (ReturnedError)) {
	//LogMessage ("Error setting up entity data in function TheFoxesAreAtItAgain().");
	ReturnValue = ReturnedError;
      }
      else {
	EntityArray[i] = malloc (sizeof (struct Entity));

	if (EntityArray[i] == NULL) {
              // Or have we?
	  //LogMessage ("TheFoxesAreAtItAgain() recieved error from malloc() call.");
	  ReturnValue = MallocError;
	}
	else {
	  EntityArray[i]->GString = (char *) malloc ((NumChromos * 3) + 1);

	  if (!(EntityArray[i]->GString)) {
	    free (EntityArray[i]);
	    ReturnValue = MallocError;
	  }
	  else {
            // In order to get here all function calls **must** have worked
            // so no Segmentation faults :)
	    FreeSlot = i;
	    ReturnValue = AllOK;

	    //LogMessage ("Copying GString.");
	    strncpy (EntityArray[FreeSlot]->GString, TempGString, ((NumChromos * 3) + 1));

	    //LogMessage ("TheFoxesAreAtItAgain() setting attributes and methods.");

            // First the basic settings
	    EntityArray[FreeSlot]->Class = clCarn;
	    EntityArray[FreeSlot]->Name = idFox;
	    EntityArray[FreeSlot]->Appearance = FOXCHAR;
	    //EntityArray[FreeSlot]->Colour = FOXCOLOUR;
	    EntityArray[FreeSlot]->X = NewScreenPoint->X;
	    EntityArray[FreeSlot]->Y = NewScreenPoint->Y;
	    EntityArray[FreeSlot]->MaxHealth = MAXFOXHEALTH;
	    EntityArray[FreeSlot]->Health = (MAXFOXHEALTH)/4;
	    EntityArray[FreeSlot]->GenePointer = 0;
	    EntityArray[FreeSlot]->Visible = True;
    
            // Now the function pointers
	    EntityArray[FreeSlot]->GetMove = MoveFox;
	    EntityArray[FreeSlot]->HandleObstacle = BlockedFox;
	    EntityArray[FreeSlot]->HideEntity = HideRabbit;
	    EntityArray[FreeSlot]->KillEntity = KillRabbit;
	    EntityArray[FreeSlot]->SpawnEntity = TheFoxesAreAtItAgain;
            
            //Now we need to put it on the ScreenArray
	    Index = (EntityArray[FreeSlot]->X + (EntityArray[FreeSlot]->Y * SCREENWIDTH));
	    ScreenArray[NewScreenPoint->X][NewScreenPoint->Y] = &EntityArray[FreeSlot];
          } // if (!(EntityArray[i]->GString))
        } // if (EntityArray[i] == NULL)
      } // if ((!NumChromos) || (ReturnedError))
    } // if (EntityArray[i] == NULL) 
    i++;
  } // while ((i<MAXPLAYERS) && (ReturnState == NoFreeSpaceError)) 


  //LogMessage (EntityArray[FreeSlot]->GString);
  //LogMessage ("TheFoxesAreAtItAgain returning.");

  free (TempGString);
  free (NewScreenPoint);

  return ReturnValue;
}

// Additional Miecos-specific functions
ReturnState GetNewScreenPoint (struct ScreenPoint **NewPoint)
{
  /* Description:
   * This function accepts an pointer a pointer to a struct, finds a space for it in ScreenArray,
   * assigns values to its X and Y attributes if it finds a space and returns an error code 
   * depending on whether on not it was successful.
   * 
   * Libraries:
   * stdlib.h - malloc()
   * - sizeof()
   * 
   * Dependencies:
   * LogMessage (char *)
   * int Rand (int)
   * enum ReturnState {}
   * int MAXTRIES
   * int SCREENWIDTH
   * int SCREENHEIGHT
   * ??? SCREENARRAY[( >= (SCREENHEIGHT * SCREENWIDTH))]
   * struct ScreenPoint {... int X, int Y, ...}
   * 
   * Prerequisites:
   * This function requires that the parameter has been free()'d first, otherwise the memory
   * will be lost resulting in a memory leak.
   * It assumes that the array is a one-dimensional one that accesses two dimensions by 
   * the formula (X, Y) --> (X + (Y * SCREENWIDTH)).
   * 
   * Issues:
   * None known.
   * 
   * Contract:
   * This program accepts an unused pointer to a pointer to a struct, malloc()'s space to it,
   * finds a place for it in the ScreenArray, assigns values for its X and Y arrtubutes and 
   * returns a value of zero if it was successful or one of the following values if it wasn't: 
   * NoFreePointError, MallocError.
   */

  //LogMessage ("GetNewScreenPoint() answering.");
  
  ReturnState ReturnValue = NoFreePointError;
  
  int i = 0, j = 0, Tries = 0;

  (*NewPoint) = NULL;      
  (*NewPoint) = (struct ScreenPoint *) malloc (sizeof (struct ScreenPoint));
  
  if (NewPoint == NULL) {
    ReturnValue = MallocError;
  }
  else {
  
    while ((Tries < MAXTRIES) && (ReturnValue == NoFreePointError)) {
      i = Rand (SCREENWIDTH);
      j = Rand (SCREENHEIGHT);

      if ((i == -1) || (j == -1)) {
	//LogMessage ("Error in Rand function, invalid return value.");
	ReturnValue = GeneralError;
      }
      else {
        if (ScreenArray[i][j] == NULL) {
          // We got one!
          (*NewPoint)->X = i;
          (*NewPoint)->Y = j;
          ReturnValue = AllOK;
	}
        else { 
          Tries++;
	}
      } // if (ScreenArray[Index] == NULL)
    } // while ((Tries < MAXTRIES) && (ReturnValue == NoFreePointError))   
  } // if (NewPoint == NULL)
    
  //LogMessage ("GetNewScreenPoint() returning.");

  //free (NewPoint);  
  return ReturnValue;
} // ReturnState GetNewScreenPoint (struct ScreenPoint **NewPoint)

int SetGString (char **NewGString)
{
  /* 
   * Description:
   * This function accepts a pointer to a string pointer, creates a random, null-terminated
   * string of random length consisting of 'I''s and 'O''s and returns the number of 
   * chromosomes in the string (the length of the string will be ((ReturnValue * 3) + 1)).
   * 
   * Libraries:
   * stdlib.h - malloc(), free()
   * strings.h - bzero() 
   * 
   * Dependencies:
   * LogMessage (char *)
   * int Rand (int)
   * int MANGENESIZE
   * 
   * Prerequisites:
   * One of the first things this function does is to NULL the parameter so it needs
   * to have been free()'d before being called, if necessary, otherwise anything the 
   * pointer points to will be lost and a memory leak will be created.
   * 
   * Issues:
   * No error-checking of the value of MAXGENESIZE.
   * 
   * Contract:
   * This function accepts an unused pointer to a char pointer.  It will then NULL the
   * pointer, malloc() space for it, create a randomly created genestring of random
   * length to a maximum of (MAXGENESIZE * 3) plus the null character in that space and 
   * return the number of chromosomes in the string.  If it encounters any errors it 
   * will NULL the string and return 0.
   */

  /*
   * 10 May 2005 - Design Alteration
   * Originally this function took a pointer to a pointer to a char
   * and used that to create and set the GString.  Now however it takes
   * no parameters but instead returns a pointer to the newly created 
   * GString.  If there is an error in this function the returned char 
   * will be NULL
   */

  /*
   * 11 May 2005 - Design Alteration alteration
   * For practical purposes this function will now work directly on the 
   * string itself and return the number of chromosomes.  Otherwise we either
   * need to pass the required length as a parameter OR get the length of the
   * string with the strlen() function once it has been passed back.  Neither
   * of these solutions is very elegant.
   */

  //LogMessage ("SetGString() answering.");
  
  int i = 0, GeneLength = 0, NextGene = 0, NumChromo = 0;

  /* 
   * Set size for this gene.  The genes are a triplet system of the form
   * OOI, IOI, etc. and MAXGENESIZE actually denotes the maximum number
   * of triplets, NOT the total length of the string.  The Rand() function
   * return a random number in the range 0 <= ReturnedInt < MAXGENESIZE so this
   * statement takes the return value and converts it into the actual length
   * of the GString which will be a number divisible by 3.  By default if the
   * Rand() functions hits an error then it returns the value of -1 meaning
   * that the statement below will evaluate to zero.
   */

  (*NewGString) = NULL;
  NumChromo = (Rand(MAXGENESIZE) + 1);

  //LogStat ("GeneLength = ", GeneLength);
  
  if (!(NumChromo)) {
    // Houston, we have a problem.
    //LogMessage ("Error getting NumChromo from Rand() in SetGString.");
    //NumChromo = 0;
    /*
     * If the flow reaches here then there is an error howeverwe don't need to
     * do anything right now except skip the rest of the function and send out an
     * error message.
     */
  }
  else {
    // malloc() memory for the GString and set the last value as NULL
    GeneLength = (NumChromo * 3);
    (*NewGString) = (char *) malloc (GeneLength + 1);
    
    if (!(NewGString)) {
      //LogMessage ("Malloc error in function SetGString.");
      (*NewGString) = NULL;
      NumChromo = 0;
    }
    else {
      /*
       * If there has been any problems earlier then ReturnValue will NOT equal
       * AllOK.  If it does then it should be safe to run this loop
       */  
      bzero ((*NewGString), (GeneLength + 1));

      while (i < GeneLength) {
        NextGene = Rand(2);

        if (NextGene == 0) {
          (*NewGString)[i] = 'O';
        }
        else if (NextGene == 1) {    
          (*NewGString)[i] = 'I';
        }
        else {
          //LogMessage ("Error calling Rand() in function SetGString.");
	  free (*NewGString);
 	  (*NewGString) = NULL;
	  i = GeneLength;
	  NumChromo = 0;
        } // if (NextGene == 1)
    
        i++;
      } // while (i < GeneLength)
    } // if (!(NewGString))      
  } // if (!(NumChromo));

  //LogMessage (*NewGString);
  //LogMessage ("SetGString() returning.");

  //free (NewGString);
  return NumChromo;
} // int SetGString (char **NewGString)


// Additional general functions
int Rand (int MaxNum)
{
  /*
   * Description:
   * This function acts as a wrapper for the standard rand() function.  It acts as limiter
   * allowing for the return of a random number in a specified range.
   * 
   * Libraries:
   * stdlib.h - rand().
   * 
   * Dependencies:
   * None.
   * 
   * Prerequisites:
   * This function does not call the srand() function so this needs to be called 
   * separately if required.
   * 
   * Issues:
   * None known.
   * 
   * Contract:
   * This function accepts an integer value (MaxNum) in the range (0 < MaxNum <= 1000).
   * It will then return a random value in the range (0 <= ReturnValue < MaxNum).
   * If the parameter MaxNum is outside the range specified, the function will return
   * the value -1.
   */




  unsigned long RandNum;
  int ReturnValue = 0;

  if ((MaxNum > 0) && (MaxNum <= 1000)) {
    RandNum = rand();

    /* The next two lines assure that the value of the calculations
     * cannot exceed the value of RAND_NUM as defined in stdlib.h
     * by first reducing RandNum by 1024 and multiplying it by MaxNum
     * which will not be larger than 1000.  That should ensure no
     * possibility of cut-off errors.
     */
    
    RandNum = (RandNum/1024);
    ReturnValue = (int)((RandNum*MaxNum)/(RAND_MAX/1024));
  }
  else {
    ReturnValue = -1;
  }
    
  return ReturnValue;
} // int Rand (int MaxNum)

//void LogMessage (char *Message)
//{
/*  if ((OutputFile = fopen (OUTPUTFILENAME, "a")) != NULL) {
    fprintf (OutputFile, Message);
    fprintf (OutputFile, "\n\n");
    fclose (OutputFile);
  }

  //printf (Message);
// } // void LogMessage (char *Message) 

//void LogStat (char *Message, int Stat)
//{
//  static int LogCalls;
/ *
  if ((OutputFile = fopen (OUTPUTFILENAME, "a")) != NULL) {
    LogCalls ++;
    //fprintf (OutputFile, "%i calls made to LogStat.\n", LogCalls);
    fprintf (OutputFile, Message);
    fprintf (OutputFile, "%i", Stat);
    fprintf (OutputFile, "\n\n");
    fclose (OutputFile);
  }
} */ // void LogStat (char *Message, int Stat) 

  // Function header template
  /* Description:
   * 
   * 
   * Libraries:
   * 
   * 
   * Dependencies:
   * 
   * 
   * Prerequisites:
   * 
   * 
   * Issues:
   * 
   * 
   * Contract:
   * 
   */


 
 
