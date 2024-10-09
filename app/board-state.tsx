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
}
