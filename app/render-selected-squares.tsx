import BoardCoords from "./board-coords";
import { SquareIndex } from "./board-state";

export default function renderSelectedSquares(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords,
  selectedSquares: SquareIndex[]
) {
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "rgb(0, 0, 255)";
  for (const selectedSquare of selectedSquares) {
    const squareCoords = boardCoords.halfboards[
      selectedSquare.halfboard
    ].getSquare(selectedSquare.pseudoRank, selectedSquare.pseudoFile);
    const squarePath = new Path2D();
    squarePath.moveTo(squareCoords[0].x, squareCoords[0].y);
    squarePath.lineTo(squareCoords[1].x, squareCoords[1].y);
    squarePath.lineTo(squareCoords[2].x, squareCoords[2].y);
    squarePath.lineTo(squareCoords[3].x, squareCoords[3].y);
    squarePath.closePath();
    ctx.fill(squarePath);
  }
  ctx.globalAlpha = 1;
}
