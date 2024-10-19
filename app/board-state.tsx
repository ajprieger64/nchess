import HalfboardState from "./halfboard-state";
import { ChessPiece } from "./pieces";
import SquareIndex from "./square-index";

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

  _normalizeIndex(index: SquareIndex, fromIndex: SquareIndex) {
    if (
      index.pseudoRank < 0 ||
      index.pseudoRank >= BoardState.NUM_PSEUDO_RANKS_PER_FILE ||
      index.pseudoFile < 0 ||
      index.pseudoFile >= BoardState.NUM_PSEUDO_RANKS_PER_FILE
    ) {
      // We're off the board
      return [];
    }
    if (index.pseudoRank < HalfboardState.NUM_PSEUDO_RANKS) {
      // We're still in the same halfboard
      return [index];
    }
    // We're on the opposite halfboard
    if (
      (fromIndex.pseudoFile < HalfboardState.MIDDLE_FILE &&
        HalfboardState.MIDDLE_FILE <= index.pseudoFile) ||
      (HalfboardState.MIDDLE_FILE <= fromIndex.pseudoFile &&
        index.pseudoFile < HalfboardState.MIDDLE_FILE)
    ) {
      // We've crossed the center of the board
      return [...Array(this.n).keys()]
        .map((halfboardIndex) => {
          return new SquareIndex(
            halfboardIndex,
            BoardState.NUM_PSEUDO_RANKS_PER_FILE - index.pseudoRank - 1,
            BoardState.NUM_PSEUDO_RANKS_PER_FILE - index.pseudoFile - 1
          );
        })
        .filter(
          (normalizedIndex) => normalizedIndex.halfboard !== index.halfboard
        );
    }
    // We're on the corresponding opposite halfboard
    return [
      new SquareIndex(
        (((index.halfboard +
          (index.pseudoFile < HalfboardState.MIDDLE_FILE ? 1 : -1)) %
          this.n) +
          this.n) %
          this.n,
        BoardState.NUM_PSEUDO_RANKS_PER_FILE - index.pseudoRank - 1,
        HalfboardState.NUM_PSEUDO_FILES - index.pseudoFile - 1
      ),
    ];
  }

  _getLines<T extends { [direction: string]: [number, number] }>(
    from: SquareIndex,
    directions: T
  ) {
    const lines: { [direction: string]: SquareIndex[][] } = {};
    for (let [direction, [pseudoRankDelta, pseudoFileDelta]] of Object.entries(
      directions
    )) {
      const line: SquareIndex[][] = [[from]];
      let isLineFinished = false;
      while (!isLineFinished) {
        for (const [lineIndex, subline] of line.entries()) {
          const currentSquareIndex = subline[subline.length - 1];
          const nextIndex = new SquareIndex(
            currentSquareIndex.halfboard,
            currentSquareIndex.pseudoRank + pseudoRankDelta,
            currentSquareIndex.pseudoFile + pseudoFileDelta
          );
          const normalizedIndices = this._normalizeIndex(
            nextIndex,
            currentSquareIndex
          );
          if (normalizedIndices.length === 0) {
            // All sublines must have the same length, so this works
            isLineFinished = true;
          } else if (normalizedIndices.length === 1) {
            line[lineIndex].push(normalizedIndices[0]);
            if (normalizedIndices[0].halfboard !== nextIndex.halfboard) {
              pseudoRankDelta = -pseudoRankDelta;
              pseudoFileDelta = -pseudoFileDelta;
            }
          } else {
            // Modifying line here would cause concurrent modification issues
            // But it's fine because we break at the end
            line.splice(lineIndex, 1);
            for (const normalizedIndex of normalizedIndices) {
              line.push(subline.slice().concat([normalizedIndex]));
            }
            pseudoRankDelta = -pseudoRankDelta;
            pseudoFileDelta = -pseudoFileDelta;
            break;
          }
        }
      }
      lines[direction] = line
        .map((subline) => subline.slice(1)) // Remove the starting square
        .filter((subline) => subline.length); // Remove empty directions
    }
    return lines as { [direction in keyof T]: SquareIndex[][] };
  }

  _getDiagonals(from: SquareIndex) {
    return this._getLines(from, {
      "up-right": [1, 1],
      "down-right": [-1, 1],
      "down-left": [-1, -1],
      "up-left": [1, -1],
    });
  }

  _getStraights(from: SquareIndex) {
    return this._getLines(from, {
      forward: [1, 0],
      backward: [-1, 0],
      left: [0, -1],
      right: [0, 1],
    });
  }

  _getLShapes(from: SquareIndex) {
    const CANONICAL_KNIGHT_DIRECTIONS = [
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1],
      [-1, 2],
    ];
    const canonicalKnightMoves = [];
    for (const [
      pseudoRankDelta,
      pseudoFileDelta,
    ] of CANONICAL_KNIGHT_DIRECTIONS) {
      const canonicalKnightMove = new SquareIndex(
        from.halfboard,
        from.pseudoRank + pseudoRankDelta,
        from.pseudoFile + pseudoFileDelta
      );
      canonicalKnightMoves.push(canonicalKnightMove);
    }
    const knightMoves = canonicalKnightMoves.map((move) =>
      this._normalizeIndex(move, from)
    );
    return knightMoves.flat();
  }

  _truncateLines(lines: SquareIndex[][], forPlayer: number) {
    return lines.map((line) => {
      const truncatedLine: SquareIndex[] = [];
      for (const square of line) {
        const piece = this.getPiece(square);
        if (piece?.player !== forPlayer) {
          truncatedLine.push(square);
        }
        if (piece !== null) {
          return truncatedLine;
        }
      }
      return truncatedLine;
    });
  }

  _getUnobstructedMoves(from: SquareIndex, piece = this.getPiece(from)) {
    if (piece === null) return [];
    const diagonals = this._getDiagonals(from);
    const straights = this._getStraights(from);
    const lShapes = this._getLShapes(from);
    let unobstructedMoves: SquareIndex[];
    switch (piece.pieceType) {
      case "K":
        const flattenedLines = Object.values(straights)
          .flat()
          .concat(Object.values(diagonals).flat());
        const singleSteps = flattenedLines.map((line) => [line[0]]);
        const truncatedSingleSteps = this._truncateLines(
          singleSteps,
          piece.player
        );
        unobstructedMoves = truncatedSingleSteps.flat();
        break;
      case "Q":
        unobstructedMoves = this._getUnobstructedMoves(from, {
          pieceType: "B",
          player: piece.player,
        }).concat(
          this._getUnobstructedMoves(from, {
            pieceType: "R",
            player: piece.player,
          })
        );
        break;
      case "R":
        const flattenedStraights = Object.values(straights).flat();
        unobstructedMoves = this._truncateLines(
          flattenedStraights,
          piece.player
        ).flat();
        break;
      case "B":
        const flattenedDiagonals = Object.values(diagonals).flat();
        unobstructedMoves = this._truncateLines(
          flattenedDiagonals,
          piece.player
        ).flat();
        break;
      case "N":
        unobstructedMoves = lShapes.filter(
          (square) => this.getPiece(square)?.player !== piece.player
        );
        break;
      case "p":
        const stepsForward = this._truncateLines(
          (piece.player === from.halfboard
            ? straights.forward
            : straights.backward
          ).map((line) =>
            line.slice(
              0,
              piece.player === from.halfboard && from.pseudoRank === 1 ? 2 : 1
            )
          ),
          piece.player
        )
          .flat()
          .filter((square) => this.getPiece(square) === null);
        const singleStepDiagonallyForward = (
          piece.player === from.halfboard
            ? diagonals["up-left"].concat(diagonals["up-right"])
            : diagonals["down-left"].concat(diagonals["down-right"])
        )
          .map((line) => line[0])
          .filter(
            (square) =>
              (this.getPiece(square)?.player ?? piece.player) !== piece.player
          );
        unobstructedMoves = stepsForward.concat(singleStepDiagonallyForward);
        break;
    }
    return unobstructedMoves;
  }

  _isInCheck(player: number) {
    let kingIndex: SquareIndex | null = null;
    for (const boardIndex of this) {
      const piece = this.getPiece(boardIndex);
      if (piece?.pieceType === "K" && piece.player === player) {
        kingIndex = boardIndex;
        break;
      }
    }
    if (kingIndex === null) {
      return true;
    }
    for (const boardIndex of this) {
      const piece = this.getPiece(boardIndex);
      if (piece?.player !== player) {
        const threatenedSquares = this._getUnobstructedMoves(boardIndex, piece);
        if (threatenedSquares.some((square) => square.equals(kingIndex))) {
          return true;
        }
      }
    }
    return false;
  }

  getLegalMoves(from: SquareIndex, piece = this.getPiece(from)) {
    if (piece === null) return [];
    const unobstructedMoves = this._getUnobstructedMoves(from, piece);
    return unobstructedMoves.filter((square) => {
      const boardAfterMove = this.move(from, square);
      return !boardAfterMove._isInCheck(piece.player);
    });
  }

  isLegalMove(from: SquareIndex, to: SquareIndex) {
    const legalMoves = this.getLegalMoves(from);
    if (legalMoves.every((square) => !square.equals(to))) {
      return false;
    }
    return true;
  }

  _hasLegalMoves(player: number) {
    for (const boardIndex of this) {
      const piece = this.getPiece(boardIndex);
      if (piece?.player === player) {
        const legalMoves = this.getLegalMoves(boardIndex, piece);
        if (legalMoves.length) return true;
      }
    }
    return false;
  }

  isCheckmated(player: number) {
    return this._isInCheck(player) && !this._hasLegalMoves(player);
  }

  isStalemated(player: number) {
    return !this._isInCheck(player) && !this._hasLegalMoves(player);
  }
}
