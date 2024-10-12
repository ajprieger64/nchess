import BoardState, { SquareIndex } from "./board-state";
import HalfboardState from "./halfboard-state";
import { ChessPiece } from "./pieces";

export default class BoardController {
  boardState: BoardState;
  constructor(boardState: BoardState) {
    this.boardState = boardState;
  }

  getDiagonals(from: SquareIndex, forPawnOfPlayer: number | null = null) {
    const diagonals: SquareIndex[][] =
      forPawnOfPlayer === null ? [[], [], [], []] : [[], []];
    const diagonalDirection: (null | [SquareIndex, boolean, boolean])[] =
      forPawnOfPlayer === null
        ? [
            [from, true, true],
            [from, true, false],
            [from, false, false],
            [from, false, true],
          ]
        : [
            [from, forPawnOfPlayer === from.halfboard, true],
            [from, forPawnOfPlayer === from.halfboard, false],
          ];
    for (
      let numSteps = 0;
      (forPawnOfPlayer !== null && numSteps < 1) ||
      (forPawnOfPlayer === null &&
        diagonalDirection.some((value) => value !== null));
      numSteps++
    ) {
      for (
        let diagonalIndex = 0;
        diagonalIndex < diagonalDirection.length;
        diagonalIndex++
      ) {
        const currentSquareAndDirection = diagonalDirection[diagonalIndex];
        if (currentSquareAndDirection === null) {
          continue;
        }
        const [currentSquare, isPseudoRankIncreasing, isPseudoFileIncreasing] =
          currentSquareAndDirection;
        const nextSquare = new SquareIndex(
          currentSquare.halfboard,
          currentSquare.pseudoRank + (isPseudoRankIncreasing ? 1 : -1),
          currentSquare.pseudoFile + (isPseudoFileIncreasing ? 1 : -1)
        );
        const normalizedSquares = nextSquare.normalize(
          currentSquare,
          this.boardState
        );
        if (normalizedSquares.length === 0) {
          // Off the board
          diagonalDirection[diagonalIndex] = null;
        } else if (normalizedSquares.length === 1) {
          // Still in the same halfboard, or went to the corresponding opposite halfboard
          const [normalizedSquare] = normalizedSquares;
          diagonals[diagonalIndex].push(normalizedSquare);
          if (currentSquare.halfboard === normalizedSquare.halfboard) {
            diagonalDirection[diagonalIndex] = [
              normalizedSquare,
              isPseudoRankIncreasing,
              isPseudoFileIncreasing,
            ];
          } else {
            diagonalDirection[diagonalIndex] = [
              normalizedSquare,
              !isPseudoRankIncreasing,
              !isPseudoFileIncreasing,
            ];
          }
        } else {
          // On an opposite halfboard after crossing the center of the board
          const diagonal = diagonals[diagonalIndex];
          diagonals.splice(diagonalIndex, 1);
          diagonalDirection.splice(diagonalIndex, 1);
          for (const normalizedSquare of normalizedSquares) {
            diagonals.unshift(diagonal.slice());
            diagonals[0].push(normalizedSquare);
            diagonalDirection.unshift([
              normalizedSquare,
              !isPseudoRankIncreasing,
              !isPseudoFileIncreasing,
            ]);
          }
          diagonalIndex += normalizedSquares.length - 1;
        }
      }
    }
    return diagonals.filter((diagonal) => diagonal.length);
  }

  getHorizontalsAndVerticals(
    from: SquareIndex,
    forPawnOfPlayer: number | null = null
  ) {
    const horizontalsAndVerticals: SquareIndex[][] = [];
    for (const isPseudoRankIncreasing of [true, false]) {
      const vertical: SquareIndex[] = [];
      horizontalsAndVerticals.push(vertical);
      for (
        let numSteps = 1;
        numSteps < BoardState.NUM_PSEUDO_RANKS_PER_FILE;
        numSteps++
      ) {
        const nextSquare = new SquareIndex(
          from.halfboard,
          from.pseudoRank + (isPseudoRankIncreasing ? numSteps : -numSteps),
          from.pseudoFile
        );
        // Normalizing here can only result in a single square or none, since we can't cross the center of the board going vertically
        const normalizedSquare = nextSquare.normalize(from, this.boardState);
        if (normalizedSquare.length === 0) {
          break;
        }
        vertical.push(...normalizedSquare);
      }
    }
    for (const isPseudoFileIncreasing of [true, false]) {
      const horizontal: SquareIndex[] = [];
      horizontalsAndVerticals.push(horizontal);
      for (
        let numSteps = 1;
        numSteps < HalfboardState.NUM_PSEUDO_FILES;
        numSteps++
      ) {
        const nextSquare = new SquareIndex(
          from.halfboard,
          from.pseudoRank,
          from.pseudoFile + (isPseudoFileIncreasing ? numSteps : -numSteps)
        );
        // Normalizing here can only result in a single square or none, since we can't cross the center of the board going vertically
        const normalizedSquare = nextSquare.normalize(from, this.boardState);
        if (normalizedSquare.length === 0) {
          break;
        }
        horizontal.push(...normalizedSquare);
      }
    }
    if (forPawnOfPlayer === null) {
      return horizontalsAndVerticals.filter(
        (horizontalOrVertical) => horizontalOrVertical.length
      );
    }
    return [
      horizontalsAndVerticals[forPawnOfPlayer === from.halfboard ? 0 : 1].slice(
        0,
        1
      ),
    ].filter((vertical) => vertical.length);
  }

