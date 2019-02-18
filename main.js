/*jslint es6*/
"use strict";

const canvasWidth = 500,
  canvasHeigth = 300,
  gridSize = 10;

var grid = new Array(canvasWidth / gridSize)
    .fill()
    .map(() => new Array(canvasHeigth / gridSize).fill(0)),
  showGridLines = true,
  isGameRunning = false;

function setup() {
  const cnv = createCanvas(canvasWidth, canvasHeigth);
  cnv.style("display", "block");
  cnv.parent(document.getElementById("game"));
}

const gridLinesButton = document.getElementById("gridLines");
gridLinesButton.onclick = () => {
  showGridLines = !showGridLines;
  if (showGridLines) {
    gridLinesButton.value = "Hide grid lines";
  } else {
    gridLinesButton.value = "Show grid lines";
  }
};

function drawGridLines(cw, ch, gz) {
  stroke("#000");

  // Vertical
  for (let i = gz; i <= cw; i += gz) {
    line(i, 0, i, ch);
  }

  // Horizontal
  for (let i = gz; i <= ch; i += gz) {
    line(0, i, cw, i);
  }
}

function drawGrid(grid, gridSize) {
  noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j]) {
        fill("#333");
        rect(i * gridSize, j * gridSize, gridSize, gridSize);
      } else {
        fill("#FFF");
        rect(i * gridSize, j * gridSize, gridSize, gridSize);
      }
    }
  }
}

const playGameButton = document.getElementById("playGameOfLife");
playGameButton.onclick = () => {
  isGameRunning = !isGameRunning;
  if (isGameRunning) {
    playGameButton.value = "Stop game of life";
  } else {
    playGameButton.value = "Play game of life";
  }
};

function valueIfValid(g, i, j) {
  if (i < 0 || j < 0 || i >= g.length || j >= g[0].length) {
    return 0;
  } else {
    return g[i][j];
  }
}

function gameOfLife(g) {
  /*
    Rules:
      1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
      2. Any live cell with two or three live neighbors lives on to the next generation.
      3. Any live cell with more than three live neighbors dies, as if by overpopulation.
      4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
    https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules
  */

  let nG = g.map(elm => {
    return elm.slice();
  });

  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[i].length; j++) {
      let neighbors =
        valueIfValid(g, i - 1, j - 1) +
        valueIfValid(g, i, j - 1) +
        valueIfValid(g, i + 1, j - 1) +
        valueIfValid(g, i - 1, j) +
        valueIfValid(g, i + 1, j) +
        valueIfValid(g, i - 1, j + 1) +
        valueIfValid(g, i, j + 1) +
        valueIfValid(g, i + 1, j + 1);
      if (g[i][j]) {
        if (neighbors < 2 || neighbors > 3) {
          // Rule 1 & 3
          nG[i][j] = 0;
        }
        // Rule 2 is implicit
      } else {
        if (neighbors === 3) {
          // Rule 4
          nG[i][j] = 1;
        }
      }
    }
  }

  return nG;
}

const clearAllButton = document.getElementById("clearAll");
clearAllButton.onclick = () => {
  grid = new Array(canvasWidth / gridSize)
    .fill()
    .map(() => new Array(canvasHeigth / gridSize).fill(0));
};

function draw() {
  background("#F00");
  if (isGameRunning) {
    grid = gameOfLife(grid);
  }
  drawGrid(grid, gridSize);
  if (showGridLines) {
    drawGridLines(canvasWidth, canvasHeigth, gridSize);
  }
  // TODO: Kill cells manually
  if (mouseIsPressed) {
    if (0 < mouseX && mouseX < canvasWidth) {
      if (0 < mouseY && mouseY < canvasHeigth) {
        // Draw cells
        grid[Math.floor(mouseX / gridSize)][Math.floor(mouseY / gridSize)] = 1;
      }
    }
  }
}
