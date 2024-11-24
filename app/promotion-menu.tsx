import BoardCoords from "./board-coords";
import { ChessPiece, ChessPieceType } from "./pieces";
import drawPiece from "./pieces/draw-piece";
import drawQueen from "./pieces/queen";
import {
  fillQuad,
  isInsideQuadrilateral,
  Quadrilateral,
  strokeQuad,
} from "./quadrilateral";
import SquareIndex from "./square-index";
import Vector2D from "./vector";

export default class PromotionMenu {
  boardCoords: BoardCoords;
  pawnSquare: SquareIndex;
  player: number;
  size: number;
  queenButton: Quadrilateral;
  rookButton: Quadrilateral;
  bishopButton: Quadrilateral;
  knightButton: Quadrilateral;
  constructor(
    boardCoords: BoardCoords,
    pawnSquare: SquareIndex,
    player: number
  ) {
    this.boardCoords = boardCoords;
    this.pawnSquare = pawnSquare;
    this.player = player;
    [
      this.size,
      this.queenButton,
      this.rookButton,
      this.bishopButton,
      this.knightButton,
    ] = this.calcPromotionPosition();
  }

  calcPromotionPosition() {
    const pawnQuad = this.boardCoords.getSquare(this.pawnSquare);
    const [left, right, top, bottom] = [
      pawnQuad.reduce((acc, val) => Math.min(acc, val.x), 1),
      pawnQuad.reduce((acc, val) => Math.max(acc, val.x), 0),
      pawnQuad.reduce((acc, val) => Math.max(acc, val.y), 0),
      pawnQuad.reduce((acc, val) => Math.min(acc, val.y), 1),
    ];
    const [width, height] = [right - left, top - bottom];
    const geometricMedian = new Vector2D(left + width / 2, bottom + height / 2);
    const size = Math.max(width, height);
    const queenButton = [
      new Vector2D(geometricMedian.x - size / 2, geometricMedian.y - size / 2),
      new Vector2D(geometricMedian.x + size / 2, geometricMedian.y - size / 2),
      new Vector2D(geometricMedian.x + size / 2, geometricMedian.y + size / 2),
      new Vector2D(geometricMedian.x - size / 2, geometricMedian.y + size / 2),
    ] as const;
    const shiftVector = new Vector2D(size, 0);
    const rookButton = [
      queenButton[0].add(shiftVector),
      queenButton[1].add(shiftVector),
      queenButton[2].add(shiftVector),
      queenButton[3].add(shiftVector),
    ] as const;
    const bishopButton = [
      rookButton[0].add(shiftVector),
      rookButton[1].add(shiftVector),
      rookButton[2].add(shiftVector),
      rookButton[3].add(shiftVector),
    ] as const;
    const knightButton = [
      bishopButton[0].add(shiftVector),
      bishopButton[1].add(shiftVector),
      bishopButton[2].add(shiftVector),
      bishopButton[3].add(shiftVector),
    ] as const;
    return [size, queenButton, rookButton, bishopButton, knightButton] as const;
  }

  renderPromotionMenu(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = this.size / 20;
    fillQuad(ctx, this.queenButton);
    strokeQuad(ctx, this.queenButton);
    drawPiece(
      { pieceType: "Q", player: this.player },
      ctx,
      this.queenButton[0].x,
      this.queenButton[0].y,
      this.size
    );
    fillQuad(ctx, this.rookButton);
    strokeQuad(ctx, this.rookButton);
    drawPiece(
      { pieceType: "R", player: this.player },
      ctx,
      this.rookButton[0].x,
      this.rookButton[0].y,
      this.size
    );
    fillQuad(ctx, this.bishopButton);
    strokeQuad(ctx, this.bishopButton);
    drawPiece(
      { pieceType: "B", player: this.player },
      ctx,
      this.bishopButton[0].x,
      this.bishopButton[0].y,
      this.size
    );
    fillQuad(ctx, this.knightButton);
    strokeQuad(ctx, this.knightButton);
    drawPiece(
      { pieceType: "N", player: this.player },
      ctx,
      this.knightButton[0].x,
      this.knightButton[0].y,
      this.size
    );
  }

  getClickedPieceType(point: Vector2D): "Q" | "N" | "B" | "R" | null {
    if (isInsideQuadrilateral(point, this.queenButton)) return "Q";
    else if (isInsideQuadrilateral(point, this.rookButton)) return "R";
    else if (isInsideQuadrilateral(point, this.bishopButton)) return "B";
    else if (isInsideQuadrilateral(point, this.knightButton)) return "N";
    else return null;
  }
}
