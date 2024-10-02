"use client";

import React, { useRef, useEffect, useState } from "react";
import BoardState from "./board-state";
import { CHESS_PIECE_LIST, ChessPieceType } from "./pieces";
import drawPiece from "./pieces/draw-piece";
import BoardRenderer from "./render-board";
import renderBoard from "./render-board";
import BoardCoords from "./board-coords";
import renderPieces from "./render-pieces";

export default function BoardCanvas() {
  const SIZE = 1000;
  const NUM_PLAYERS = 3;
  const [widthHeight, setWidthHeight] = useState<[number, number] | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const height = entry.contentBoxSize[0].blockSize;
          const width = entry.contentBoxSize[0].inlineSize;
          setWidthHeight([width, height]);
        }
      }
    });
    resizeObserver.observe(div);
    return () => {
      resizeObserver.disconnect();
      setWidthHeight(null);
    };
  }, [divRef]);

  const [rTheta, setRTheta] = useState<null | readonly [number, number]>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!widthHeight) return;
    const [canvasWidth, canvasHeight] = widthHeight;

    if (canvasHeight > canvasWidth)
      ctx.translate(0, (canvasHeight - canvasWidth) / 2);
    else ctx.translate((canvasWidth - canvasHeight) / 2, 0);

    ctx.scale(
      Math.min(canvasWidth, canvasHeight),
      Math.min(canvasWidth, canvasHeight)
    );

    const boardCoords = new BoardCoords(
      NUM_PLAYERS,
      rTheta?.[0] ?? 0,
      rTheta?.[1] ?? 0
    );
    const boardState = new BoardState(NUM_PLAYERS);

    renderBoard(ctx, boardCoords);
    renderPieces(ctx, boardCoords, boardState);

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.resetTransform();
    };
  }, [canvasRef, widthHeight, rTheta]);

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
      if (e.nativeEvent.touches.length === 1) {
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
    if (e.nativeEvent instanceof MouseEvent && e.nativeEvent.buttons === 0) {
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
    <div className="grid" ref={divRef}>
      <canvas
        className="board justify-self-center"
        width={`${widthHeight?.[0] ?? 0}px`}
        height={`${widthHeight?.[1] ?? 0}px`}
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
