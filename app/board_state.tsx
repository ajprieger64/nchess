import NChessHalfboard from "./halfboard_state";

export default class BoardState {
  n: number;
  halfboards: Array<NChessHalfboard>;
  constructor(n: number) {
    this.n = n;
    this.halfboards = Array();
    for (let i = 0; i < n; i++) {
      this.halfboards.push(new NChessHalfboard(i));
    }
  }
}
