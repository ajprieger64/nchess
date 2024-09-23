"use client";

import React, { useRef, useEffect, useState } from "react";
import Vector2D from "./vector";
import NChessboard from "./nchessboard";
import { CHESS_PIECE_LIST, ChessPieceType } from "./pieces";
import drawPiece from "./pieces/draw_piece";

function unitToCanvasCoords(coords: Vector2D, size: number): Vector2D {
  return new Vector2D(
    ((coords.x + 1) / 2.0) * size,
    size - ((coords.y + 1) / 2.0) * size
  );
}

function getCanvasBackground(size: number): Path2D {
  const background = new Path2D();
  background.moveTo(0, 0);
  background.lineTo(0, size);
  background.lineTo(size, size);
  background.lineTo(size, 0);
  background.closePath();
  return background;
}

function zoomTransformation(strength: number, x: number) {
  return Math.sign(x) * Math.abs(x) ** (1 / (strength + 1));
}

function getMaxZoomStrength(x: number, maxAllowableY: number) {
  return Math.log(x) / Math.log(maxAllowableY) - 1;
}

function getBoardCoords(
  size: number,
  numSides: number,
  rtheta: readonly [number, number] | null
): Vector2D[] {
  const boardCoords: Vector2D[] = [];
  const maxZoomStrength = getMaxZoomStrength(1 / numSides, 1 / 3);
  for (let i = 0; i < numSides; i++) {
    const canonicalAngle = ((2 * Math.PI) / numSides) * (i - 0.5) - Math.PI / 2;
    const angle = rtheta
      ? (() => {
          const [r, theta] = rtheta;
          if (r == 0) {
            return canonicalAngle;
          }
          const zoomStrength = Math.min(r * maxZoomStrength, maxZoomStrength);
          console.log(zoomStrength);
          const angularDistance =
            ((((canonicalAngle - theta + Math.PI) % (2 * Math.PI)) +
              2 * Math.PI) %
              (2 * Math.PI)) -
            Math.PI;
          const transformedAngularDistance =
            zoomTransformation(zoomStrength, angularDistance / Math.PI) *
            Math.PI;
          return theta + transformedAngularDistance;
        })()
      : canonicalAngle;
    const unitCoords = new Vector2D(Math.cos(angle), Math.sin(angle));
    const canvasCoords = unitToCanvasCoords(unitCoords, size);
    boardCoords.push(canvasCoords);
  }
  return boardCoords;
}

function getBoardBackground(ngonCoords: Vector2D[]): Path2D {
  const boardBackground = new Path2D();
  boardBackground.moveTo(ngonCoords[0].x, ngonCoords[0].y);
  for (const ngonCoord of ngonCoords) {
    boardBackground.lineTo(ngonCoord.x, ngonCoord.y);
  }
  boardBackground.closePath();
  return boardBackground;
}

// Transforms from a point on the unit square to the matching point within the quadrilateral with coordinates (topLeft, topRight, bottomRight, bottomLeft)
function bilinearInterpolation2D(
  start: Vector2D,
  destination: [Vector2D, Vector2D, Vector2D, Vector2D]
): Vector2D {
  // First, interpolate along the x-axis (in the pre-transformation space), resulting in a single line (given by 2 points) that runs parallel to the y-axis (pre-transformation)
  const [topLeft, topRight, bottomRight, bottomLeft] = destination;
  const topVector = topRight.subtract(topLeft);
  const bottomVector = bottomRight.subtract(bottomLeft);
  const topPoint = topLeft.add(topVector.multiply(start.x));
  const bottomPoint = bottomLeft.add(bottomVector.multiply(start.x));
  // Next, linearly interpolate along the line produced to get our final point
  const lineVector = topPoint.subtract(bottomPoint);
  const transformedPoint = bottomPoint.add(lineVector.multiply(start.y));
  return transformedPoint;
}

