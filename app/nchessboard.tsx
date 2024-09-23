import NChessHalfboard from "./halfboard";

export default class NChessboard {
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
