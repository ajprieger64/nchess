"use client";

import React, { useRef, useEffect } from "react";

function unitToCanvasCoords(
  coords: [number, number],
  size: number
): [number, number] {
  return [
    ((coords[0] + 1) / 2.0) * size,
    size - ((coords[1] + 1) / 2.0) * size,
  ];
}

export default function BoardCanvas() {
  const SIZE = 1000;
  const NUM_PLAYERS = 3;
  const ref = useRef<HTMLCanvasElement>(null);
  const effect = useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = ref.current.getContext("2d");
    if (!ctx) return;
    const canvasSize = canvas.width;
    console.log("Canvas size: ", canvasSize);
    const rectangle = new Path2D();
    rectangle.moveTo(0 * canvasSize, 0 * canvasSize);
    rectangle.lineTo(0 * canvasSize, 1 * canvasSize);
    rectangle.lineTo(1 * canvasSize, 1 * canvasSize);
    rectangle.lineTo(1 * canvasSize, 0 * canvasSize);
    rectangle.lineTo(0 * canvasSize, 0 * canvasSize);

    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.stroke(rectangle);

    const n = NUM_PLAYERS * 2;
    const ngonCoords: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const coord: [number, number] = [
        Math.cos(
          (2 * Math.PI * i) / n - Math.PI / 2.0 + Math.PI / (2.0 * NUM_PLAYERS)
        ),
        Math.sin(
          (2 * Math.PI * i) / n - Math.PI / 2.0 + Math.PI / (2.0 * NUM_PLAYERS)
        ),
      ];
      ngonCoords.push(coord);
    }
    const skewedSquaresCoords: [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ][] = [];
    for (let i = 0; i < n; i++) {
      const leftIndex = (((i - 1) % n) + n) % n;
      const rightIndex = (i + 1) % n;
      const topLeft: [number, number] = [0, 0];
      const topRight: [number, number] = [
        (ngonCoords[i][0] + ngonCoords[rightIndex][0]) / 2.0,
        (ngonCoords[i][1] + ngonCoords[rightIndex][1]) / 2.0,
      ];
      const bottomRight = ngonCoords[i];
      const bottomLeft: [number, number] = [
        (ngonCoords[i][0] + ngonCoords[leftIndex][0]) / 2.0,
        (ngonCoords[i][1] + ngonCoords[leftIndex][1]) / 2.0,
      ];
      skewedSquaresCoords.push([topLeft, topRight, bottomRight, bottomLeft]);
    }

    console.log(skewedSquaresCoords);

    const ngon = new Path2D();
    ngon.moveTo(...unitToCanvasCoords(ngonCoords[0], SIZE));
    for (const ngonCoord of ngonCoords) {
      ngon.lineTo(...unitToCanvasCoords(ngonCoord, SIZE));
    }
    ngon.lineTo(...unitToCanvasCoords(ngonCoords[0], SIZE));

    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.stroke(ngon);

    const skewedSquares: Path2D[] = [];
    for (const skewedSquareCoords of skewedSquaresCoords) {
      const skewedSquare = new Path2D();
      skewedSquare.moveTo(...unitToCanvasCoords(skewedSquareCoords[0], SIZE));
      for (const skewedSquareCoord of skewedSquareCoords) {
        skewedSquare.lineTo(...unitToCanvasCoords(skewedSquareCoord, SIZE));
      }
      skewedSquare.lineTo(...unitToCanvasCoords(skewedSquareCoords[0], SIZE));
      skewedSquares.push(skewedSquare);
    }

    for (let i = 0; i < n; i++) {
      const skewedSquare = skewedSquares[i];
      ctx.strokeStyle = `rgb(0, 0, ${((i + 1) / n) * 255})`;
      ctx.stroke(skewedSquare);
    }

    return () => {
      const canvas = ref.current;
      if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  });
  return (
    <div className="grid">
      <canvas
        className="board justify-self-center"
        width={`${SIZE}px`}
        height={`${SIZE}px`}
        ref={ref}
      />
    </div>
  );
}
