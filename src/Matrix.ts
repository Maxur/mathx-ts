import Vector from "./Vector.ts";
import Quaternion from "./Quaternion.ts";
import { FixedArray, Minus, Multiply, Plus, Range } from "./utils.ts";

type MAX_ROWCOLUMN = 8;
type RowColumn = Range<1, Plus<MAX_ROWCOLUMN, 1>>;
type RowColumnMinorable = Range<2, Plus<MAX_ROWCOLUMN, 1>>;

export default class Matrix<ROWS extends RowColumn, COLUMNS extends RowColumn> {
  private _rows: ROWS;
  private _columns: COLUMNS;
  private _values: FixedArray<number, Multiply<ROWS, COLUMNS>>;

  /**
   * Build a matrix from number array or an other matrix.
   * @param rows Number of rows.
   * @param columns Number of columns.
   * @param values Array of values in column-major order.
   * @example new Matrix(2, 3, [1, 2, 3, 4, 5, 6]) // [1, 3, 5]
   *                                               // [2, 4, 6]
   */
  constructor(
    rows: ROWS,
    columns: COLUMNS,
    values?: FixedArray<number, Multiply<ROWS, COLUMNS>>,
  ) {
    this._values = new Array(columns * rows).fill(0) as FixedArray<
      number,
      Multiply<ROWS, COLUMNS>
    >;
    if (values) {
      values.forEach((v, i) => this.values[i] = v);
    }
    this._columns = columns;
    this._rows = rows;
  }

  /**
   * Get the number of rows.
   */
  get rows() {
    return this._rows;
  }

  /**
   * Get the number of columns.
   */
  get columns() {
    return this._columns;
  }

  /**
   * Get the list of values.
   */
  get values() {
    return this._values;
  }

  /**
   * Copy the matrix.
   */
  copy() {
    return new Matrix(this.rows, this.columns, this.values);
  }

  /**
   * Get the value at the row and column index. Index starts at 0.
   * @param row Row index.
   * @param column Column index.
   */
  at(row: number, column: number) {
    return this._values.at(this.rows * column + row);
  }

  /**
   * Build an identity matrix.
   * @param columnsAndRows Number of columns and rows.
   * @example
   *                    // [1, 0, 0]
   * Matrix.identity(3) // [0, 1, 0]
   *                    // [0, 0, 1]
   */
  static identity<I extends RowColumn>(columnsAndRows: I) {
    const matrix = new Matrix(columnsAndRows, columnsAndRows);
    const length = Math.pow(columnsAndRows, 2);
    for (let i = 0; i < length; i += columnsAndRows + 1) {
      matrix._values[i] = 1;
    }
    return matrix;
  }

  /**
   * Get the number of rows and columns.
   */
  get shape(): [ROWS, COLUMNS] {
    return [this._rows, this._columns];
  }

  /**
   * Reshape the matrix.
   * @param rows number of rows.
   * @param columns number of columns.
   * @example
   *                                                          // [1, 4]
   * new Matrix(2, 3, [1, 2, 3, 4, 5, 6], 3, 2).reshape(3, 2) // [2, 5]
   *                                                          // [3, 6]
   */
  reshape<R extends RowColumn, C extends RowColumn>(rows: R, columns: C) {
    const oldLength = this._rows * this._columns;
    (this._values as unknown as FixedArray<number, Multiply<R, C>>)
      .length = rows * columns as Multiply<R, C>;
    if (this._values.length > oldLength) {
      this._values.fill(0, oldLength);
    }
    (this as unknown as Matrix<R, C>)._columns = columns;
    (this as unknown as Matrix<R, C>)._rows = rows;
    return this as unknown as Matrix<R, C>;
  }

  /**
   * Transpose the matrix.
   * @example
   *                                                  // [1, 2]
   * new Matrix(2, 3, [1, 2, 3, 4, 5, 6]).transpose() // [3, 4]
   *                                                  // [5, 6]
   */
  transpose() {
    const buffer = [...this._values];
    for (let i = 0; i < this._rows; ++i) {
      for (let j = 0; j < this._columns; ++j) {
        this._values[i * this._columns + j] = buffer[j * this._rows + i];
      }
    }
    const oldColumns = this._columns;
    (this as unknown as Matrix<COLUMNS, ROWS>)._columns = this._rows;
    (this as unknown as Matrix<COLUMNS, ROWS>)._rows = oldColumns;
    return this as unknown as Matrix<COLUMNS, ROWS>;
  }

  /**
   * Check matrix equality.
   * @param matrix Matrix to check with.
   */
  equals(matrix: Matrix<ROWS, COLUMNS>) {
    return this._rows === matrix._rows && this._columns === matrix._columns &&
      this._values.every((value, index) => value === matrix._values[index]);
  }