  getKnightMoves(from: SquareIndex) {
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
      move.normalize(from, this.boardState)
    );
    return knightMoves.flat();
  }

  _getUnobstructedBishopMoves(from: SquareIndex, player: number) {
    const diagonals = this.getDiagonals(from);
    for (
      let diagonalIndex = 0;
      diagonalIndex < diagonals.length;
      diagonalIndex++
    ) {
      const diagonal = diagonals[diagonalIndex];
      for (let squareIndex = 0; squareIndex < diagonal.length; squareIndex++) {
        const pieceOnSquare = this.boardState.getPiece(diagonal[squareIndex]);
        if (pieceOnSquare !== null) {
          if (pieceOnSquare.player === player) {
            diagonals[diagonalIndex] = diagonal.slice(0, squareIndex);
          } else {
            diagonals[diagonalIndex] = diagonal.slice(0, squareIndex + 1);
          }
          break;
        }
      }
    }
    return diagonals.flat();
  }

  _getUnobstructedRookMoves(from: SquareIndex, player: number) {
    const horizontalsAndVerticals = this.getHorizontalsAndVerticals(from);
    for (
      let horizontalAndVerticalIndex = 0;
      horizontalAndVerticalIndex < horizontalsAndVerticals.length;
      horizontalAndVerticalIndex++
    ) {
      const horizontalOrVertical =
        horizontalsAndVerticals[horizontalAndVerticalIndex];
      for (
        let squareIndex = 0;
        squareIndex < horizontalOrVertical.length;
        squareIndex++
      ) {
        const pieceOnSquare = this.boardState.getPiece(
          horizontalOrVertical[squareIndex]
        );
        if (pieceOnSquare !== null) {
          if (pieceOnSquare.player === player) {
            horizontalsAndVerticals[horizontalAndVerticalIndex] =
              horizontalOrVertical.slice(0, squareIndex);
          } else {
            horizontalsAndVerticals[horizontalAndVerticalIndex] =
              horizontalOrVertical.slice(0, squareIndex + 1);
          }
          break;
        }
      }
    }
    return horizontalsAndVerticals.flat();
  }

  _getUnobstructedKnightMoves(from: SquareIndex, player: number) {
    const knightMoves = this.getKnightMoves(from);
    return knightMoves.filter(
      (square) => this.boardState.getPiece(square)?.player !== player
    );
  }

  _getUnobstructedKingMoves(from: SquareIndex, player: number) {
    const diagonals = this.getDiagonals(from);
    const horizontalsAndVerticals = this.getHorizontalsAndVerticals(from);
    const kingMoves: SquareIndex[] = [];
    for (const diagonal of diagonals) {
      kingMoves.push(diagonal[0]);
    }
    for (const horizontalOrVertical of horizontalsAndVerticals) {
      kingMoves.push(horizontalOrVertical[0]);
    }
    return kingMoves.filter(
      (square) => this.boardState.getPiece(square)?.player !== player
    );
  }

  _getUnobstructedQueenMoves(from: SquareIndex, player: number) {
    return this._getUnobstructedBishopMoves(from, player).concat(
      this._getUnobstructedRookMoves(from, player)
    );
  }

  _getUnobstructedPawnMoves(from: SquareIndex, player: number) {
    const forward = this.getHorizontalsAndVerticals(from, player).flat();
    const diagonals = this.getDiagonals(from, player).flat();
    const pawnMoves: SquareIndex[] = [];
    for (const forwardSquare of forward) {
      if (!this.boardState.getPiece(forwardSquare)) {
        pawnMoves.push(forwardSquare);
      }
    }
    for (const diagonalSquare of diagonals) {
      const piece = this.boardState.getPiece(diagonalSquare);
      if (piece !== null && piece.player !== player) {
        pawnMoves.push(diagonalSquare);
      }
    }
    return pawnMoves;
  }

  getUnobstructedMoves(from: SquareIndex, piece: ChessPiece) {
    let unobstructedMoves: SquareIndex[];
    switch (piece.pieceType) {
      case "K":
        unobstructedMoves = this._getUnobstructedKingMoves(from, piece.player);
        break;
      case "Q":
        unobstructedMoves = this._getUnobstructedQueenMoves(from, piece.player);
        break;
      case "R":
        unobstructedMoves = this._getUnobstructedRookMoves(from, piece.player);
        break;
      case "B":
        unobstructedMoves = this._getUnobstructedBishopMoves(
          from,
          piece.player
        );
        break;
      case "N":
        unobstructedMoves = this._getUnobstructedKnightMoves(
          from,
          piece.player
        );
        break;
      case "p":
        unobstructedMoves = this._getUnobstructedPawnMoves(from, piece.player);
        break;
    }
    return unobstructedMoves;
  }

  getValidMoves(
    from: SquareIndex,
    piece: ChessPiece | null = this.boardState.getPiece(from)
  ) {
    if (!piece) return [];
    return this.getUnobstructedMoves(from, piece);
  }

  isValidMove(
    from: SquareIndex,
    to: SquareIndex,
    piece: ChessPiece | null = this.boardState.getPiece(from)
  ) {
    if (!piece) return false;
    const validMoves = this.getValidMoves(from, piece);
    return validMoves.some((validMove) => validMove.equals(to));
  }
}
