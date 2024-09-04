export default class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector2D) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2D) {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  multiply(other: number) {
    return new Vector2D(this.x * other, this.y * other);
  }

  divide(other: number) {
    return new Vector2D(this.x / other, this.y / other);
  }
}
