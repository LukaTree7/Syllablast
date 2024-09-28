import { expect, test, vi } from 'vitest'
import { Coordinate, Piece, Puzzle, Model } from './model'
import { initial_config1, initial_config2, initial_config3, Config1, Config2, Config3 } from './syllable';
import { SwapController, UndoController, GradeController } from './boundary'

//SwapController
test('should initialize SwapController with a model', () => {
    const model = new Model();
    const swapController = new SwapController(model);

    expect(swapController.model).toBe(model);
    expect(swapController.swapHistory).toEqual([]);
    expect(swapController.selectedCells).toEqual([]);
});

test('should handle cell click and swap cells', () => {
    const model = new Model();
    model.selectConfig(1);
    const swapController = new SwapController(model);

    swapController.handleCellClick(0, 0);
    expect(swapController.selectedCells).toEqual([{ row: 0, col: 0 }]);

    swapController.handleCellClick(1, 1);

    expect(model.puzzle.pieces[0][0].label).toBe('in'); 
    expect(model.puzzle.pieces[1][1].label).toBe('ter'); 
    expect(swapController.swapHistory.length).toBe(1);
});

test('should increment numMoves on swap', () => {
    const model = new Model();
    model.selectConfig(1);
    const swapController = new SwapController(model);

    expect(model.numMoves).toBe(0);
    swapController.handleCellClick(0, 0);
    swapController.handleCellClick(1, 1);

    expect(model.numMoves).toBe(1);
});

test('should record swap history correctly', () => {
    const model = new Model();
    model.selectConfig(1);
    const swapController = new SwapController(model);

    swapController.handleCellClick(0, 0);
    swapController.handleCellClick(1, 1);

    expect(swapController.getSwapHistory()).toEqual([{ row1: 0, col1: 0, row2: 1, col2: 1 }]);
});

test('should reset swap controller state', () => {
    const model = new Model();
    model.selectConfig(1);
    const swapController = new SwapController(model);

    swapController.handleCellClick(0, 0);
    swapController.handleCellClick(1, 1);

    expect(swapController.swapHistory.length).toBe(1);
    expect(model.numMoves).toBe(1);

    swapController.reset();

    expect(swapController.swapHistory.length).toBe(0);
    expect(model.numMoves).toBe(0);
    expect(swapController.selectedCells).toEqual([]);
});


//UndoController
test('should initialize UndoController with a SwapController', () => {
    const model = new Model();
    const swapController = new SwapController(model);
    const undoController = new UndoController(swapController);
    
    expect(undoController.model).toBe(model);
    expect(undoController.swapController).toBe(swapController);
});

test('should undo last move correctly', () => {
    const model = new Model();
    model.selectConfig(1);
    const swapController = new SwapController(model);
    const undoController = new UndoController(swapController);
    
    swapController.handleCellClick(0, 0);
    swapController.handleCellClick(1, 1);
    expect(model.puzzle.pieces[0][0].label).toBe('in');
    expect(model.puzzle.pieces[1][1].label).toBe('ter');
    expect(model.numMoves).toBe(1);
    
    undoController.undoMove();
    
    expect(model.puzzle.pieces[0][0].label).toBe('ter');
    expect(model.puzzle.pieces[1][1].label).toBe('in');
    expect(model.numMoves).toBe(0);
});

test('should not undo if no moves in history', () => {
    const model = new Model();
    const swapController = new SwapController(model);
    const undoController = new UndoController(swapController);
    
    const initialMoveCount = model.numMoves;
    undoController.undoMove();
    
    expect(model.numMoves).toBe(initialMoveCount);
});

test('should decrement numMoves correctly when undoing multiple moves', () => {
    const model = new Model();
    model.selectConfig(1);
    const swapController = new SwapController(model);
    const undoController = new UndoController(swapController);
    
    swapController.handleCellClick(0, 0);
    swapController.handleCellClick(1, 1);
    swapController.handleCellClick(0, 1);
    swapController.handleCellClick(1, 0);

    expect(model.numMoves).toBe(2);
    
    undoController.undoMove();
    expect(model.numMoves).toBe(1);

    undoController.undoMove();
    expect(model.numMoves).toBe(0);
});


//GradeController
test('should initialize GradeController with the default config', () => {
    const model = new Model();
    const gradeController = new GradeController(model);

    expect(gradeController['config']).toBe(initial_config1);
});

test('should select correct configuration based on configIndex', () => {
    const model = new Model();
    const gradeController = new GradeController(model);

    gradeController.selectConfig(1);
    expect(gradeController['config']).toBe(Config1);

    gradeController.selectConfig(2);
    expect(gradeController['config']).toBe(Config2);

    gradeController.selectConfig(3);
    expect(gradeController['config']).toBe(Config3);

    gradeController.selectConfig(0);
    expect(gradeController['config']).toBe(initial_config1);
});

test('should grade puzzle correctly', () => {
    const model = new Model();
    const gradeController = new GradeController(model);

    model.selectConfig(1); 
    gradeController.selectConfig(1);

    model.puzzle.pieces[0][0].label = Config1[0][0];
    model.puzzle.pieces[0][1].label = Config1[0][1];
    model.puzzle.pieces[1][0].label = Config1[1][0];
    model.puzzle.pieces[1][1].label = Config1[1][1];

    gradeController.gradePuzzle();

    expect(model.numGrades).toBe(4);
    expect(model.puzzle.pieces[0][0].isScored).toBe(true);
    expect(model.puzzle.pieces[0][1].isScored).toBe(true);
    expect(model.puzzle.pieces[1][0].isScored).toBe(true);
    expect(model.puzzle.pieces[1][1].isScored).toBe(true);
});

test('should reset puzzle and grading correctly', () => {
    const model = new Model();
    const gradeController = new GradeController(model);

    gradeController.gradePuzzle();
    expect(model.numGrades).toBe(0);

    model.puzzle.pieces[0][0].isScored = true;
    model.puzzle.pieces[0][1].isScored = true;
    model.numGrades = 2;

    gradeController.resetGame();
    expect(model.numGrades).toBe(0);
    expect(model.numMoves).toBe(0);
    expect(model.puzzle.pieces[0][0].isScored).toBe(false);
    expect(model.puzzle.pieces[0][1].isScored).toBe(false);
});

test('should return correct label positions map from the config', () => {
    const model = new Model();
    const gradeController = new GradeController(model);

    const positionsMap = gradeController['getLabelPositionsMap'](initial_config1);

    expect(positionsMap.get('wa')).toEqual([[3, 3]]);
    expect(positionsMap.get('ate')).toEqual([[0, 1]]);
    expect(positionsMap.get('ter')).toEqual([[0, 0]]);
});

test('should alert on victory when puzzle is fully graded', () => {
    const model = new Model();
    const gradeController = new GradeController(model);
    
    model.selectConfig(1); 
    gradeController.selectConfig(1);
    
    vi.spyOn(global, 'alert').mockImplementation(() => {});
    
    for (let row = 0; row < model.puzzle.numRows; row++) {
        for (let col = 0; col < model.puzzle.numColumns; col++) {
            model.puzzle.pieces[row][col].label = Config1[row][col];
        }
    }
    
    gradeController.gradePuzzle();
    
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Congratulations on your victory!'));
    expect(model.numGrades).toBe(0);
    expect(model.numMoves).toBe(0);
    
    vi.restoreAllMocks();
});