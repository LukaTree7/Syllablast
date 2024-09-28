import { expect, test } from 'vitest'
import { Coordinate, Piece, Puzzle, Model } from './model'
import { initial_config1, initial_config2, initial_config3, Config1, Config2, Config3 } from './syllable';
import { GradeController } from './boundary'


// Coordinate
test('Coordinate', () => {
  let c1 = new Coordinate(4, 4)
  expect(c1.row).toBe(4)
  expect(c1.column).toBe(4)
})


//Piece
test('should create a piece with the correct label and number', () => {
    const piece = new Piece('A', 1);
    expect(piece.label).toBe('A');
    expect(piece.number).toBe(1);
    expect(piece.row).toBe(0);
    expect(piece.column).toBe(0);
    expect(piece.isGreen).toBe(false);
    expect(piece.isScored).toBe(false);
});

test('should place the piece in the specified location', () => {
    const piece = new Piece('B', 2);
    piece.place(2, 3);
    expect(piece.row).toBe(2);
    expect(piece.column).toBe(3);
});

test('should return the correct location', () => {
    const piece = new Piece('C', 3);
    piece.place(1, 1);
    const location = piece.location();
    expect(location.row).toBe(1);
    expect(location.column).toBe(1);
});

test('should mark the piece as graded', () => {
    const piece = new Piece('D', 4);
    piece.markAsGraded();
    expect(piece.isGreen).toBe(true);
});

test('should reset grading status', () => {
    const piece = new Piece('E', 5);
    piece.markAsGraded();
    piece.resetGrading();
    expect(piece.isGreen).toBe(false);
});

test('should mark the piece as scored', () => {
    const piece = new Piece('F', 6);
    piece.markAsScored();
    expect(piece.isScored).toBe(true);
});

test('should reset scoring status', () => {
    const piece = new Piece('G', 7);
    piece.markAsScored();
    piece.resetScoring();
    expect(piece.isScored).toBe(false);
});


//Puzzle
test('should create a puzzle with the correct dimensions', () => {
    const puzzle = new Puzzle(3, 4);
    expect(puzzle.numRows).toBe(3);
    expect(puzzle.numColumns).toBe(4);
    expect(puzzle.pieces.length).toBe(3);
    expect(puzzle.pieces[0].length).toBe(4);
});

test('should initialize pieces with empty values', () => {
    const puzzle = new Puzzle(2, 2);
    expect(puzzle.pieces[0][0].label).toBe('');
    expect(puzzle.pieces[0][0].number).toBe(0);
});

test('should select a configuration and populate pieces', () => {
    const puzzle = new Puzzle(2, 2);
    const config = [['A', 'B'], ['C', 'D']];
    puzzle.selectConfig(config);
    
    expect(puzzle.pieces[0][0].label).toBe('A');
    expect(puzzle.pieces[0][1].label).toBe('B');
    expect(puzzle.pieces[1][0].label).toBe('C');
    expect(puzzle.pieces[1][1].label).toBe('D');
    
    expect(puzzle.pieces[0][0].number).toBe(0);
    expect(puzzle.pieces[0][1].number).toBe(1);
    expect(puzzle.pieces[1][0].number).toBe(2);
    expect(puzzle.pieces[1][1].number).toBe(3);
});


//Model
test('should initialize the model with default values', () => {
    const model = new Model();
    expect(model.puzzle).toBeInstanceOf(Puzzle);
    expect(model.numMoves).toBe(0);
    expect(model.numGrades).toBe(0);
    expect(model.selectedConfigIndex).toBe(1);
    expect(model.gradeController).toBeInstanceOf(GradeController);
});

test('should initialize puzzle dimensions correctly', () => {
    const model = new Model();
    expect(model.puzzle.numRows).toBe(4);
    expect(model.puzzle.numColumns).toBe(4);
});

test('should initialize the puzzle with the provided info', () => {
    const model = new Model();
    const info = { board: { rows: '3', columns: '3' } };
    model.initialize(info);
    expect(model.puzzle.numRows).toBe(3);
    expect(model.puzzle.numColumns).toBe(3);
    expect(model.numMoves).toBe(0);
    expect(model.numGrades).toBe(0);
});

test('should select configuration and populate puzzle correctly', () => {
    const model = new Model();
    model.selectConfig(1);
    
    expect(model.selectedConfigIndex).toBe(1);
    expect(model.puzzle.pieces[0][0].label).toBe('ter');
    expect(model.puzzle.pieces[1][0].label).toBe('fil');
    expect(model.puzzle.pieces[0][1].label).toBe('ate');
    expect(model.puzzle.pieces[1][1].label).toBe('in');
    expect(model.numGrades).toBe(0);
});

test('should reset puzzle to selected configuration', () => {
    const model = new Model();
    model.selectConfig(1);
    model.resetPuzzle();

    expect(model.selectedConfigIndex).toBe(1);
    expect(model.numMoves).toBe(0);
    expect(model.numGrades).toBe(0);
    expect(model.puzzle.pieces[0][0].label).toBe('ter');
    expect(model.puzzle.pieces[0][1].label).toBe('ate');
});
