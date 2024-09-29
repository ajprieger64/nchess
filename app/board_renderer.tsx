"use client";

import { useContext, useEffect } from "react";
import Vector2D from "./vector";
import { CanvasContext } from "./canvas_context";
import BoardCoords from "./board_coords";

function getUnitSquarePath() {
  console.log("Running");
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

export default function BoardRenderer({
  numPlayers,
  zoomStrength,
  zoomAngle,
}: {
  numPlayers: number;
  zoomStrength: number;
  zoomAngle: number;
}) {
  const canvas = useContext(CanvasContext);
  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const boardCoords = new BoardCoords(numPlayers, zoomStrength, zoomAngle);
    const unitSquarePath = getUnitSquarePath();
    const boardBackgroundPath = getBoardBackgroundPath(boardCoords);
    const darkSquaresPath = getDarkSquaresPath(boardCoords);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (canvasHeight > canvasWidth)
      ctx.translate(0, (canvasHeight - canvasWidth) / 2);
    else ctx.translate((canvasWidth - canvasHeight) / 2, 0);

    ctx.scale(
      Math.min(canvasWidth, canvasHeight),
      Math.min(canvasWidth, canvasHeight)
    );

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fill(unitSquarePath);

    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fill(boardBackgroundPath);

    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.fill(darkSquaresPath);

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.resetTransform();
    };
  });
  return null;
}
