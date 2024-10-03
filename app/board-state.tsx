import HalfboardState from "./halfboard-state";

export interface SquareCoords {
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
}
