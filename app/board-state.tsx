import HalfboardState from "./halfboard-state";

export class SquareIndex {
  readonly halfboard: number;
  readonly pseudoRank: number;
  readonly pseudoFile: number;

  constructor(halfboard: number, pseudoRank: number, pseudoFile: number) {
    this.halfboard = halfboard;
    this.pseudoRank = pseudoRank;
    this.pseudoFile = pseudoFile;
  }

  equals(other: SquareIndex) {
    return (
      this.halfboard === other.halfboard &&
      this.pseudoRank === other.pseudoRank &&
      this.pseudoFile === other.pseudoFile
    );
  }

  normalize(from: SquareIndex, boardState: BoardState) {
    if (
      0 <= this.pseudoRank &&
      this.pseudoRank < HalfboardState.NUM_PSEUDO_RANKS &&
      0 <= this.pseudoFile &&
      this.pseudoFile < HalfboardState.NUM_PSEUDO_FILES
    ) {
      // Still in the same halfboard
      return [this];
    } else if (
      HalfboardState.NUM_PSEUDO_RANKS <= this.pseudoRank &&
      this.pseudoRank < BoardState.NUM_PSEUDO_RANKS_PER_FILE &&
      0 <= this.pseudoFile &&
      this.pseudoFile < HalfboardState.NUM_PSEUDO_FILES
    ) {
      // We're on an opposite halfboard
      if (
        from.pseudoRank < HalfboardState.NUM_PSEUDO_RANKS &&
        HalfboardState.NUM_PSEUDO_RANKS <= this.pseudoRank &&
        ((from.pseudoFile < HalfboardState.RIGHT_MIDDLE_FILE &&
          HalfboardState.LEFT_MIDDLE_FILE < this.pseudoFile) ||
          (this.pseudoFile < HalfboardState.RIGHT_MIDDLE_FILE &&
            HalfboardState.LEFT_MIDDLE_FILE < from.pseudoFile))
      ) {
        // We've crossed the center of the board
        const normalizedSquares: SquareIndex[] = [];
        for (
          let halfboardIndex = 0;
          halfboardIndex < boardState.n;
          halfboardIndex++
        ) {
          if (halfboardIndex == this.halfboard) continue;
          normalizedSquares.push(
            new SquareIndex(
              halfboardIndex,
              BoardState.NUM_PSEUDO_RANKS_PER_FILE - this.pseudoRank - 1,
              HalfboardState.NUM_PSEUDO_FILES - this.pseudoFile - 1
            )
          );
        }
        return normalizedSquares;
      }
      return [
        new SquareIndex(
          (((from.halfboard +
            (this.pseudoFile < HalfboardState.RIGHT_MIDDLE_FILE ? 1 : -1)) %
            boardState.n) +
            boardState.n) %
            boardState.n,
          BoardState.NUM_PSEUDO_RANKS_PER_FILE - this.pseudoRank - 1,
          HalfboardState.NUM_PSEUDO_FILES - this.pseudoFile - 1
        ),
      ];
    } else {
      // We're off the board
      return [];
    }
  }
}

export default class BoardState {
  static NUM_PSEUDO_RANKS_PER_FILE = 8;
  n: number;
  halfboards: Array<HalfboardState>;
  currentPlayerTurn: number;
  constructor(n: number) {
    this.n = n;
    this.halfboards = Array();
    for (let i = 0; i < n; i++) {
      this.halfboards.push(new HalfboardState(i));
    }
    this.currentPlayerTurn = 0;
  }

  deepCopy() {
    const newBoard = new BoardState(this.n);
    this.halfboards.forEach(
      (halfboard, halfboardIndex) =>
        (newBoard.halfboards[halfboardIndex] = halfboard.deepCopy())
    );
    newBoard.currentPlayerTurn = this.currentPlayerTurn;
    return newBoard;
  }

  getPiece(square: SquareIndex) {
    return this.halfboards[square.halfboard].pieces[square.pseudoRank][
      square.pseudoFile
    ];
  }

  move(from: SquareIndex, to: SquareIndex) {
    const newBoard = this.deepCopy();
    const fromSquare =
      newBoard.halfboards[from.halfboard].pieces[from.pseudoRank][
        from.pseudoFile
      ];
    newBoard.halfboards[to.halfboard].pieces[to.pseudoRank][to.pseudoFile] =
      fromSquare;
    newBoard.halfboards[from.halfboard].pieces[from.pseudoRank][
      from.pseudoFile
    ] = null;
    newBoard.currentPlayerTurn++;
    newBoard.currentPlayerTurn %= newBoard.n;
    return newBoard;
  }

  getKingIndex(player: number): SquareIndex {
    for (const boardIndex of this) {
      const piece = this.getPiece(boardIndex);
      if (piece?.pieceType === "K" && piece.player === player) {
        return boardIndex;
      }
    }
    throw Error("King could not be found on the board.");
  }

  *[Symbol.iterator]() {
    for (let halfboardIndex = 0; halfboardIndex < this.n; halfboardIndex++) {
      for (
        let pseudoRankIndex = 0;
        pseudoRankIndex < HalfboardState.NUM_PSEUDO_RANKS;
        pseudoRankIndex++
      ) {
        for (
          let pseudoFileIndex = 0;
          pseudoFileIndex < HalfboardState.NUM_PSEUDO_FILES;
          pseudoFileIndex++
        ) {
          const boardIndex = new SquareIndex(
            halfboardIndex,
            pseudoRankIndex,
            pseudoFileIndex
          );
          yield boardIndex;
        }
      }
    }
  }
}
