import BoardCoords from "./board-coords";
import BoardState from "./board-state";
import HalfboardState from "./halfboard-state";
import drawPiece from "./pieces/draw-piece";

export default function renderBoard(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords,
  boardState: BoardState
) {
  for (
    let halfboardIndex = 0;
    halfboardIndex < boardState.halfboards.length;
    halfboardIndex++
  ) {
    const halfboardState = boardState.halfboards[halfboardIndex];
    const halfboardCoords = boardCoords.halfboards[halfboardIndex];
    for (
      let pseudoRankIndex = 0;
      pseudoRankIndex < HalfboardState.NUM_PSEUDO_RANKS;
      pseudoRankIndex++
    ) {
      for (
        let pseudoFileIndex = 0;
        pseudoFileIndex < HalfboardState.NUM_PSEUDO_FILES;
        pseudoFileIndex++
      ) {
        const piece = halfboardState.pieces[pseudoRankIndex][pseudoFileIndex];
        if (piece !== null) {
          const square = halfboardCoords.getSquare(
            pseudoRankIndex,
            pseudoFileIndex
          );
          const sortedXValues = square.map((vec) => vec.x).toSorted();
          const sortedYValues = square.map((vec) => vec.y).toSorted();
          const xSize = sortedXValues[3] - sortedXValues[0];
          const ySize = sortedYValues[3] - sortedYValues[0];
          const size = Math.min(xSize, ySize);
          const centerX = sortedXValues[0] + xSize / 2;
          const centerY = sortedYValues[0] + ySize / 2;
          drawPiece(piece, ctx, centerX - size / 2, centerY - size / 2, size);
        }
      }
    }
  }
}
