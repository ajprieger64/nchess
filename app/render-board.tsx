"use client";

import { useContext, useEffect } from "react";
import Vector2D from "./vector";
import BoardCoords from "./board-coords";

function getUnitSquarePath() {
  const unitSquarePath = new Path2D();
  unitSquarePath.moveTo(0, 0);
  unitSquarePath.lineTo(1, 0);
  unitSquarePath.lineTo(1, 1);
  unitSquarePath.lineTo(0, 1);
  unitSquarePath.closePath();
  return unitSquarePath;
}

function getBoardBackgroundPath(boardCoords: BoardCoords) {
  const boardBackgroundPath = new Path2D();
  boardBackgroundPath.moveTo(
    boardCoords.boardVertices[0].x,
    boardCoords.boardVertices[0].y
  );
  for (const vertex of boardCoords.boardVertices) {
    boardBackgroundPath.lineTo(vertex.x, vertex.y);
  }
  boardBackgroundPath.closePath();
  return boardBackgroundPath;
}

function getDarkSquaresPath(boardCoords: BoardCoords) {
  const darkSquaresPath = new Path2D();
  for (const halfboard of boardCoords.halfboards) {
    for (const darkSquare of halfboard.getDarkSquares()) {
      darkSquaresPath.moveTo(darkSquare[0].x, darkSquare[0].y);
      darkSquaresPath.lineTo(darkSquare[1].x, darkSquare[1].y);
      darkSquaresPath.lineTo(darkSquare[2].x, darkSquare[2].y);
      darkSquaresPath.lineTo(darkSquare[3].x, darkSquare[3].y);
      darkSquaresPath.closePath();
    }
  }
  return darkSquaresPath;
}

export default function renderBoard(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords
) {
  const unitSquarePath = getUnitSquarePath();
  const boardBackgroundPath = getBoardBackgroundPath(boardCoords);
  const darkSquaresPath = getDarkSquaresPath(boardCoords);

  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fill(unitSquarePath);

  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fill(boardBackgroundPath);

  ctx.fillStyle = "rgb(0, 0, 255)";
  ctx.fill(darkSquaresPath);
}
