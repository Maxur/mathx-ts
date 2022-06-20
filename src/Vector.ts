import { FixedArray } from "./utils.ts";

enum Index {
  X,
  Y,
  Z,
  W,
}

export default class Vector<SIZE extends number> {
  private _values: FixedArray<number, SIZE>;

  /**
   * Build a vector from number array or an other vector.
   * @param values Array of values.
   * @example new Vector([1, 2, 3]) // [1, 2, 3]
   */
  constructor(values: FixedArray<number, SIZE>) {
    this._values = [...values] as FixedArray<number, SIZE>;
  }

  /**
   * Get/Set the list of values.
   */
  get values() {
    return this._values;
  }

  set values(values: FixedArray<number, SIZE>) {
    this._values = [...values] as FixedArray<number, SIZE>;
  }

  /**
   * Get/Set the "x" value.
   */
  get x() {
    return this._values[Index.X];
  }

  set x(x: number) {
    this._values[Index.X] = x;
  }

  /**
   * Get/Set the "y" value.
   */
  get y() {
    return this._values[Index.Y] as SIZE extends 1 ? undefined : number;
  }

  set y(y: number) {
    this._values[Index.Y] = y;
  }

  /**
   * Get/Set the "z" value.
   */
  get z() {
    return this._values[Index.Z] as SIZE extends 1 | 2 ? undefined : number;
  }

  set z(z: number) {
    this._values[Index.Z] = z;
  }

  /**
   * Get/Set the "w" value.
   */
  get w() {
    return this._values[Index.W] as SIZE extends 1 | 2 | 3 ? undefined : number;
  }

  set w(w: number) {
    this._values[Index.W] = w;
  }

  /**
   * Get/Set the number of values.
   */
  get size() {
    return this._values.length;
  }

  /**
   * Copy the vector.
   */
  copy() {
    return new Vector(this._values);
  }

  /**
   * Get the value at the index.
   * @param index
   */
  at(index: number) {
    return this._values.at(index);
  }

  /**
   * Get the magnitude.
   */
  get magnitude() {
    return Math.hypot(...this._values);
  }

  /**
   * Build a new vector by addition.
   * @param vector1 First vector.
   * @param vector2 Second vector.
   */
  static plus<SIZE extends number>(
    vector1: Vector<SIZE>,
    vector2: Vector<SIZE>,
  ) {
    return vector1.copy().plus(vector2);
  }

  /**
   * Add a vector.
   * @param vector Vector to add.
   */
  plus(vector: Vector<SIZE>) {
    const length = this._values.length;
    for (let i = 0; i < length; ++i) {
      this._values[i] += vector._values[i];
    }
    return this;
  }

  /**
   * Build a new vector by subtraction.
   * @param vector1 First vector.
   * @param vector2 Second vector.
   */
  static minus<SIZE extends number>(
    vector1: Vector<SIZE>,
    vector2: Vector<SIZE>,
  ) {
    return vector1.copy().minus(vector2);
  }

  /**
   * Subtract a vector.
   * @param vector Vector to subtract.
   */
  minus(vector: Vector<SIZE>) {
    const length = this._values.length;
    for (let i = 0; i < length; ++i) {
      this._values[i] -= vector._values[i];
    }
    return this;
  }

  /**
   * Return the dot product of 2 vector.
   * @param vector1 First vector.
   * @param vector2 Second vector.
   */
  static dot<SIZE extends number>(
    vector1: Vector<SIZE>,
    vector2: Vector<SIZE>,
  ) {
    return vector1._values.reduce(
      (acc, value, index) => acc += value * vector2._values[index],
      0,
    );
  }

  static scale<SIZE extends number>(vector: Vector<SIZE>, scalar: number) {
    return vector.copy().scale(scalar);
  }

  /**
   * Scale the vector.
   * @param scalar Number to multiply the vector with.
   */
  scale(scalar: number) {
    const length = this._values.length;
    for (let i = 0; i < length; ++i) {
      this._values[i] *= scalar;
    }
    return this;
  }

  /**
   * Build a new vector by normalization.
   * @param vector Vector to normalize.
   */
  static normalize<SIZE extends number>(vector: Vector<SIZE>) {
    return vector.copy().normalize();
  }

  /**
   * Normalize the vector.
   */
  normalize() {
    const magnitude = this.magnitude;
    const length = this._values.length;
    for (let i = 0; i < length; ++i) {
      this._values[i] = this._values[i] / magnitude;
    }
    return this;
  }

  /**
   * Create a new vector with the values between 0 and 1 as "n = n - floor(n)".
   * @param vector Vector to fract.
   */
  static fract<SIZE extends number>(vector: Vector<SIZE>) {
    return vector.copy().fract();
  }

  /**
   * Set the values between 0 and 1 as "n = n - floor(n)".
   */
  fract() {
    const length = this._values.length;
    for (let i = 0; i < length; ++i) {
      this._values[i] -= Math.floor(this._values[i]);
    }
    return this;
  }

  /**
   * Build a new vector 3 by cross product.
   * @param vector1 First vector.
   * @param vector2 Second vector.
   */
  static cross(
    vector1: Vector<3>,
    vector2: Vector<3>,
  ) {
    return vector1.copy().cross(vector2);
  }

  /**
   * Cross product a vector 3.
   * @param vector Vector 3 to cross product.
   */
  cross(vector: Vector<3>) {
    const buffer = [...this._values];
    this._values[Index.X] = buffer[Index.Y] * vector._values[Index.Z] -
      buffer[Index.Z] * vector._values[Index.Y];
    this._values[Index.Y] = buffer[Index.Z] * vector._values[Index.X] -
      buffer[Index.X] * vector._values[Index.Z];
    this._values[Index.Z] = buffer[Index.X] * vector._values[Index.Y] -
      buffer[Index.Y] * vector._values[Index.X];
    return this;
  }

  toString() {
    return `[${this._values.join(", ")}]`;
  }
}
