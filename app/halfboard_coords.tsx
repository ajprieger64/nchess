import Vector2D from "./vector";
const BOARD_CENTER = new Vector2D(0.5, 0.5);
const NUM_LINEAR_TILES_PER_BOARD = 4;

type Quadrilateral = [Vector2D, Vector2D, Vector2D, Vector2D];

export default class HalfboardCoords {
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
    The halfboard numbered '0' has bottom corners at indices 0 and 1 in the boardVertices array */
    const bottomLeftVertexIndex = (2 * boardNumber) % boardVertices.length;
    const bottomRightVertexIndex =
      (bottomLeftVertexIndex + 1) % boardVertices.length;
    // Added % term needed to take modulo properly because index could be negative
    const leftOfBoardVertexIndex =
      (((bottomLeftVertexIndex - 1) % boardVertices.length) +
        boardVertices.length) %
      boardVertices.length;
    const rightOfBoardVertexIndex =
      (bottomRightVertexIndex + 1) % boardVertices.length;
    this.leftQuarterBoardTopLeft = boardVertices[bottomLeftVertexIndex]
      .add(boardVertices[leftOfBoardVertexIndex])
      .divide(2);
    this.leftQuarterBoardTopRight = BOARD_CENTER;
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

  get leftQuarterBoardCoords() {
    return [
      this.leftQuarterBoardTopLeft,
      this.leftQuarterBoardTopRight,
      this.leftQuarterBoardBottomRight,
      this.leftQuarterBoardBottomLeft,
    ] as Quadrilateral;
  }

  get rightQuarterBoardCoords() {
    return [
      this.rightQuarterBoardTopLeft,
      this.rightQuarterBoardTopRight,
      this.rightQuarterBoardBottomRight,
      this.rightQuarterBoardBottomLeft,
    ] as Quadrilateral;
  }

  getDarkSquares() {
    const darkSquares: Quadrilateral[] = [];
    // Each quarter-board is a quarter of a regular chessboard, containing 4×4 tiles. The tile in the bottom-left is black
    for (const quarterBoardCoords of [
      this.leftQuarterBoardCoords,
      this.rightQuarterBoardCoords,
    ]) {
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
            HalfboardCoords._bilinearInterpolation2D(
              topLeftUnitSquareCoords,
              quarterBoardCoords
            ),
            HalfboardCoords._bilinearInterpolation2D(
              topRightUnitSquareCoords,
              quarterBoardCoords
            ),
            HalfboardCoords._bilinearInterpolation2D(
              bottomRightUnitSquareCoords,
              quarterBoardCoords
            ),
            HalfboardCoords._bilinearInterpolation2D(
              bottomLeftUnitSquareCoords,
              quarterBoardCoords
            ),
          ] as Quadrilateral;
          darkSquares.push(transformedCoords);
        }
      }
    }
    return darkSquares;
  }

  // Transforms from a point on the unit square to the matching point within the quadrilateral with coordinates (topLeft, topRight, bottomRight, bottomLeft)
  static _bilinearInterpolation2D(
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
}
