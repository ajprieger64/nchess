import { ChessPiece } from "../pieces";
import drawBishop from "./bishop";
import drawKing from "./king";
import drawKnight from "./knight";
import drawPawn from "./pawn";
import drawQueen from "./queen";
import drawRook from "./rook";

export default function drawPiece(
  piece: ChessPiece,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const oldTransform = ctx.getTransform();
  const oldStrokeStyle = ctx.strokeStyle;
  const oldFillStyle = ctx.fillStyle;
  const oldLineWidth = ctx.lineWidth;
  ctx.translate(x, y);
  ctx.scale(size / 45, size / 45);
  switch (piece.pieceType) {
    case "K":
      drawKing(ctx, piece.player);
      break;
    case "Q":
      drawQueen(ctx, piece.player);
      break;
    case "R":
      drawRook(ctx, piece.player);
      break;
    case "B":
      drawBishop(ctx, piece.player);
      break;
    case "N":
      drawKnight(ctx, piece.player);
      break;
    case "p":
      drawPawn(ctx, piece.player);
      break;
  }
  ctx.setTransform(oldTransform);
  ctx.strokeStyle = oldStrokeStyle;
  ctx.fillStyle = oldFillStyle;
  ctx.lineWidth = oldLineWidth;
}
