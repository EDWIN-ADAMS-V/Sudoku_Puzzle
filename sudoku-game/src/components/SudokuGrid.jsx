import React from 'react';
import Cell from './Cell';
import './SudokuGrid.css';

function SudokuGrid({ board, onCellChange, readOnlyMap }) {
  return (
    <div className="sudoku-grid">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((value, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              readOnly={readOnlyMap[rowIndex][colIndex]}
              onChange={onCellChange}
              row={rowIndex}
              col={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SudokuGrid;
