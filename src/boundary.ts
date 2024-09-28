import { initial_config1, initial_config2, initial_config3, Config1, Config2, Config3 } from './syllable';
import { Model } from './model';

export class SwapController {
  model: Model;
  public selectedCells: { row: number; col: number }[] = [];
  public swapHistory: { row1: number; col1: number; row2: number; col2: number }[] = [];

  constructor(model: Model) {
    this.model = model;
  }

  handleCellClick(row: number, col: number) {
    if (this.selectedCells.length === 1) {
      const { row: firstRow, col: firstCol } = this.selectedCells[0];
      this.swapCells(firstRow, firstCol, row, col);
      this.selectedCells = [];
    } else {
      this.selectedCells = [{ row, col }];
    }
  }

  public swapCells(row1: number, col1: number, row2: number, col2: number) {
    const pieces = this.model.puzzle.pieces;
    const temp = pieces[row1][col1];
    pieces[row1][col1] = pieces[row2][col2];
    pieces[row2][col2] = temp;
    this.model.numMoves++;
    this.recordSwap(row1, col1, row2, col2);
  }

  private recordSwap(row1: number, col1: number, row2: number, col2: number) {
    if (this.swapHistory.length === 100) {
      this.swapHistory.shift();
    }
    this.swapHistory.push({ row1, col1, row2, col2 });
  }

  getSwapHistory() {
    return this.swapHistory;
  }

  reset() {
    this.model.resetPuzzle();
    this.model.numMoves = 0;
    this.model.numGrades = 0;
    this.swapHistory = [];
    this.selectedCells = [];
  }
}

export class UndoController {
  model: Model;
  public swapController: SwapController;

  constructor(swapController: SwapController) {
    this.swapController = swapController;
    this.model = swapController.model;
  }

  undoMove() {
    if (this.swapController.swapHistory.length === 0) return;

    const lastSwap = this.swapController.swapHistory.pop()!;
    this.swapController.swapCells(lastSwap.row1, lastSwap.col1, lastSwap.row2, lastSwap.col2);

    this.swapController.model.numMoves -= 2;
    if (this.swapController.swapHistory.length > 0) {
      this.swapController.swapHistory.pop();
    }
  }
}

export class GradeController {
  private model: any;
  private config: string[][];

  constructor(model: any) {
    this.model = model;
    this.config = initial_config1;
  }

  selectConfig(configIndex: number) {
    switch (configIndex) {
      case 1:
        this.config = Config1;
        break;
      case 2:
        this.config = Config2;
        break;
      case 3:
        this.config = Config3;
        break;
      default:
        this.config = initial_config1;
        break;
    }
  }

  gradePuzzle() {
    const puzzle = this.model.puzzle;
    const numRows = puzzle.numRows;
    const numCols = puzzle.numColumns;
    let grade = 0;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            puzzle.pieces[row][col].isScored = false;
        }
    }

    const configLabelPositions = this.getLabelPositionsMap(this.config);
    const scoredCells = new Set<string>();
    const scoredLabels = new Map<string, number>(); 

    for (let row = 0; row < numRows; row++) {
        let canScoreCurrentRow = true;
        let firstScoredTargetRow: number | null = null;

        for (let col = 0; col < numCols; col++) {
            const piece = puzzle.pieces[row][col];
            const cellLabel = piece.label;

            const scoreCount = scoredLabels.get(cellLabel) || 0;

            const positions = configLabelPositions.get(cellLabel) || [];

            let scoredThisCell = false;

            for (const [targetRow, targetCol] of positions) {
                if (col === 0) {
                    if (this.canScoreCell(row, col, targetRow, targetCol, scoredCells)) {
                        piece.markAsScored();
                        scoredCells.add(`${row},${col}`);
                        grade++;
                        scoredLabels.set(cellLabel, scoreCount + 1); 
                        scoredThisCell = true;
                        canScoreCurrentRow = true;
                        firstScoredTargetRow = targetRow;
                        break;
                    } else {
                        canScoreCurrentRow = false;
                    }
                } else if (canScoreCurrentRow && puzzle.pieces[row][col - 1].isScored) {
                    if (this.canScoreCell(row, col, targetRow, targetCol, scoredCells) &&
                        targetRow === firstScoredTargetRow) {
                        piece.markAsScored();
                        scoredCells.add(`${row},${col}`);
                        grade++;
                        scoredLabels.set(cellLabel, scoreCount + 1); 
                        scoredThisCell = true;
                        break;
                    } else {
                        canScoreCurrentRow = false;
                    }
                }
            }

            if (!scoredThisCell) {
                for (const [targetRow, targetCol] of positions) {
                    if (this.canScoreCell(row, col, targetRow, targetCol, scoredCells) &&
                        targetRow === firstScoredTargetRow && 
                        puzzle.pieces[row][col - 1].isScored &&
                        scoreCount < positions.length) { 
                        piece.markAsScored();
                        scoredCells.add(`${row},${col}`);
                        grade++;
                        scoredLabels.set(cellLabel, scoreCount + 1); 
                        break;
                    }
                }
            }
        }
    }

    this.model.numGrades = grade;

    if (this.model.numGrades === 16) {
        alert(`Congratulations on your victory!\nNumber of Moves: ${this.model.numMoves}\nNumber of Grades: ${this.model.numGrades}`);
        this.resetGame();
    }
  }


  resetGame() {
    this.model.resetPuzzle();
    this.model.numMoves = 0;
    this.model.numGrades = 0;
    this.resetGrades();
  }

  private getLabelPositionsMap(matrix: string[][]): Map<string, [number, number][]> {
    const map = new Map<string, [number, number][]>();
    if (!matrix) return map;
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        const label = matrix[row][col];
        if (!map.has(label)) {
          map.set(label, []);
        }
        map.get(label)?.push([row, col]);
      }
    }
    return map;
  }

  resetGrades() {
    const puzzle = this.model.puzzle;
    for (let row = 0; row < puzzle.numRows; row++) {
      for (let col = 0; col < puzzle.numColumns; col++) {
        puzzle.pieces[row][col].resetGrading();
      }
    }
  }

  private canScoreCell(row: number, col: number, targetRow: number, targetCol: number, scoredCells: Set<string>): boolean {
    return targetCol === col; 
  }
}
