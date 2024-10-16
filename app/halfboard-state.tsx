import { ChessPiece } from "./pieces";

export default class HalfboardState {
  static NUM_PSEUDO_FILES = 8;
  static NUM_PSEUDO_RANKS = 4;
  static LEFT_MIDDLE_FILE = 3;
  static RIGHT_MIDDLE_FILE = 4;
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
  }

  deepCopy() {
    const newHalfboard = new HalfboardState(0);
    this.pieces.forEach(
      (pseudoRank, pseudoRankIndex) =>
        (newHalfboard.pieces[pseudoRankIndex] = pseudoRank.slice())
    );
    return newHalfboard;
  }
}
