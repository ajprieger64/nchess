import BoardCoords from "./board-coords";
import BoardState from "./board-state";
import HalfboardState from "./halfboard-state";
import drawPiece from "./pieces/draw-piece";

export default function renderBoard(
  ctx: CanvasRenderingContext2D,
  boardCoords: BoardCoords,
  boardState: BoardState
) {
  const NUM_POINTS_IN_QUADRILATERAL = 4;
  for (const boardIndex of boardState) {
    const halfboardCoords = boardCoords.halfboards[boardIndex.halfboard];
    const piece = boardState.getPiece(boardIndex);
    if (piece !== null) {
      const square = halfboardCoords.getSquare(
        boardIndex.pseudoRank,
        boardIndex.pseudoFile
      );
      // 1: Find the centroid
      const centroid = square
        .reduce((acc, curr) => acc.add(curr))
        .divide(NUM_POINTS_IN_QUADRILATERAL);
      // 2: Find the smallest distance to any of the enclosing lines
      // This gives us the largest circle centered on the centroid contained entirely within the square
      const distanceOfClosestPointFromCentroid = square.map((pointA, index) => {
        // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
        const pointB = square[(index + 1) % NUM_POINTS_IN_QUADRILATERAL];
        return Math.abs(
          ((pointB.y - pointA.y) * centroid.x -
            (pointB.x - pointA.x) * centroid.y +
            pointB.x * pointA.y -
            pointB.y * pointA.x) /
            Math.sqrt((pointB.y - pointA.y) ** 2 + (pointB.x - pointA.x) ** 2)
        );
      });
      const minDistance = Math.min(...distanceOfClosestPointFromCentroid);
      // 3: Draw the piece with double the size of the radius of the circle we just found.
      // This means that circle is inscribed within the square to which the piece is drawn.
      // Because the square is larger than the circle, there might be some slight overlap,
      // but the way the pieces are actually drawn stays mostly inside, so it looks pretty good.
      drawPiece(
        piece,
        ctx,
        centroid.x - minDistance,
        centroid.y - minDistance,
        minDistance * 2
      );
    }
  }
}
