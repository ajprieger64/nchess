import HalfboardState from "./halfboard-state";

export interface SquareIndex {
  halfboard: number;
  pseudoRank: number;
  pseudoFile: number;
}

export default class BoardState {
  n: number;
  halfboards: Array<HalfboardState>;
  constructor(n: number) {
    this.n = n;
    this.halfboards = Array();
    for (let i = 0; i < n; i++) {
      this.halfboards.push(new HalfboardState(i));
    }
  }

  deepCopy() {
    const newBoard = new BoardState(this.n);
    this.halfboards.forEach(
      (halfboard, halfboardIndex) =>
        (newBoard.halfboards[halfboardIndex] = halfboard.deepCopy())
    );
    return newBoard;
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
    return newBoard;
  }

  getDiagonals(from: SquareIndex, forwardForPlayer: number | null = null) {
    const diagonals: SquareIndex[][] = [];
    // For each of the four possible directions.
    // One of the directions could split if it goes through the center
    for (let [
      isPseudoRankIncreasing,
      isPseudoFileIncreasing,
    ] of forwardForPlayer === null
      ? [
          [false, true],
          [true, true],
          [true, false],
          [false, false],
        ]
      : [
          [forwardForPlayer !== from.halfboard, true],
          [forwardForPlayer !== from.halfboard, false],
        ]) {
      const diagonal: SquareIndex[] = [];
      let currentSquareIndex = {
        halfboard: from.halfboard,
        pseudoRank: from.pseudoRank,
        pseudoFile: from.pseudoFile,
      };
      while (true) {
        const [nextPseudoRank, nextPseudoFile] = [
          currentSquareIndex.pseudoRank + (isPseudoRankIncreasing ? 1 : -1),
          currentSquareIndex.pseudoFile + (isPseudoFileIncreasing ? 1 : -1),
        ];
        if (
          0 <= nextPseudoRank &&
          nextPseudoRank < HalfboardState.NUM_PSEUDO_RANKS &&
          0 <= nextPseudoFile &&
          nextPseudoFile < HalfboardState.NUM_PSEUDO_FILES
        ) {
          // We're still in the same halfboard
          const nextSquareIndex = {
            halfboard: currentSquareIndex.halfboard,
            pseudoRank: nextPseudoRank,
            pseudoFile: nextPseudoFile,
          };
          diagonal.push(nextSquareIndex);
          currentSquareIndex = nextSquareIndex;
        } else if (
          nextPseudoRank < 0 &&
          0 <= nextPseudoFile &&
          nextPseudoFile < HalfboardState.NUM_PSEUDO_FILES
        ) {
          // We're in a different halfboard
          if (
            (nextPseudoFile == HalfboardState.LEFT_MIDDLE_FILE &&
              !isPseudoFileIncreasing) ||
            (nextPseudoFile == HalfboardState.RIGHT_MIDDLE_FILE &&
              isPseudoFileIncreasing)
          ) {
            // Just crossed through the center of the board
            isPseudoFileIncreasing = !isPseudoFileIncreasing;
            isPseudoRankIncreasing = !isPseudoRankIncreasing;
            for (
              let halfboardIndex = 0;
              halfboardIndex < this.n;
              halfboardIndex++
            ) {
              if (halfboardIndex == from.halfboard) continue;

              const oppositeHalfboardDiagonal = diagonal.slice();
              currentSquareIndex = {
                halfboard: halfboardIndex,
                pseudoRank: 0,
                pseudoFile:
                  HalfboardState.NUM_PSEUDO_FILES - nextPseudoFile - 1,
              };
              // We can't loop back around to another halfboard at this point, so no need to check if we're off the top of the halfboard
              while (
                0 <= currentSquareIndex.pseudoRank &&
                0 <= currentSquareIndex.pseudoFile &&
                currentSquareIndex.pseudoFile < HalfboardState.NUM_PSEUDO_FILES
              ) {
                oppositeHalfboardDiagonal.push(currentSquareIndex);
                const nextSquareIndex = {
                  halfboard: halfboardIndex,
                  pseudoRank:
                    currentSquareIndex.pseudoRank +
                    (isPseudoRankIncreasing ? 1 : -1),
                  pseudoFile:
                    currentSquareIndex.pseudoFile +
                    (isPseudoFileIncreasing ? 1 : -1),
                };
                currentSquareIndex = nextSquareIndex;
              }
              if (oppositeHalfboardDiagonal.length) {
                diagonals.push(oppositeHalfboardDiagonal);
              }
            }
            break;
          }
          // We're on the corresponding opposite halfboard
          const nextSquareIndex = {
            halfboard:
              (((currentSquareIndex.halfboard +
                (nextPseudoFile < HalfboardState.LEFT_MIDDLE_FILE ? 1 : -1)) %
                this.n) +
                this.n) %
              this.n,
            pseudoRank: 0,
            pseudoFile: HalfboardState.NUM_PSEUDO_FILES - nextPseudoFile - 1,
          };
          isPseudoRankIncreasing = !isPseudoRankIncreasing;
          isPseudoFileIncreasing = !isPseudoFileIncreasing;
          diagonal.push(nextSquareIndex);
          currentSquareIndex = nextSquareIndex;
        } else {
          // We're off the board
          if (diagonal.length) {
            diagonals.push(diagonal);
          }
          break;
        }
      }
    }
    return diagonals;
  }

