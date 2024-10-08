export const CHESS_PIECE_LIST = ["K", "Q", "R", "B", "N", "p"] as const;
export type ChessPieceType = (typeof CHESS_PIECE_LIST)[number];
export interface ChessPiece {
  readonly player: number;
  readonly pieceType: ChessPieceType;
}