function getHalfboardsCoords(
  boardCoords: Vector2D[],
  size: number
): [
  [Vector2D, Vector2D, Vector2D, Vector2D],
  [Vector2D, Vector2D, Vector2D, Vector2D],
][] {
  const n = boardCoords.length;
  const halfboardsCoords: [
    [Vector2D, Vector2D, Vector2D, Vector2D],
    [Vector2D, Vector2D, Vector2D, Vector2D],
  ][] = [];
  for (let i = 0; i < n; i += 2) {
    const leftIndex = (((i - 1) % n) + n) % n;
    const rightIndex = (i + 1) % n;
    const rightRightIndex = (i + 2) % n;
    const leftQuarterBoardTopRight = unitToCanvasCoords(
      new Vector2D(0, 0),
      size
    );
    const leftQuarterBoardBottomRight = boardCoords[i]
      .add(boardCoords[rightIndex])
      .divide(2);
    const leftQuarterBoardBottomLeft = boardCoords[i];
    const leftQuarterBoardTopLeft = boardCoords[i]
      .add(boardCoords[leftIndex])
      .divide(2);
    // Left side of right quarter-board is right side of left quarter-board
    const rightQuarterBoardTopRight = boardCoords[rightIndex]
      .add(boardCoords[rightRightIndex])
      .divide(2);
    const rightQuarterBoardBottomRight = boardCoords[rightIndex];
    halfboardsCoords.push([
      [
        leftQuarterBoardTopLeft,
        leftQuarterBoardTopRight,
        leftQuarterBoardBottomRight,
        leftQuarterBoardBottomLeft,
      ],
      [
        leftQuarterBoardTopRight,
        rightQuarterBoardTopRight,
        rightQuarterBoardBottomRight,
        leftQuarterBoardBottomRight,
      ],
    ] as const);
  }
  return halfboardsCoords;
}

function getDarkSquares(
  halfboardsCoords: [
    [Vector2D, Vector2D, Vector2D, Vector2D],
    [Vector2D, Vector2D, Vector2D, Vector2D],
  ][]
): Path2D {
  const boardSquares = new Path2D();
  // Each quarter-board is a quarter of a regular chessboard, containing 4×4 tiles. The tile in the bottom-left is black
  const NUM_LINEAR_TILES_PER_BOARD = 4;
  for (const halfboardCoords of halfboardsCoords) {
    for (const quarterBoardCoords of halfboardCoords) {
      for (let i = 0; i < NUM_LINEAR_TILES_PER_BOARD; i++) {
        for (let j = 0; j < NUM_LINEAR_TILES_PER_BOARD; j++) {
          if ((i + j) % 2 != 0) {
            continue;
          }
          const topLeftUnitSquareCoords = new Vector2D(
            i / NUM_LINEAR_TILES_PER_BOARD,
            (j + 1) / NUM_LINEAR_TILES_PER_BOARD
          );
          const topRightUnitSquareCoords = new Vector2D(
            (i + 1) / NUM_LINEAR_TILES_PER_BOARD,
            (j + 1) / NUM_LINEAR_TILES_PER_BOARD
          );
          const bottomRightUnitSquareCoords = new Vector2D(
            (i + 1) / NUM_LINEAR_TILES_PER_BOARD,
            j / NUM_LINEAR_TILES_PER_BOARD
          );
          const bottomLeftUnitSquareCoords = new Vector2D(
            i / NUM_LINEAR_TILES_PER_BOARD,
            j / NUM_LINEAR_TILES_PER_BOARD
          );
          const transformedCoords = [
            bilinearInterpolation2D(
              topLeftUnitSquareCoords,
              quarterBoardCoords
            ),
            bilinearInterpolation2D(
              topRightUnitSquareCoords,
              quarterBoardCoords
            ),
            bilinearInterpolation2D(
              bottomRightUnitSquareCoords,
              quarterBoardCoords
            ),
            bilinearInterpolation2D(
              bottomLeftUnitSquareCoords,
              quarterBoardCoords
            ),
          ] as const;
          boardSquares.moveTo(transformedCoords[0].x, transformedCoords[0].y);
          for (const transformedCoord of transformedCoords) {
            boardSquares.lineTo(transformedCoord.x, transformedCoord.y);
          }
          boardSquares.closePath();
        }
      }
    }
  }
  return boardSquares;
}

