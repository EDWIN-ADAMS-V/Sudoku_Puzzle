import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import classNames from "classnames";

// Easy, Medium, Hard Sudoku puzzles
const puzzles = {
  easy: [
    ["", 7, "", 5, 8, 3, "", 2, ""],
    ["", 5, 9, 2, "", "", 3, "", ""],
    [3, 4, "", "", "", 6, 5, "", 7],
    [7, 9, 5, "", "", "", 6, 3, 2],
    ["", "", 3, 6, 9, 7, 1, "", ""],
    [6, 8, "", "", "", 2, 7, "", ""],
    [9, 1, 4, 8, 3, 5, "", 7, 6],
    ["", 3, "", 7, "", 1, 4, 9, 5],
    [5, 6, 7, 4, 2, 9, "", 1, 3],
  ],
  medium: [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", 1, 9, 5, "", "", ""],
    ["", 9, 8, "", "", "", "", 6, ""],
    [8, "", "", "", 6, "", "", "", 3],
    ["", "", "", 8, "", 3, "", "", ""],
    [7, "", "", "", 2, "", "", "", 6],
    ["", 6, "", "", "", "", 2, 8, ""],
    ["", "", "", 4, 1, 9, "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
  ],
  hard: [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", 3, "", 8, 5],
    ["", "", 1, "", 2, "", "", "", ""],
    ["", "", "", 5, "", 7, "", "", ""],
    ["", "", 4, "", "", "", 1, "", ""],
    ["", 9, "", "", "", "", "", "", ""],
    [5, "", "", "", "", "", "", 7, 3],
    ["", "", 2, "", 1, "", "", "", ""],
    ["", "", "", "", 4, "", "", "", 9],
  ],
};

// Sudoku Solver - backtracking algorithm
function isValid(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
    if (board[x][col] === num) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(x / 3);
    const boxCol = 3 * Math.floor(col / 3) + (x % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === "") {
        for (let num = 1; num <= 9; num++) {
          const val = num.toString();
          if (isValid(board, row, col, val)) {
            board[row][col] = val;
            if (solve(board)) return true;
            board[row][col] = "";
          }
        }
        return false;
      }
    }
  }
  return true;
}

function getSolvedBoard(original) {
  const clone = original.map(row => row.map(cell => (cell === "" ? "" : cell.toString())));
  solve(clone);
  return clone;
}

const App = () => {
  const [board, setBoard] = useState([]);
  const [fixedCells, setFixedCells] = useState([]);
  const [status, setStatus] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [solution, setSolution] = useState([]);

  useEffect(() => {
    loadPuzzle("easy");
  }, []);

  const loadPuzzle = (level) => {
    const puzzle = puzzles[level];
    const newBoard = puzzle.map((row) => row.map((cell) => (cell === "" ? "" : cell.toString())));
    const fixed = puzzle.map((row) => row.map((cell) => cell !== ""));
    setBoard(newBoard);
    setFixedCells(fixed);
    setStatus("");

    const solved = getSolvedBoard(puzzle);
    setSolution(solved);
  };

  const handleChange = (row, col, value) => {
    if (fixedCells[row][col]) return;
    if (!/^[1-9]?$/.test(value)) return;
    const updated = board.map((r) => [...r]);
    updated[row][col] = value;
    setBoard(updated);
  };

  const checkSudoku = () => {
    for (let i = 0; i < 9; i++) {
      const rowSet = new Set();
      const colSet = new Set();
      for (let j = 0; j < 9; j++) {
        const rowVal = board[i][j];
        const colVal = board[j][i];

        if (rowVal === "" || colVal === "") {
          setStatus("⚠️ Fill all the empty cells.");
          return;
        }

        if (rowSet.has(rowVal)) {
          setStatus(`❌ Duplicate in Row ${i + 1}`);
          return;
        }

        if (colSet.has(colVal)) {
          setStatus(`❌ Duplicate in Column ${i + 1}`);
          return;
        }

        rowSet.add(rowVal);
        colSet.add(colVal);
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const gridSet = new Set();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const val = board[boxRow * 3 + i][boxCol * 3 + j];
            if (gridSet.has(val)) {
              setStatus(`❌ Duplicate in 3x3 Box (${boxRow + 1}, ${boxCol + 1})`);
              return;
            }
            gridSet.add(val);
          }
        }
      }
    }

    setStatus("✅ Sudoku is Correct!");
  };

  const resetBoard = () => {
    const reset = board.map((row, i) =>
      row.map((cell, j) => (fixedCells[i][j] ? cell : ""))
    );
    setBoard(reset);
    setStatus("");
  };

  const provideHint = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === "") {
          const newBoard = board.map((row) => [...row]);
          newBoard[i][j] = solution[i][j];
          setBoard(newBoard);
          return;
        }
      }
    }
    setStatus("✅ No hints left. Puzzle already complete.");
  };

  return (
    <div className={classNames(styles.container, darkMode && styles.darkMode)}>
      <h1>🧠Sudoku Game💫</h1>

      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={() => loadPuzzle("easy")}>
          Easy
        </button>
        <button className={styles.button} onClick={() => loadPuzzle("medium")}>
          Hard
        </button>
        
        <button className={styles.button} onClick={checkSudoku}>
          Check
        </button>
        <button className={styles.button} onClick={resetBoard}>
          Reset
        </button>
        <button className={styles.button} onClick={provideHint}>
          Hint
        </button>
        <button className={styles.button} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className={styles.grid}>
        {board.map((row, i) =>
          row.map((cell, j) => {
            const isFixed = fixedCells[i][j];
            return (
              <input
                key={`${i}-${j}`}
                className={classNames(
                  styles.cell,
                  styles.subgridHighlight,
                  isFixed ? styles.fixed : styles.input
                )}
                value={cell}
                onChange={(e) => handleChange(i, j, e.target.value)}
                maxLength="1"
              />
            );
          })
        )}
      </div>

      <div className={styles.status}>{status}</div>
    </div>
  );
};

export default App;
