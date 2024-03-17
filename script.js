"use strict";

window.addEventListener("load", start);

// ********** CONTROLLER **********
function start() {
  console.log("start()");
  startListening();
}

// ********** MODEL **********

class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.visited = false;
    this.north = true;
    this.east = true;
    this.west = true;
    this.south = true;
  }
}

class Maze {
  constructor(rows, columns, startRow, startColumn, goalRow, goalColumn) {
    this.rows = rows;
    this.columns = columns;
    this.startRow = startRow;
    this.startColumn = startColumn;
    this.goalRow = goalRow;
    this.goalColumn = goalColumn;
    this.grid = [];
    this.generateGrid();
  }

  generateGrid() {
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.grid[i][j] = new Cell(i, j);
      }
    }
  }

  generateMaze() {
    console.log("class.generateMaze()");
    const stack = [];
    const startCell = this.grid[this.startRow][this.startColumn];
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
      const currentCell = stack.pop();

      const neighbors = [];

      // Select north neighbor
      if (currentCell.row > 0 && this.grid[currentCell.row - 1][currentCell.column].visited === false) {
        console.log("Adding north!");
        neighbors.push({ cell: this.grid[currentCell.row - 1][currentCell.column], direction: "north" });
      }
      // Select east neighbor
      if (
        currentCell.column < this.columns - 1 &&
        this.grid[currentCell.row][currentCell.column + 1].visited === false
      ) {
        console.log("Adding east!");
        neighbors.push({ cell: this.grid[currentCell.row][currentCell.column + 1], direction: "east" });
      }
      // Select west neighbor
      if (currentCell.column > 0 && this.grid[currentCell.row][currentCell.column - 1].visited === false) {
        console.log("Adding west!");
        neighbors.push({ cell: this.grid[currentCell.row][currentCell.column - 1], direction: "west" });
      }
      // Select south neighbor
      if (
        currentCell.row < this.rows - 1 &&
        this.grid[currentCell.row + 1][currentCell.column].visited === false
      ) {
        console.log("Adding south!");
        neighbors.push({ cell: this.grid[currentCell.row + 1][currentCell.column], direction: "south" });
      }

      if (neighbors.length > 0) {
        const randomIndex = Math.floor(Math.random() * neighbors.length);
        const { cell, direction } = neighbors[randomIndex];

        switch (direction) {
          case "north":
            currentCell.north = false;
            cell.south = false;
            break;
          case "east":
            currentCell.east = false;
            cell.west = false;
            break;
          case "south":
            currentCell.south = false;
            cell.north = false;
            break;
          case "west":
            currentCell.west = false;
            cell.east = false;
            break;
        }

        cell.visited = true;
        stack.push(cell);
      }
    }
    return {
      rows: this.rows,
      cols: this.columns,
      start: { row: this.startRow, col: this.startColumn },
      goal: { row: this.goalRow, col: this.goalColumn },
      maze: this.grid.map((row) =>
        row.map((cell) => ({
          row: cell.row,
          col: cell.column,
          north: cell.north,
          east: cell.east,
          west: cell.west,
          south: cell.south,
        }))
      ),
    };
  }
}

// ********** VIEW **********

function startListening() {
  console.log("startListening()");
  const generateMazeBtn = document.querySelector("#generate-maze-btn");
  generateMazeBtn.addEventListener("click", generateMaze);
}

function generateMaze() {
  console.log("generateMaze()");

  const mazeRows = document.querySelector("#maze-rows").value;
  const mazeColumns = document.querySelector("#maze-columns").value;
  const startRow = document.querySelector("#start-row").value;
  const startColumn = document.querySelector("#start-column").value;
  const goalRow = document.querySelector("#goal-row").value;
  const goalColumn = document.querySelector("#goal-column").value;

  const maze = new Maze(mazeRows, mazeColumns, startRow, startColumn, goalRow, goalColumn);

  const mazeJSON = maze.generateMaze();

  console.log(JSON.stringify(mazeJSON, null, 2));
}
