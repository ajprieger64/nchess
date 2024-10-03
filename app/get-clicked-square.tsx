import BoardCoords from "./board-coords";
import { SquareCoords } from "./board-state";
import HalfboardCoords, { Quadrilateral } from "./halfboard-coords";
import HalfboardState from "./halfboard-state";
import Vector2D from "./vector";

function isInsideQuadrilateral(
  point: Vector2D,
  quad: Quadrilateral,
  clockwise: boolean = true
) {
  const NUM_POINTS_IN_QUADRILATERAL = 4;
  const isRightOfLine = quad.map((startPoint, index) => {
    const endPoint = quad[(index + 1) % NUM_POINTS_IN_QUADRILATERAL];
    const edgeVector = endPoint.subtract(startPoint);
    const startToPointVector = point.subtract(startPoint);
    return startToPointVector.cross(edgeVector) < 0;
  });
  return !isRightOfLine.includes(!clockwise);
}

export default function getClickedSquare(
  point: Vector2D,
  boardCoords: BoardCoords
): SquareCoords | null {
  for (
    let halfboardIndex = 0;
    halfboardIndex < boardCoords.halfboards.length;
    halfboardIndex++
  ) {
    const halfboard = boardCoords.halfboards[halfboardIndex];
    const quarterBoards = [
      halfboard.leftQuarterBoardCorners,
      halfboard.rightQuarterBoardCorners,
    ];
    for (
      let quarterBoardIndex = 0;
      quarterBoardIndex < quarterBoards.length;
      quarterBoardIndex++
    ) {
      const quarterBoard = quarterBoards[quarterBoardIndex];
      if (isInsideQuadrilateral(point, quarterBoard)) {
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
            const square = halfboard.getSquare(
              pseudoRankIndex,
              pseudoFileIndex
            );

            if (isInsideQuadrilateral(point, square)) {
              return {
                halfboard: halfboardIndex,
                pseudoRank: pseudoRankIndex,
                pseudoFile: pseudoFileIndex,
              };
            }
          }
        }
      }
    }
  }
  return null;
}