  /**
   * Build a new matrix by addition.
   * @param m1 First matrix.
   * @param m2 Second matrix.
   */
  static plus<ROWS extends RowColumn, COLUMNS extends RowColumn>(
    m1: Matrix<ROWS, COLUMNS>,
    m2: Matrix<ROWS, COLUMNS>,
  ) {
    return m1.copy().plus(m2);
  }

  /**
   * Add a matrix.
   * @param matrix to add.
   */
  plus(matrix: Matrix<ROWS, COLUMNS>) {
    const length = this._values.length;
    for (let i = 0; i < length; ++i) {
      this._values[i] += matrix._values[i];
    }
    return this;
  }

  /**
   * Build a new matrix by subtraction.
   * @param m1 First matrix.
   * @param m2 Second matrix.
   */
  static minus<ROWS extends RowColumn, COLUMNS extends RowColumn>(
    m1: Matrix<ROWS, COLUMNS>,
    m2: Matrix<ROWS, COLUMNS>,
  ) {
    return m1.copy().minus(m2);
  }

  /**
   * Subtract a matrix.
   * @param matrix Matrix to subtract.
   */
  minus(matrix: Matrix<ROWS, COLUMNS>) {
    const length = this._values.length;
    for (let i = 0; i < length; ++i) {
      this._values[i] -= matrix._values[i];
    }
    return this;
  }

  /**
   * Build a new matrix by multiplication.
   * @param m1 First matrix.
   * @param n number.
   */
  static multiply<ROWS extends RowColumn, COLUMNS extends RowColumn>(
    m1: Matrix<ROWS, COLUMNS>,
    n: number,
  ) {
    return m1.copy().multiply(n);
  }

  /**
   * Multiply a matrix.
   * @param n number to multiply.
   */
  multiply(n: number) {
    const length = this._values.length;
    for (let i = 0; i < length; ++i) {
      this._values[i] *= n;
    }
    return this;
  }

  /**
   * Build a new matrix by dot product.
   * @param matrix1 First matrix.
   * @param matrix2 Second matrix or vector.
   */
  static dot<
    ROWS extends RowColumn,
    COLUMNS extends RowColumn,
    COLUMNS2 extends RowColumn,
  >(
    matrix1: Matrix<ROWS, COLUMNS>,
    matrix2: Matrix<COLUMNS, COLUMNS2>,
  ): Matrix<ROWS, COLUMNS2>;
  static dot<
    ROWS extends RowColumn,
    COLUMNS extends RowColumn,
  >(
    matrix1: Matrix<ROWS, COLUMNS>,
    matrix2: Vector<COLUMNS>,
  ): Vector<ROWS>;
  static dot<
    ROWS extends RowColumn,
    COLUMNS extends RowColumn,
  >(
    matrix1: Matrix<ROWS, COLUMNS>,
    matrix2: Matrix<COLUMNS, RowColumn> | Vector<COLUMNS>,
  ) {
    if (matrix2 instanceof Matrix) {
      return matrix1.copy().dot(matrix2);
    }
    const buffer = new Array(matrix1.rows).fill(0) as FixedArray<
      number,
      ROWS
    >;
    for (let i = 0; i < matrix1._rows; ++i) {
      for (let j = 0; j < matrix1._columns; ++j) {
        buffer[i] += matrix1._values[j * matrix1._rows + i] * matrix2.values[j];
      }
    }
    return new Vector(buffer);
  }

  /**
   * Dot product a matrix.
   * @param matrix Matrix to dot product.
   */
  dot<COLUMNS2 extends RowColumn>(matrix: Matrix<COLUMNS, COLUMNS2>) {
    const buffer = new Array(this._values.length).fill(0);
    for (let i = 0; i < this._rows; ++i) {
      for (let j = 0; j < this._rows; ++j) {
        for (let k = 0; k < this._columns; ++k) {
          buffer[i * this._rows + j] += this.values[k * this._rows + j] *
            matrix._values[i * this._columns + k];
        }
      }
    }
    this._values = [...buffer] as FixedArray<
      number,
      Multiply<ROWS, COLUMNS>
    >;
    return this.reshape(this._rows, matrix._columns);
  }

