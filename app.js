/**
 * The Black Box Game is played with a square-shaped black box lying flat on a table. Each of its four sides has N holes (for a total of 4n holes) into which a ball can be thrown. A thrown ball will eventually exit from one of the 4n holes, potentially the same hole into which it was thrown.
 */
/**
 * A ball is thrown through a hole; it hits a deflector and changes direction.
 * After the first ball was thrown, the deflector has toggled its position. A new ball is thrown into the same hole, hits the deflector and is deflected in a direction opposite to that of the first ball.
 * The deflector toggles every time it is hit.
 * Whenever a deflector is hit, it makes a beep. The number of times the ball was deflected can be deduced by counting the beeps. It can be proved that the ball always exits the box. The box has a button that resets it to its original state and another button that toggles all of its deflectors.
 * '/' - ball hit from left goes up, hit from up  goes left, hit from below goes right, hit from right goes down
 */

// global vars
var grid = [],
  initialGrid = [],
  dimension = 0;

function generateBlackBox(dim, noOfDeflectors) {
  dimension = dim;
  // check valid input
  if (!Number.isInteger(dimension) || dimension <= 0)
    return console.log("please enter Number > 0");
  // create array
  for (var i = 0; i < dimension; i++) {
    grid.push(new Array(dimension).fill("x"));
  }
  //  place deflectors
  placeDeflectors(0);
  // print grid
  console.log("original grid:");
  printArray(initialGrid);

  // recursive function to place specified number of deflectors
  function placeDeflectors(existingDeflectors) {
    if (existingDeflectors === noOfDeflectors) {
      initialGrid = grid;
      return;
    }
    if (existingDeflectors < noOfDeflectors) {
      var placement1 = generateRandomNumber(dimension),
        placement2 = generateRandomNumber(dimension);
      grid[placement1][placement2] === "x"
        ? ((grid[placement1][placement2] = deflectorValue()),
          existingDeflectors++)
        : null;
    }
    placeDeflectors(existingDeflectors);
  }

  // generate random number
  function generateRandomNumber(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
  }

  // generate random deflector symbol (/ or \)
  function deflectorValue() {
    var value = generateRandomNumber(2);
    return value === 1 ? "/" : "\\";
  }
}

function printArray(gridToPrint) {
  var arr = gridToPrint.map((item) => item.join("  ")).join("\n");
  console.log(arr);
}

