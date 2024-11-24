import Vector2D from "./vector";

export type Quadrilateral = readonly [Vector2D, Vector2D, Vector2D, Vector2D];

export function fillQuad(ctx: CanvasRenderingContext2D, quad: Quadrilateral) {
  const path = new Path2D();
  path.moveTo(quad[0].x, quad[0].y);
  path.lineTo(quad[1].x, quad[1].y);
  path.lineTo(quad[2].x, quad[2].y);
  path.lineTo(quad[3].x, quad[3].y);
  path.closePath();
  ctx.fill(path);
}

export function strokeQuad(ctx: CanvasRenderingContext2D, quad: Quadrilateral) {
  const path = new Path2D();
  path.moveTo(quad[0].x, quad[0].y);
  path.lineTo(quad[1].x, quad[1].y);
  path.lineTo(quad[2].x, quad[2].y);
  path.lineTo(quad[3].x, quad[3].y);
  path.closePath();
  ctx.stroke(path);
}

export function isInsideQuadrilateral(
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
