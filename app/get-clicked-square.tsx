import BoardCoords from "./board-coords";
import HalfboardCoords from "./halfboard-coords";
import HalfboardState from "./halfboard-state";
import { isInsideQuadrilateral, Quadrilateral } from "./quadrilateral";
import SquareIndex from "./square-index";
import Vector2D from "./vector";

export default function getClickedSquare(
  point: Vector2D,
  boardCoords: BoardCoords
) {
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
              return new SquareIndex(
                halfboardIndex,
                pseudoRankIndex,
                pseudoFileIndex
              );
            }
          }
        }
      }
    }
  }
  return null;
}
