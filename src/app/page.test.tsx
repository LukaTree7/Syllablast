import { test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import Page from './page';
import { Model, Piece } from '../model'; 


const mockSelectConfig = vi.fn();

const mockGradeController = {
    model: {}, 
    config: {}, 
    selectConfig: vi.fn(), 
    gradePuzzle: vi.fn(), 
    resetGrades: vi.fn(), 
    resetGame: vi.fn(), 
    getLabelPositionsMap: vi.fn(), 
    canScoreCell: vi.fn(), 
};

const mockModelInstance = {
    puzzle: {
        pieces: [
            [new Piece('in', 1), new Piece('vis', 2), new Piece('im', 3), new Piece('mac', 4)],
            [new Piece('af', 5), new Piece('fil', 6), new Piece('un', 7), new Piece('der', 8)],
            [new Piece('x', 9), new Piece('y', 10), new Piece('z', 11), new Piece('w', 12)],
            [new Piece('a', 13), new Piece('b', 14), new Piece('c', 15), new Piece('d', 16)],
        ],
        numRows: 4,
        numColumns: 4,
        selectConfig: mockSelectConfig, 
    },
    numMoves: 0, 
    numGrades: 0, 
    selectedConfigIndex: -1, 
    gradeController: mockGradeController, 
    initialize: vi.fn(), 
    resetPuzzlets: vi.fn(), 
    selectConfig: mockSelectConfig, 
    resetPuzzle: vi.fn(), 
};

vi.mock('../model', async (importOriginal) => {
    const actual = (await importOriginal()) as { Model: typeof Model; Piece: typeof Piece; };
    return {
        Model: vi.fn(() => mockModelInstance), 
        Piece: actual.Piece, 
    };
});

const mockHandleCellClick = vi.fn();

vi.mock('../boundary', () => {
    return {
        SwapController: vi.fn().mockImplementation((model) => ({
            handleCellClick: mockHandleCellClick, 
            selectedCells: [], 
            swapCells: vi.fn(), 
            reset: vi.fn(), 
        })),
        GradeController: vi.fn().mockImplementation(() => ({
            selectConfig: vi.fn(),
            gradePuzzle: vi.fn(),
            resetGrades: vi.fn(), 
            resetGame: vi.fn(),
            getLabelPositionsMap: vi.fn(), 
            canScoreCell: vi.fn(), 
        })),
        UndoController: vi.fn(),
    };
});

test('should render the page with initial state', () => {
    const { getByText } = render(<Page />);
    expect(getByText('Number of Moves: 0')).toBeInTheDocument();
    expect(getByText('Number of Grades: 0')).toBeInTheDocument();
});

test('should select a config and update table data', () => {
    const { getByText } = render(<Page />);
    fireEvent.click(getByText('Config'));
    fireEvent.click(getByText('Config 1'));
    expect(mockSelectConfig).toHaveBeenCalledWith(1);
});

test('should reset the model and table data', () => {
    const { getByText } = render(<Page />);
    fireEvent.click(getByText('Config'));
    fireEvent.click(getByText('Config 1'));
    fireEvent.click(getByText('Reset'));
    expect(mockModelInstance.puzzle.selectConfig).toHaveBeenCalledWith(1);
});

test('should handle undo action', () => {
    const { getByText } = render(<Page />);
    fireEvent.click(getByText('Config'));
    fireEvent.click(getByText('Config 1'));
    fireEvent.click(getByText('in'));
    fireEvent.click(getByText('vis'));
    fireEvent.click(getByText('Undo'));
    expect(mockModelInstance.numMoves).toBe(0);
});
