import HalfboardState from "./halfboard-state";
import Vector2D from "./vector";

export type Quadrilateral = [Vector2D, Vector2D, Vector2D, Vector2D];

export default class HalfboardCoords {
  static BOARD_CENTER = new Vector2D(0.5, 0.5);
  static NUM_FILES_PER_QUARTER_BOARD = 4;

  leftQuarterBoardTopLeft: Vector2D;
  leftQuarterBoardTopRight: Vector2D;
  leftQuarterBoardBottomRight: Vector2D;
  leftQuarterBoardBottomLeft: Vector2D;
  rightQuarterBoardTopRight: Vector2D;
  rightQuarterBoardBottomRight: Vector2D;
  constructor(boardVertices: Vector2D[], boardNumber: number) {
    /* A halfboard is a rectangle in non-Euclidean space.
    In Euclidean space, it is representable by five points connected by straight lines:
    The four normal corners of the halfboard (top-left, top-right, bottom-right, and bottom-left) and the center of the board (which appears between top-left and top-right)
    The two top corners appear at points midway between vertices, while the two bottom corners are themselves at vertices.
    The halfboard numbered '0' has bottom corners at indices 0 (right) and 1 (left) in the boardVertices array */
    const bottomRightVertexIndex = (2 * boardNumber) % boardVertices.length;
    const bottomLeftVertexIndex =
      (bottomRightVertexIndex + 1) % boardVertices.length;
    // Added % term needed to take modulo properly because index could be negative
    const rightOfBoardVertexIndex =
      (((bottomRightVertexIndex - 1) % boardVertices.length) +
        boardVertices.length) %
      boardVertices.length;
    const leftOfBoardVertexIndex =
      (bottomLeftVertexIndex + 1) % boardVertices.length;
    this.leftQuarterBoardTopLeft = boardVertices[bottomLeftVertexIndex]
      .add(boardVertices[leftOfBoardVertexIndex])
      .divide(2);
    this.leftQuarterBoardTopRight = HalfboardCoords.BOARD_CENTER;
    this.leftQuarterBoardBottomRight = boardVertices[bottomLeftVertexIndex]
      .add(boardVertices[bottomRightVertexIndex])
      .divide(2);
    this.leftQuarterBoardBottomLeft = boardVertices[bottomLeftVertexIndex];
    this.rightQuarterBoardTopRight = boardVertices[bottomRightVertexIndex]
      .add(boardVertices[rightOfBoardVertexIndex])
      .divide(2);
    this.rightQuarterBoardBottomRight = boardVertices[bottomRightVertexIndex];
  }

  get rightQuarterBoardTopLeft() {
    return this.leftQuarterBoardTopRight;
  }

  get rightQuarterBoardBottomLeft() {
    return this.leftQuarterBoardBottomRight;
  }

  get leftQuarterBoardCorners() {
    return [
      this.leftQuarterBoardTopLeft,
      this.leftQuarterBoardTopRight,
      this.leftQuarterBoardBottomRight,
      this.leftQuarterBoardBottomLeft,
    ] as Quadrilateral;
  }

  get rightQuarterBoardCorners() {
    return [
      this.rightQuarterBoardTopLeft,
      this.rightQuarterBoardTopRight,
      this.rightQuarterBoardBottomRight,
      this.rightQuarterBoardBottomLeft,
    ] as Quadrilateral;
  }

  getSquare(pseudoRank: number, pseudoFile: number) {
    const quarterBoardCorners =
      pseudoFile < HalfboardCoords.NUM_FILES_PER_QUARTER_BOARD
        ? this.leftQuarterBoardCorners
        : this.rightQuarterBoardCorners;
    const adjustedPseudoFile =
      pseudoFile % HalfboardCoords.NUM_FILES_PER_QUARTER_BOARD;
    const topLeftCoords = HalfboardCoords._bilinearInterpolation2D(
      new Vector2D(
        adjustedPseudoFile / HalfboardCoords.NUM_FILES_PER_QUARTER_BOARD,
        (pseudoRank + 1) / HalfboardState.NUM_PSEUDO_RANKS
      ),
      quarterBoardCorners
    );
    const topRightCoords = HalfboardCoords._bilinearInterpolation2D(
      new Vector2D(
        (adjustedPseudoFile + 1) / HalfboardCoords.NUM_FILES_PER_QUARTER_BOARD,
        (pseudoRank + 1) / HalfboardState.NUM_PSEUDO_RANKS
      ),
      quarterBoardCorners
    );
    const bottomRightCoords = HalfboardCoords._bilinearInterpolation2D(
      new Vector2D(
        (adjustedPseudoFile + 1) / HalfboardCoords.NUM_FILES_PER_QUARTER_BOARD,
        pseudoRank / HalfboardState.NUM_PSEUDO_RANKS
      ),
      quarterBoardCorners
    );
    const bottomLeftCoords = HalfboardCoords._bilinearInterpolation2D(
      new Vector2D(
        adjustedPseudoFile / HalfboardCoords.NUM_FILES_PER_QUARTER_BOARD,
        pseudoRank / HalfboardState.NUM_PSEUDO_RANKS
      ),
      quarterBoardCorners
    );
    return [
      topLeftCoords,
      topRightCoords,
      bottomRightCoords,
      bottomLeftCoords,
    ] as Quadrilateral;
  }

  getDarkSquares() {
    const darkSquares: Quadrilateral[] = [];
    // Each quarter-board is a quarter of a regular chessboard, containing 4×4 tiles. The tile in the bottom-left is black
    for (
      let pseudoRank = 0;
      pseudoRank < HalfboardState.NUM_PSEUDO_RANKS;
      pseudoRank++
    ) {
      for (
        let pseudoFile = 0;
        pseudoFile < HalfboardState.NUM_PSEUDO_FILES;
        pseudoFile++
      ) {
        if ((pseudoRank + pseudoFile) % 2 !== 0) {
          continue;
        }
        const darkSquare = this.getSquare(pseudoRank, pseudoFile);
        darkSquares.push(darkSquare);
      }
    }
    return darkSquares;
  }

  // Transforms from a point on the unit square to the matching point within the quadrilateral with coordinates (topLeft, topRight, bottomRight, bottomLeft)
  static _bilinearInterpolation2D(
    start: Vector2D,
    destination: [Vector2D, Vector2D, Vector2D, Vector2D]
  ): Vector2D {
    return destination[0]
      .multiply((1 - start.x) * start.y)
      .add(destination[1].multiply(start.x * start.y))
      .add(destination[2].multiply(start.x * (1 - start.y)))
      .add(destination[3].multiply((1 - start.x) * (1 - start.y)));
  }
}
