"use client";

import React, { useRef, useEffect, useState } from "react";
import BoardState, { SquareIndex } from "./board-state";
import { CHESS_PIECE_LIST, ChessPieceType } from "./pieces";
import drawPiece from "./pieces/draw-piece";
import BoardRenderer from "./render-board";
import renderBoard from "./render-board";
import BoardCoords from "./board-coords";
import renderPieces from "./render-pieces";
import Vector2D from "./vector";
import getClickedSquare from "./get-clicked-square";
import BoardController from "./board-controller";
import renderSelectedSquares from "./render-selected-squares";

export default function BoardCanvas() {
  const SIZE = 1000;
  const NUM_PLAYERS = 3;
  const [widthHeight, setWidthHeight] = useState<[number, number] | null>(null);

  const [drawAreaLeft, drawAreaTop] =
    widthHeight === null
      ? [null, null]
      : widthHeight[1] > widthHeight[0]
        ? [0, (widthHeight[1] - widthHeight[0]) / 2]
        : [(widthHeight[0] - widthHeight[1]) / 2, 0];
  const drawAreaSize = widthHeight === null ? null : Math.min(...widthHeight);

  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardCoords = new BoardCoords(NUM_PLAYERS, 0, 0);
  const [boardState, setBoardState] = useState<BoardState>(
    new BoardState(NUM_PLAYERS)
  );
  const boardController = new BoardController(boardState);
  const [selectedSquare, setSelectedSquare] = useState<SquareIndex | null>(
    null
  );
  console.log("Selected square:", selectedSquare);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.translate(drawAreaLeft ?? 0, drawAreaTop ?? 0);
    ctx.scale(drawAreaSize ?? 1, drawAreaSize ?? 1);

    renderBoard(ctx, boardCoords);
    renderPieces(ctx, boardCoords, boardState);
    if (selectedSquare) {
      renderSelectedSquares(
        ctx,
        boardCoords,
        [selectedSquare].concat(boardController.getValidMoves(selectedSquare))
      );
    }

    console.log(
      `Is player ${boardState.currentPlayerTurn} checkmated:`,
      boardController.isCheckmated()
    );
    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.resetTransform();
    };
  }, [
    boardController,
    boardCoords,
    boardState,
    canvasRef,
    drawAreaLeft,
    drawAreaSize,
    drawAreaTop,
    selectedSquare,
    widthHeight,
  ]);

  function mouseEvent(e: React.MouseEvent<HTMLCanvasElement>) {
    const point = new Vector2D(
      e.clientX - (drawAreaLeft ?? 0),
      e.clientY - (drawAreaTop ?? 0)
    ).divide(drawAreaSize ?? 1);
    const clickedSquare = getClickedSquare(point, boardCoords);
    if (clickedSquare !== null) {
      if (
        !selectedSquare &&
        boardState.getPiece(clickedSquare)?.player ===
          boardState.currentPlayerTurn
      ) {
        setSelectedSquare(clickedSquare);
      }
      if (selectedSquare !== null) {
        if (boardController.isValidMove(selectedSquare, clickedSquare)) {
          setBoardState(boardState.move(selectedSquare, clickedSquare));
        }
        setSelectedSquare(null);
      }
    }
  }

  return (
    <div className="grid" ref={divRef}>
      <canvas
        className="board justify-self-center"
        width={`${widthHeight?.[0] ?? 0}px`}
        height={`${widthHeight?.[1] ?? 0}px`}
        ref={canvasRef}
        onClick={mouseEvent}
      />
    </div>
  );
}