  getHorizontalVerticals(
    from: SquareIndex,
    forwardForPlayer: number | null = null
  ) {
    const horizontalVerticals: SquareIndex[][] = [];
    // Verticals
    for (let isPseudoRankIncreasing of forwardForPlayer === null
      ? [false, true]
      : [forwardForPlayer !== from.halfboard]) {
      const vertical: SquareIndex[] = [];
      let currentSquareIndex = {
        halfboard: from.halfboard,
        pseudoRank: from.pseudoRank,
        pseudoFile: from.pseudoFile,
      };
      while (true) {
        const nextPseudoRank =
          currentSquareIndex.pseudoRank + (isPseudoRankIncreasing ? 1 : -1);
        if (HalfboardState.NUM_PSEUDO_RANKS <= nextPseudoRank) {
          // Off the board
          break;
        } else if (0 <= nextPseudoRank) {
          // We're still in the same halfboard
          const nextSquareIndex = {
            halfboard: currentSquareIndex.halfboard,
            pseudoRank: nextPseudoRank,
            pseudoFile: currentSquareIndex.pseudoFile,
          };
          vertical.push(nextSquareIndex);
          currentSquareIndex = nextSquareIndex;
        } else {
          // We're on the corresponding opposite halfboard
          const nextSquareIndex = {
            halfboard:
              (((currentSquareIndex.halfboard +
                (currentSquareIndex.pseudoFile <=
                HalfboardState.LEFT_MIDDLE_FILE
                  ? 1
                  : -1)) %
                this.n) +
                this.n) %
              this.n,
            pseudoRank: 0,
            pseudoFile:
              HalfboardState.NUM_PSEUDO_FILES -
              currentSquareIndex.pseudoFile -
              1,
          };
          isPseudoRankIncreasing = !isPseudoRankIncreasing;
          vertical.push(nextSquareIndex);
          currentSquareIndex = nextSquareIndex;
        }
      }
      if (vertical.length > 0) {
        horizontalVerticals.push(vertical);
      }
    }
    // Horizontals
    if (forwardForPlayer !== null) return horizontalVerticals;
    for (let isPseudoFileIncreasing of [false, true]) {
      const horizontal: SquareIndex[] = [];
      let currentSquareIndex = {
        halfboard: from.halfboard,
        pseudoRank: from.pseudoRank,
        pseudoFile: from.pseudoFile,
      };
      while (true) {
        const nextPseudoFile =
          currentSquareIndex.pseudoFile + (isPseudoFileIncreasing ? 1 : -1);
        if (
          HalfboardState.NUM_PSEUDO_FILES <= nextPseudoFile ||
          nextPseudoFile < 0
        ) {
          // Off the board
          break;
        } else {
          // We're still in the same halfboard
          const nextSquareIndex = {
            halfboard: currentSquareIndex.halfboard,
            pseudoRank: currentSquareIndex.pseudoRank,
            pseudoFile: nextPseudoFile,
          };
          horizontal.push(nextSquareIndex);
          currentSquareIndex = nextSquareIndex;
        }
      }
      if (horizontal.length > 0) {
        horizontalVerticals.push(horizontal);
      }
    }
    return horizontalVerticals;
  }

  getKnightMoves(from: SquareIndex) {
    const moves: SquareIndex[] = [];
    for (const [pseudoRankDelta, pseudoFileDelta] of [
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1],
      [-1, 2],
    ]) {
      const [nextPseudoRank, nextPseudoFile] = [
        from.pseudoRank + pseudoRankDelta,
        from.pseudoFile + pseudoFileDelta,
      ];
      if (
        nextPseudoRank < 0 &&
        ((nextPseudoFile < HalfboardState.RIGHT_MIDDLE_FILE &&
          HalfboardState.LEFT_MIDDLE_FILE < from.pseudoFile) ||
          (HalfboardState.LEFT_MIDDLE_FILE < nextPseudoFile &&
            from.pseudoFile < HalfboardState.RIGHT_MIDDLE_FILE))
      ) {
        // Just crossed through the center of the board
        for (
          let halfboardIndex = 0;
          halfboardIndex < this.n;
          halfboardIndex++
        ) {
          if (halfboardIndex == from.halfboard) continue;
          moves.push({
            halfboard: halfboardIndex,
            pseudoRank: -1 - nextPseudoRank,
            pseudoFile: HalfboardState.NUM_PSEUDO_FILES - nextPseudoFile - 1,
          });
        }
      } else if (
        nextPseudoRank < 0 &&
        0 <= nextPseudoFile &&
        nextPseudoFile < HalfboardState.NUM_PSEUDO_FILES
      ) {
        // We're on the corresponding opposite halfboard
        moves.push({
          halfboard:
            (((from.halfboard +
              (nextPseudoFile <= HalfboardState.LEFT_MIDDLE_FILE ? 1 : -1)) %
              this.n) +
              this.n) %
            this.n,
          pseudoRank: -1 - nextPseudoRank,
          pseudoFile: HalfboardState.NUM_PSEUDO_FILES - nextPseudoFile - 1,
        });
      } else if (
        0 <= nextPseudoRank &&
        nextPseudoRank < HalfboardState.NUM_PSEUDO_RANKS &&
        0 <= nextPseudoFile &&
        nextPseudoFile < HalfboardState.NUM_PSEUDO_FILES
      ) {
        // We're still in the same halfboard
        moves.push({
          halfboard: from.halfboard,
          pseudoRank: nextPseudoRank,
          pseudoFile: nextPseudoFile,
        });
      }
    }
    return moves;
  }
}