  /**
   * Get the determinant.
   */
  get determinant(): COLUMNS extends ROWS ? number : undefined {
    const columns = this._columns;
    if (columns !== this._rows as number) {
      return undefined as COLUMNS extends ROWS ? number : undefined;
    }
    switch (columns) {
      case 1:
        return this._values[0] as COLUMNS extends ROWS ? number : undefined;
      case 2:
        return this._values[0] * this._values[3] -
          this._values[2] * this._values[1] as COLUMNS extends ROWS ? number
            : undefined;
      default: {
        let det = 0;
        for (let i = 0; i < columns; ++i) {
          const minor = Matrix.minor(
            this as unknown as Matrix<RowColumnMinorable, RowColumnMinorable>,
            0,
            i as Range<0, RowColumn>,
          );
          det += (-1) ** i * this._values[Math.floor(i * columns)] *
            minor.determinant;
        }
        return det as COLUMNS extends ROWS ? number : undefined;
      }
    }
  }

  /**
   * Build a new minor matrix by removing a column and a row.
   * @param matrix The matrix.
   * @param rowToRemove The row to remove.
   * @param columnToRemove The column to remove.
   */
  static minor<
    ROWS extends RowColumnMinorable,
    COLUMNS extends RowColumnMinorable,
  >(
    matrix: Matrix<ROWS, COLUMNS>,
    rowToRemove: Range<0, ROWS>,
    columnToRemove: Range<0, COLUMNS>,
  ) {
    const rows = matrix._rows;
    const columns = matrix._columns;
    return new Matrix(
      rows - 1 as RowColumn,
      columns - 1 as RowColumn,
      matrix._values.filter((_, i) =>
        i % rows !== rowToRemove && Math.floor(i / rows) !== columnToRemove
      ) as FixedArray<number, Multiply<RowColumn, RowColumn>>,
    ) as unknown as Matrix<
      Minus<ROWS, 1> extends RowColumn ? Minus<ROWS, 1> : never,
      Minus<COLUMNS, 1> extends RowColumn ? Minus<COLUMNS, 1> : never
    >;
  }

  /**
   * Build the inverse of a matrix.
   * @param matrix The matrix.
   */
  static invert<
    ROWS extends RowColumn,
    COLUMNS extends RowColumn,
  >(
    matrix: Matrix<ROWS, COLUMNS>,
  ) {
    const columns = matrix._columns;
    const det = matrix.determinant;
    return !det ? undefined : columns === 1
      ? new Matrix(
        1 as ROWS,
        1 as COLUMNS,
        [1 / (det as number)] as FixedArray<
          number,
          Multiply<ROWS, COLUMNS>
        >,
      )
      : new Matrix(
        matrix._rows,
        columns,
        matrix._values.map((_, i) =>
          (-1) ** (i + (columns % 2 ? 0 : Math.floor(i / columns))) * // Prevent sign change on next column if matrix is even
          Matrix.minor(
            matrix as unknown as Matrix<RowColumnMinorable, RowColumnMinorable>,
            i % columns as Range<0, RowColumn>,
            Math.floor(i / columns) as Range<0, RowColumn>,
          ).determinant
        ) as FixedArray<number, Multiply<ROWS, COLUMNS>>,
      ).transpose().multiply(1 / (det as number));
  }

  /**
   * Create a perspective matrix.
   * @param angle Angle in radian
   * @param aspect Aspect as "Width / Height"
   * @param near Nearest "z" distance
   * @param far Farthest "z" distance
   */
  static perspective(
    angle: number,
    aspect: number,
    near: number,
    far: number,
  ) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * angle);
    const rangeInv = 1.0 / (near - far);
    return new Matrix(4, 4, [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    ]);
  }

  /**
   * Create a translation matrix from a vector.
   * @param vector Translation vector
   */
  static translation(vector: Vector<3>) {
    return new Matrix(4, 4, [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      vector.x,
      vector.y,
      vector.z,
      1,
    ]);
  }

  /**
   * Create a rotation matrix from a quaternion.
   * @param quaternion The quaternion
   */
  static fromQuaternion(quaternion: Quaternion) {
    const [x, y, z, w] = [
      quaternion.x,
      quaternion.y,
      quaternion.z,
      quaternion.w,
    ];
    return new Matrix(4, 4, [
      1 - 2 * y * y - 2 * z * z,
      2 * x * y + 2 * w * z,
      2 * x * z - 2 * w * y,
      0,
      2 * x * y - 2 * w * z,
      1 - 2 * x * x - 2 * z * z,
      2 * y * z + 2 * w * x,
      0,
      2 * x * z + 2 * w * y,
      2 * y * z - 2 * w * x,
      1 - 2 * x * x - 2 * y * y,
      0,
      0,
      0,
      0,
      1,
    ]);
  }

  toString() {
    const rows = [];
    for (let i = 0; i < this._rows; ++i) {
      const columns = [];
      for (let j = 0; j < this._columns; ++j) {
        columns.push(this._values.at(j * this._rows + i));
      }
      rows.push(`[${columns.join(", ")}]`);
    }
    return rows.join("\n").toString();
  }
}