function play(entryPoint) {
  var currentDirection = "",
    noOfEntryPoints = Math.pow(dimension, 2),
    noEntryPointsPerSide = noOfEntryPoints / dimension,
    currentYPosition = 0,
    currentXPosition = 0,
    previousYPos = 0,
    previousXPos = 0;

  // check valid entry
  if (entryPoint >= noOfEntryPoints || !Number.isInteger(entryPoint)) {
    console.log(
      "Please enter a number between 0 and " + (Math.pow(dimension, 2) - 1)
    );
  }

  // define entry point directions and determine current array position
  console.log("entryPoint", entryPoint);

  if (entryPoint < noEntryPointsPerSide) {
    currentDirection = "V";
    currentXPosition = entryPoint;
    console.log(
      "top side:current direction:" +
        currentDirection +
        " current position ([Y, X]): [" +
        currentYPosition +
        "," +
        currentXPosition +
        "]"
    );
  } else if (
    entryPoint >= noEntryPointsPerSide &&
    entryPoint < noEntryPointsPerSide * 2
  ) {
    currentDirection = "<";
    currentXPosition = noEntryPointsPerSide - 1;
    currentYPosition = entryPoint - noEntryPointsPerSide; // this needs logic COLUMN
    console.log(
      "right side:current direction",
      currentDirection +
        " current position ([Y, X]): [" +
        currentYPosition +
        "," +
        currentXPosition +
        "]"
    );
  } else if (
    entryPoint >= noEntryPointsPerSide * 2 &&
    entryPoint < noEntryPointsPerSide * 3
  ) {
    currentDirection = "^";
    currentYPosition = noEntryPointsPerSide - 1;
    currentXPosition =
      noEntryPointsPerSide - 1 - (entryPoint - noEntryPointsPerSide * 2); // this needs logic ROW
    console.log(
      "bottom side:current direction",
      currentDirection +
        " current position ([Y, X]): [" +
        currentYPosition +
        "," +
        currentXPosition +
        "]"
    );
  } else if (
    entryPoint >= noEntryPointsPerSide * 3 &&
    entryPoint < noEntryPointsPerSide * 4
  ) {
    currentDirection = ">";
    currentYPosition =
      noEntryPointsPerSide - 1 - (entryPoint - noEntryPointsPerSide * 3); // this needs logic COLUMN
    console.log("left side:current direction", currentDirection);
  }

  // entry point
  moveBall();

  // game logic

  function moveBall() {
    var isOffGrid =
      currentYPosition >= noEntryPointsPerSide ||
      currentXPosition >= noEntryPointsPerSide ||
      currentYPosition < 0 ||
      currentXPosition < 0;

    // exit point
    if (isOffGrid) {
      grid[previousYPos][previousXPos] = "e";
      printArray(grid);
      return console.log(
        "Exit Point is: [" + previousYPos + "," + previousXPos + "]"
      );
    }

    // set previous state
    previousXPos = currentXPosition;
    previousYPos = currentYPosition;

    // if first move is a deflector

    //  if(grid[currentYPosition][currentXPosition] === "/"){
    //   (grid[currentYPosition][currentXPosition] = "\\"
    //  }
    //    ? (grid[currentYPosition][currentXPosition] = "\\")
    //    : grid[currentYPosition][currentXPosition] === "\\"
    //    ? (grid[currentYPosition][currentXPosition] = "/")
    //    : null;

    // log steps
    console.log(
      " steps taken([Y,X]): [" + previousYPos + "," + previousXPos + "]"
    );
    checkDeflector();

    moveBall();
  }

  function checkDeflector() {
    if (currentDirection === "V") {
      
      currentYPosition++;
      if (grid[currentYPosition][currentXPosition] === "/") {
        console.log("aaa", currentYPosition);
        grid[currentYPosition][currentXPosition] = "\\";
        currentDirection = "<";
        currentXPosition--;
      } else if (grid[currentYPosition][currentXPosition] === "\\") {
        grid[currentYPosition][currentXPosition] = "/";
        currentDirection = ">";
        currentXPosition++;
      }
      return;
    } else if (currentDirection === "<") {
      currentXPosition--;
      if (grid[currentYPosition][currentXPosition] === "/") {
        grid[currentYPosition][currentXPosition] = "\\";
        currentDirection = "V";
        currentYPosition++;
      } else if (grid[currentYPosition][currentXPosition] === "\\") {
        grid[currentYPosition][currentXPosition] = "/";
        currentDirection = "^";
        currentYPosition--;
      }
    } else if (currentDirection === ">") {
      currentXPosition++;
      if (grid[currentYPosition][currentXPosition] === "/") {
        grid[currentYPosition][currentXPosition] = "\\";
        currentDirection = "^";
        currentYPosition--;
      } else if (grid[currentYPosition][currentXPosition] === "\\") {
        grid[currentYPosition][currentXPosition] = "/";
        currentDirection = "V";
        currentYPosition++;
      }
    } else if (currentDirection === "^") {
      currentYPosition--;
      if (grid[currentYPosition][currentXPosition] === "/") {
        grid[currentYPosition][currentXPosition] = "\\";
        currentDirection = ">";
        currentXPosition++;
      } else if (grid[currentYPosition][currentXPosition] === "\\") {
        grid[currentYPosition][currentXPosition] = "/";
        currentDirection = "<";
        currentXPosition--;
      }
    }
  }
}

generateBlackBox(4, 16);

play(2);
