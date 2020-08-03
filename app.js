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
// generate board
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
// print table
function printArray(gridToPrint) {
  var arr = gridToPrint.map((item) => item.join("  ")).join("\n");
  console.log(arr);
}
// user play command - determines initial array position
function play(entryPoint) {
  var currentDirection = "",
    noOfEntryPoints = Math.pow(dimension, 2),
    noEntryPointsPerSide = noOfEntryPoints / dimension,
    currentYPosition = 0,
    currentXPosition = 0;

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
  } else if (
    entryPoint >= noEntryPointsPerSide &&
    entryPoint < noEntryPointsPerSide * 2
  ) {
    currentDirection = "<";
    currentXPosition = noEntryPointsPerSide - 1;
    currentYPosition = entryPoint - noEntryPointsPerSide; // this needs logic COLUMN
  } else if (
    entryPoint >= noEntryPointsPerSide * 2 &&
    entryPoint < noEntryPointsPerSide * 3
  ) {
    currentDirection = "^";
    currentYPosition = noEntryPointsPerSide - 1;
    currentXPosition =
      noEntryPointsPerSide - 1 - (entryPoint - noEntryPointsPerSide * 2); // this needs logic ROW
  } else if (
    entryPoint >= noEntryPointsPerSide * 3 &&
    entryPoint < noEntryPointsPerSide * 4
  ) {
    currentDirection = ">";
    currentYPosition =
      noEntryPointsPerSide - 1 - (entryPoint - noEntryPointsPerSide * 3); // this needs logic COLUMN
  }
  // entry point
  moveBall(currentDirection, currentXPosition, currentYPosition);
}

// game logic
function moveBall(direction, x, y) {
  // log steps
  console.log( "Starting directiion:" + direction + " at position([Y,X]): [" + y + "," + x + "]");
  /<|>/.test(direction) ? moveX(direction, x, y) : moveY(direction, x, y);
}

// Vertical Move
function moveY(direction, x, y) {
  console.log("y value", y);
  // check exit points
  if (y >= grid.length || y < 0) {
    printArray(grid);
    var yValue = y < 0 ? y + 1 : y - 1;
    console.log(
      "Exit Point is: [" + yValue + "," + x + "] going " + direction + " direction"
    );
    return;
  }

  console.log(
    "current move: " + direction + " at position([Y,X]): [" + y + "," + x + "]"
  );

  if (direction === "V") {
    if (grid[y][x] === "/") {
      switchDeflector(x, y);
      moveX("<", x - 1, y);
    } else if (grid[y][x] === "\\") {
      switchDeflector(x, y);
      moveX(">", x + 1, y);
    } else {
      moveY("V", x, y + 1);
    }
  } else {
    if (grid[y][x] === "/") {
      switchDeflector(x, y);
      moveX(">", x + 1, y);
    } else if (grid[y][x] === "\\") {
      switchDeflector(x, y);

      moveX("<", x - 1, y);
    } else {
      moveY("^", x, y - 1);
    }
  }
}

// Horizontal Move
function moveX(direction, x, y) {
  console.log('x value', x)
  // check exit points
  if (x >= grid.length || x < 0) {
    var xValue = x < 0 ? x + 1 : x - 1;
    printArray(grid);
    console.log("Exit Point is: [" + y + "," + xValue + "] going " + direction + " direction");
    return; 
  }

  console.log(
    "current move:" + direction + " at position([Y,X]): [" + y + "," + x + "]"
  );

  if (direction === ">") {
    if (grid[y][x] === "/") {
      switchDeflector(x, y);
      moveY("^", x, y - 1);
    } else if (grid[y][x] === "\\") {
      switchDeflector(x, y);
      moveY("V", x, y + 1);
    } else {
      moveX(">", x + 1, y);
    }
  } else {
    if (grid[y][x] === "/") {
      switchDeflector(x, y);
      moveY("V", x, y + 1);
    } else if (grid[y][x] === "\\") {
      switchDeflector(x, y);
      moveY("^", x, y - 1);
    } else {
      moveX("<", x - 1, y);
    }
  }
}
// Flip deflectors
function switchDeflector(x,y){
 grid[y][x] = grid[y][x] === "/" ? "\\" : "/";
}

generateBlackBox(9, 36);
play(8);
