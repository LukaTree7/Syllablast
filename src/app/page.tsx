"use client";

import React, { useState, useRef, useEffect } from 'react';
import './globals.css';
import { Model } from '../model';
import { SwapController, GradeController, UndoController } from '../boundary';

const Page: React.FC = () => {
  const [model] = useState(new Model());
  const [tableData, setTableData] = useState<string[][]>(Array(4).fill(Array(4).fill('')));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [swapController] = useState(new SwapController(model));
  const [gradeController] = useState(new GradeController(model));
  const [undoController] = useState(new UndoController(swapController));
  const [isConfigSelected, setIsConfigSelected] = useState(false);
  const [selectedConfigIndex, setSelectedConfigIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTableData(model.puzzle.pieces.map(row => row.map(piece => piece.label)));
  }, [model.puzzle.pieces]);

  const handleSelectConfig = (configIndex: number) => {
    model.selectConfig(configIndex);
    gradeController.selectConfig(configIndex);
    model.numMoves = 0;
    model.numGrades = 0;
    setTableData(model.puzzle.pieces.map(row => row.map(piece => piece.label)));
    setDropdownVisible(false);
    setIsConfigSelected(true);
    setSelectedConfigIndex(configIndex);
    gradeController.resetGrades();
    gradeController.gradePuzzle();
    updateTableWithColors();
  };

  const handleReset = () => {
    if (selectedConfigIndex !== null) {
      model.selectConfig(selectedConfigIndex);
      gradeController.selectConfig(selectedConfigIndex);
    }
    swapController.reset();
    setTableData(model.puzzle.pieces.map(row => row.map(piece => piece.label)));
  };

  const handleUndo = () => {
    undoController.undoMove();
    gradeController.gradePuzzle();
    setTableData(model.puzzle.pieces.map(row => row.map(piece => piece.label)));
    updateTableWithColors();
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isConfigSelected) {
      alert('Please select a config first.');
      return;
    }

    swapController.handleCellClick(row, col);
    setTableData(model.puzzle.pieces.map(row => row.map(piece => piece.label)));

    if (selectedCell && (selectedCell.row !== row || selectedCell.col !== col)) {
      setSelectedCell(null);
    } else if (!selectedCell) {
      setSelectedCell({ row, col });
    } else {
      setSelectedCell(null);
    }

    gradeController.gradePuzzle();
    updateTableWithColors();
  };

  const updateTableWithColors = () => {
    setTableData(model.puzzle.pieces.map(row =>
      row.map(piece => {
        if (piece.isScored) {
          return `${piece.label}`;
        }
        return piece.label;
      })
    ));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <div className="table-container">
        <table>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    onClick={() => handleCellClick(rowIndex, cellIndex)}
                    className={
                      selectedCell?.row === rowIndex && selectedCell?.col === cellIndex
                        ? 'selected-cell'
                        : model.puzzle.pieces[rowIndex][cellIndex].isScored
                        ? 'light-green'
                        : ''
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="right-container">
        <div className="text-container">
          <h4>Number of Moves: {model.numMoves}</h4>
          <h4>Number of Grades: {model.numGrades}</h4>
        </div>

        <div className="button-container">
          <button onClick={toggleDropdown}>Config</button>
          {dropdownVisible && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <button onClick={() => handleSelectConfig(1)}>Config 1</button>
              <button onClick={() => handleSelectConfig(2)}>Config 2</button>
              <button onClick={() => handleSelectConfig(3)}>Config 3</button>
            </div>
          )}
        </div>

        <div className="button-container">
          <button onClick={handleReset} disabled={!isConfigSelected}>
            Reset
          </button>

          <button onClick={handleUndo} disabled={model.numMoves <= 0}>
            Undo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
