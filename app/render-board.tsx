"use client";

import { useContext, useEffect } from "react";
import Vector2D from "./vector";
import BoardCoords from "./board-coords";
import { fillQuad } from "./quadrilateral";

const LIGHT_COLOR = "papayawhip";
const DARK_COLOR = "peru";

function drawBoardBackground(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords
) {
  const boardBackgroundPath = new Path2D();
  boardBackgroundPath.moveTo(
    boardCoords.boardVertices[0].x,
    boardCoords.boardVertices[0].y
  );
  for (const vertex of boardCoords.boardVertices) {
    boardBackgroundPath.lineTo(vertex.x, vertex.y);
  }
  boardBackgroundPath.closePath();
  ctx.fill(boardBackgroundPath);
}

function drawDarkSquares(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords
) {
  const darkSquaresPath = new Path2D();
  for (const halfboard of boardCoords.halfboards) {
    for (const darkSquare of halfboard.getDarkSquares()) {
      fillQuad(ctx, darkSquare);
    }
  }
  return darkSquaresPath;
}

export default function renderBoard(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords
) {
  ctx.fillStyle = "rgb(255, 0, 0)";
  const unitSquare = [
    new Vector2D(0, 0),
    new Vector2D(1, 0),
    new Vector2D(1, 1),
    new Vector2D(0, 1),
  ] as const;
  fillQuad(ctx, unitSquare);

  ctx.fillStyle = LIGHT_COLOR;
  drawBoardBackground(ctx, boardCoords);

  ctx.fillStyle = DARK_COLOR;
  drawDarkSquares(ctx, boardCoords);
}