export default function BoardCanvas() {
  const SIZE = 1000;
  const NUM_PLAYERS = 3;
  const board = new NChessboard(NUM_PLAYERS);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [rTheta, setRTheta] = useState<null | readonly [number, number]>(null);
  const effect = useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const canvasBackground = getCanvasBackground(SIZE);

    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fill(canvasBackground);

    const boardCoords = getBoardCoords(SIZE, NUM_PLAYERS * 2, rTheta);
    const boardBackground = getBoardBackground(boardCoords);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fill(boardBackground);

    const halfboardsCoords = getHalfboardsCoords(boardCoords, SIZE);
    const darkSquares = getDarkSquares(halfboardsCoords);
    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.fill(darkSquares);

    ctx.fillStyle = "rgb(0, 255, 255)";

    drawPiece({ pieceType: "K", player: 0 }, ctx, 0, 0, 100);
    drawPiece({ pieceType: "Q", player: 0 }, ctx, 100, 0, 100);
    drawPiece({ pieceType: "R", player: 0 }, ctx, 200, 0, 100);
    drawPiece({ pieceType: "B", player: 0 }, ctx, 0, 100, 100);
    drawPiece({ pieceType: "N", player: 0 }, ctx, 100, 100, 100);
    drawPiece({ pieceType: "p", player: 0 }, ctx, 200, 100, 100);

    return () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.resetTransform();
    };
  }, [rTheta, canvasRef]);

  function getAngularCoordsFromCenter(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const {
      left: canvasLeft,
      top: canvasTop,
      width: canvasWidth,
      height: canvasHeight,
    } = canvas.getBoundingClientRect();
    const [centerX, centerY] = [
      canvasLeft + canvasWidth / 2,
      canvasTop + canvasHeight / 2,
    ];
    const [deltaX, deltaY] = [x - centerX, y - centerY];
    const rtheta = [
      (2 * Math.sqrt(deltaX ** 2 + deltaY ** 2)) / canvasWidth,
      ((Math.atan2(-deltaY, deltaX) % (2 * Math.PI)) + 2 * Math.PI) %
        (2 * Math.PI),
    ] as const;
    return rtheta;
  }

  function getRTheta(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) {
    let rTheta = null;
    if (e.nativeEvent instanceof MouseEvent) {
      rTheta = getAngularCoordsFromCenter(
        e.nativeEvent.clientX,
        e.nativeEvent.clientY
      );
    } else if (e.nativeEvent instanceof TouchEvent) {
      if (e.nativeEvent.touches.length == 1) {
        rTheta = getAngularCoordsFromCenter(
          e.nativeEvent.touches[0].clientX,
          e.nativeEvent.touches[0].clientY
        );
      }
    }
    return rTheta;
  }

  function mouseDown(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) {
    const newRTheta = getRTheta(e);
    if (!newRTheta) return;
    setRTheta(newRTheta);
  }

  function mouseMove(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) {
    if (e.nativeEvent instanceof MouseEvent && e.nativeEvent.buttons == 0) {
      // User is not holding down the mouse button
      // They may have moved the mouse off from the element and released
      setRTheta(null);
      return;
    } else if (
      e.nativeEvent instanceof TouchEvent &&
      e.nativeEvent.touches.length != 1
    ) {
      // User has either added or subtracted a finger
      setRTheta(null);
      return;
    }
    if (rTheta) {
      const newRTheta = getRTheta(e);
      if (!newRTheta) return;
      setRTheta(newRTheta);
    }
  }

  function mouseUp(
    _: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) {
    setRTheta(null);
  }

  return (
    <div className="grid">
      <canvas
        className="board justify-self-center"
        width={`${SIZE}px`}
        height={`${SIZE}px`}
        ref={canvasRef}
        onMouseDown={mouseDown}
        onTouchStart={mouseDown}
        onMouseMove={mouseMove}
        onTouchMove={mouseMove}
        onMouseUp={mouseUp}
        onTouchEnd={mouseUp}
      />
    </div>
  );
}
