import { ChessPiece } from "./pieces";

export default class HalfboardState {
  static NUM_PSEUDO_FILES = 8;
  static NUM_PSEUDO_RANKS = 4;
  static MIDDLE_FILE = 4;
  hasLeftRookMoved: boolean;
  hasRightRookMoved: boolean;
  hasKingMoved: boolean;
  pieces: (ChessPiece | null)[][];
  constructor(startingPlayer: number) {
    this.pieces = [
      [
        { player: startingPlayer, pieceType: "R" },
        { player: startingPlayer, pieceType: "N" },
        { player: startingPlayer, pieceType: "B" },
        {
          player: startingPlayer,
          pieceType: startingPlayer % 2 === 0 ? "Q" : "K",
        },
        {
          player: startingPlayer,
          pieceType: startingPlayer % 2 === 0 ? "K" : "Q",
        },
        { player: startingPlayer, pieceType: "B" },
        { player: startingPlayer, pieceType: "N" },
        { player: startingPlayer, pieceType: "R" },
      ],
      [
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
      ],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ];
    this.hasKingMoved = false;
    this.hasLeftRookMoved = false;
    this.hasRightRookMoved = false;
  }

  deepCopy() {
    const newHalfboardPosition = new HalfboardState(0);
    this.pieces.forEach(
      (pseudoRank, pseudoRankIndex) =>
        (newHalfboardPosition.pieces[pseudoRankIndex] = pseudoRank.slice())
    );
    newHalfboardPosition.hasKingMoved = this.hasKingMoved;
    newHalfboardPosition.hasLeftRookMoved = this.hasLeftRookMoved;
    newHalfboardPosition.hasRightRookMoved = this.hasRightRookMoved;
    return newHalfboardPosition;
  }
}
