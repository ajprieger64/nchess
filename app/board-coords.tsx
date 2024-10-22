import HalfboardCoords from "./halfboard-coords";
import SquareIndex from "./square-index";
import Vector2D from "./vector";

// TODO: Check whether the board would look better if this were dynamically based on the number of sides
const MAX_ALLOWABLE_Y = 1 / 3;

export default class BoardCoords {
  halfboards: HalfboardCoords[];
  boardVertices: Vector2D[];
  constructor(numPlayers: number, zoomStrength: number, zoomAngle: number) {
    const numSides = numPlayers * 2;
    this.boardVertices = [];
    const maxZoomStrength = BoardCoords._getMaxZoomStrength(
      1 / numSides,
      MAX_ALLOWABLE_Y
    );
    for (let i = 0; i < numSides; i++) {
      const canonicalAngle =
        ((2 * Math.PI) / numSides) * (i - 0.5) + Math.PI / 2;
      const boundedZoomStrength = Math.min(
        zoomStrength * maxZoomStrength,
        maxZoomStrength
      );
      const angularDistance =
        ((((canonicalAngle - zoomAngle + Math.PI) % (2 * Math.PI)) +
          2 * Math.PI) %
          (2 * Math.PI)) -
        Math.PI;
      const transformedAngularDistance =
        BoardCoords._zoomTransformation(
          boundedZoomStrength,
          angularDistance / Math.PI
        ) * Math.PI;
      const angle = zoomAngle + transformedAngularDistance;
      const coords = new Vector2D(Math.cos(angle), Math.sin(angle));
      const unitSquareCoords = coords.add(new Vector2D(1, 1)).divide(2);
      this.boardVertices.push(unitSquareCoords);
    }
    this.halfboards = [];
    for (let boardIndex = 0; boardIndex < numPlayers; boardIndex++) {
      this.halfboards.push(new HalfboardCoords(this.boardVertices, boardIndex));
    }
  }

  getSquare(index: SquareIndex) {
    return this.halfboards[index.halfboard].getSquare(
      index.pseudoRank,
      index.pseudoFile
    );
  }

  static _zoomTransformation(strength: number, x: number) {
    return Math.sign(x) * Math.abs(x) ** (1 / (strength + 1));
  }

  static _getMaxZoomStrength(x: number, maxAllowableY: number) {
    return Math.log(x) / Math.log(maxAllowableY) - 1;
  }
}
