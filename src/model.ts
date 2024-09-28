import { initial_config1, initial_config2, initial_config3 } from './syllable';
import { GradeController } from './boundary';

export class Coordinate {
    readonly row: number;
    readonly column: number;

    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }
}

export class Piece {
    label: string;
    row: number;
    column: number;
    isGreen: boolean;
    isScored: boolean;
    number: number;
  
    constructor(label: string, number: number) {
        this.row = 0;
        this.column = 0;
        this.label = label;
        this.isGreen = false;
        this.isScored = false; 
        this.number = number;
    }
  
    place(row: number, col: number) {
        this.row = row;
        this.column = col;
    }
  
    location(): Coordinate {
        return new Coordinate(this.row, this.column);
    }
  
    markAsGraded() {
        this.isGreen = true;
    }
  
    resetGrading() {
        this.isGreen = false;
    }
  
    markAsScored() {
        this.isScored = true;
    }
  
    resetScoring() {
        this.isScored = false;
    }
}

export class Puzzle {
    readonly numRows: number;
    readonly numColumns: number;
    pieces: Piece[][];

    constructor(numRows: number, numColumns: number) {
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.pieces = Array.from({ length: numRows }, () => Array(numColumns).fill(new Piece('', 0)));
    }

    selectConfig(config: string[][]) {
        let syllableNumber = 0;

        this.pieces = config.map((row, rowIndex) =>
            row.map((label, colIndex) => {
                const piece = new Piece(label, syllableNumber);
                syllableNumber++;
                return piece;
            })
        );
    }
}

export class Model {
    puzzle: Puzzle;
    numMoves: number;
    numGrades: number;
    selectedConfigIndex: number;
    gradeController: GradeController;

    constructor() {
        this.puzzle = new Puzzle(4, 4);
        this.numMoves = 0;
        this.numGrades = 0;
        this.selectedConfigIndex = 1;
        this.gradeController = new GradeController(this);
    }

    initialize(info: any) {
        const numRows = parseInt(info.board.rows);
        const numColumns = parseInt(info.board.columns);

        this.puzzle = new Puzzle(numRows, numColumns);
        this.numMoves = 0;
        this.numGrades = 0;
    }

    selectConfig(configIndex: number) {
        this.selectedConfigIndex = configIndex;
        let config: string[][];

        switch (configIndex) {
            case 1:
                config = initial_config1;
                break;
            case 2:
                config = initial_config2;
                break;
            case 3:
                config = initial_config3;
                break;
            default:
                config = Array.from({ length: 4 }, () => Array(4).fill(''));
                break;
        }

        this.puzzle.selectConfig(config);
        this.numGrades = 0;
    }

    resetPuzzle() {
        this.selectConfig(this.selectedConfigIndex);
        this.numMoves = 0;
        this.numGrades = 0;
    }
}
