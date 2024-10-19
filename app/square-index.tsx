export default class SquareIndex {
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
}
