import { ChessPiece } from "./pieces";

export default class HalfboardState {
  static NUM_PSEUDO_FILES = 8;
  static NUM_PSEUDO_RANKS = 4;
  pieces: (ChessPiece | null)[][];
  constructor(startingPlayer: number) {
    this.pieces = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
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
    ];
  }
}
