import { ChessPiece } from "./pieces";

export default class NChessHalfboard {
  leftQuarterBoard: Array<Array<ChessPiece | null>>;
  rightQuarterBoard: Array<Array<ChessPiece | null>>;
  constructor(startingPlayer: number) {
    this.leftQuarterBoard = [
      [null, null, null, null],
      [null, null, null, null],
      [
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
          pieceType: startingPlayer % 2 == 0 ? "Q" : "K",
        },
      ],
    ];
    this.rightQuarterBoard = [
      [null, null, null, null],
      [null, null, null, null],
      [
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
        { player: startingPlayer, pieceType: "p" },
      ],
      [
        {
          player: startingPlayer,
          pieceType: startingPlayer % 2 == 0 ? "K" : "Q",
        },
        { player: startingPlayer, pieceType: "B" },
        { player: startingPlayer, pieceType: "N" },
        { player: startingPlayer, pieceType: "R" },
      ],
    ];
  }
}
