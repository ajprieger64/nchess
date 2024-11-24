import BoardCoords from "./board-coords";
import { fillQuad } from "./quadrilateral";
import SquareIndex from "./square-index";

export default function renderSelectedSquares(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords,
  selectedSquares: SquareIndex[]
) {
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "rgb(0, 0, 255)";
  for (const selectedSquare of selectedSquares) {
    const squareCoords = boardCoords.getSquare(selectedSquare);
    fillQuad(ctx, squareCoords);
  }
  ctx.globalAlpha = 1;
}
