import BoardCoords from "./board-coords";
import SquareIndex from "./square-index";
import Vector2D from "./vector";

export default function renderPromotionMenu(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords,
  pawnSquare: SquareIndex
) {
  const pawnQuad = boardCoords.getSquare(pawnSquare);
  const [left, right, top, bottom] = [
    pawnQuad.reduce((acc, val) => Math.min(acc, val.x), 1),
    pawnQuad.reduce((acc, val) => Math.max(acc, val.x), 0),
    pawnQuad.reduce((acc, val) => Math.max(acc, val.y), 0),
    pawnQuad.reduce((acc, val) => Math.min(acc, val.y), 1),
  ];
  const [width, height] = [right - left, top - bottom];
  const geometricMedian = new Vector2D(left + width / 2, bottom + height / 2);
  const size = Math.max(width, height);
  const menuQuad = [
    new Vector2D(geometricMedian.x - size / 2, geometricMedian.y - size / 2),
    new Vector2D(geometricMedian.x + size / 2, geometricMedian.y - size / 2),
    new Vector2D(geometricMedian.x + size / 2, geometricMedian.y + size / 2),
    new Vector2D(geometricMedian.x - size / 2, geometricMedian.y + size / 2),
  ];
  console.log(menuQuad);
  ctx.fillStyle = "rgb(255, 255, 255)";
  const menuPath = new Path2D();
  menuPath.moveTo(menuQuad[0].x, menuQuad[0].y);
  menuPath.lineTo(menuQuad[1].x, menuQuad[1].y);
  menuPath.lineTo(menuQuad[2].x, menuQuad[2].y);
  menuPath.lineTo(menuQuad[3].x, menuQuad[3].y);
  menuPath.closePath();
  ctx.fill(menuPath);
}
