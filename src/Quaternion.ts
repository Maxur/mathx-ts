import Vector from "./Vector.ts";
import { FixedArray } from "./utils.ts";

enum Index {
  X,
  Y,
  Z,
  W,
}

export default class Quaternion {
  public _values: FixedArray<number, 4>;

  /**
   * Build a quaternion from number array.
   * @param xyzw Array of 4 values.
   * @example new Quaternion([0, 0, 0, 1]) // [0, 0, 0, 1]
   */
  constructor(xyzw: FixedArray<number, 4>) {
    this._values = xyzw;
    this.normalize();
  }

  get values() {
    return this._values;
  }

  get x() {
    return this._values[Index.X];
  }

  get y() {
    return this._values[Index.Y];
  }

  get z() {
    return this._values[Index.Z];
  }

  get w() {
    return this._values[Index.W];
  }

  copy() {
    return new Quaternion(this._values);
  }

  /**
   * Build a new quaternion from an axis.
   * @param axis Rotation axis.
   * @param angle Rotation angle.
   */
  static fromAxis(axis: Vector<3>, angle: number) {
    const a2 = angle / 2;
    const sa2 = Math.sin(a2);
    return new Quaternion([
      axis.x * sa2,
      axis.y * sa2,
      axis.z * sa2,
      Math.cos(a2),
    ]);
  }

  private normalize() {
    const magnitude = Math.sqrt(
      this._values.reduce((acc, value) => acc += value * value, 0),
    );
    for (let i = 0; i < 4; ++i) {
      this._values[i] = this._values[i] / magnitude;
    }
    return this;
  }

  /**
   * Build a new quaternion by multiplication.
   * @param q1 First quaternion.
   * @param q2 Second quaternion.
   */
  static multiply(
    q1: Quaternion,
    q2: Quaternion,
  ) {
    return q1.copy().multiply(q2);
  }

  /**
   * Multiply a quaternion.
   * @param q Quaternion to multiply.
   */
  multiply(q: Quaternion) {
    const buffer = [...this._values];
    this._values[Index.X] = q.w * buffer[Index.X] + q.x * buffer[Index.W] +
      q.y * buffer[Index.Z] - q.z * buffer[Index.Y];
    this._values[Index.Y] = q.w * buffer[Index.Y] + q.y * buffer[Index.W] +
      q.z * buffer[Index.X] - q.x * buffer[Index.Z];
    this._values[Index.Z] = q.w * buffer[Index.Z] + q.z * buffer[Index.W] +
      q.x * buffer[Index.Y] - q.y * buffer[Index.X];
    this._values[Index.W] = q.w * buffer[Index.W] - q.x * buffer[Index.X] -
      q.y * buffer[Index.Y] - q.z * buffer[Index.Z];
    return this;
  }

  toString() {
    return `[${this._values.join(", ")}]`;
  }
}
