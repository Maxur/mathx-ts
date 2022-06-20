import { assertEquals, assertExists } from "../deps.ts";
import Matrix from "./Matrix.ts";
import Vector from "./Vector.ts";
import Quaternion from "./Quaternion.ts";

Deno.test("Matrix create", () => {
  const m = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  assertEquals(m.rows, 2);
  assertEquals(m.columns, 3);
  assertEquals(m.values, [1, 2, 3, 4, 5, 6]);
});

Deno.test("Matrix at", () => {
  const m = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  assertEquals(m.at(0, 0), 1);
  assertEquals(m.at(1, 0), 2);
  assertEquals(m.at(0, 1), 3);
  assertEquals(m.at(1, 1), 4);
  assertEquals(m.at(0, 2), 5);
  assertEquals(m.at(1, 2), 6);
});

Deno.test("Matrix equals", () => {
  const m = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  const m2 = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  const m3 = new Matrix(2, 3, [1, 2, 3, 4, 5, 7]);
  assertEquals(m.equals(m2), true);
  assertEquals(m.equals(m3), false);
});

Deno.test("Matrix identity", () => {
  const m = Matrix.identity(3);
  assertEquals(m.values, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
});

Deno.test("Matrix plus", () => {
  const m1 = new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const m2 = new Matrix(3, 3, [0, 2, 4, 6, 8, 10, 12, 14, 16]);
  assertEquals(Matrix.plus(m1, m2).values, [1, 4, 7, 10, 13, 16, 19, 22, 25]);
});

Deno.test("Matrix minus", () => {
  const m1 = new Matrix(3, 3, [0, 2, 4, 6, 8, 10, 12, 14, 16]);
  const m2 = new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assertEquals(Matrix.minus(m1, m2).values, [-1, 0, 1, 2, 3, 4, 5, 6, 7]);
});

Deno.test("Matrix multiply", () => {
  const m1 = new Matrix(3, 2, [1, 2, 3, 4, 5, 6]);
  assertEquals(Matrix.multiply(m1, 2).values, [2, 4, 6, 8, 10, 12]);
});

Deno.test("Matrix dot matrix", () => {
  const m1 = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  const m2 = new Matrix(3, 2, [7, 8, 9, 10, 11, 12]);
  const m = Matrix.dot(m1, m2);
  assertEquals(m.shape, [2, 2]);
  assertEquals(m.values, [76, 100, 103, 136]);
});

Deno.test("Matrix dot vector", () => {
  const m1 = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  const v1 = new Vector([7, 8, 9]);
  const v = Matrix.dot(m1, v1);
  assertEquals(v.values, [76, 100]);
});

Deno.test("Matrix reshape", () => {
  const m = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]).reshape(3, 4);
  assertEquals(m.shape, [3, 4]);
  assertEquals(m.values, [1, 2, 3, 4, 5, 6, 0, 0, 0, 0, 0, 0]);
});

Deno.test("Matrix transpose", () => {
  const m = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]).transpose();
  assertEquals(m.shape, [3, 2]);
  assertEquals(m.values, [1, 3, 5, 2, 4, 6]);
});

Deno.test("Matrix minor", () => {
  const m = new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const min = Matrix.minor(m, 1, 2);
  assertEquals(min.shape, [2, 2]);
  assertEquals(min.values, [1, 3, 4, 6]);
});

Deno.test("Matrix determinant", () => {
  const m1 = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  const m2 = new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const m3 = new Matrix(3, 3, [10, 2, 3, 4, 5, 6, 7, 8, 9]);
  const m4 = new Matrix(
    4,
    4,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  );
  const m5 = new Matrix(
    4,
    4,
    [10, 2, 3, 4, 5, 60, 7, 8, 9, 10, 110, 12, 13, 14, 15, 160],
  );
  assertEquals(m1.determinant, undefined);
  assertEquals(m2.determinant, 0);
  assertEquals(m3.determinant, -27);
  assertEquals(m4.determinant, 0);
  assertEquals(m5.determinant, 9612432);
});

Deno.test("Matrix invert", () => {
  const m1 = new Matrix(1, 1, [2]);
  const inv1 = Matrix.invert(m1);
  const m2 = new Matrix(2, 2, [1, 2, 3, 4]);
  const inv2 = Matrix.invert(m2);
  const m3 = new Matrix(3, 3, [1, 2, 3, 2, 3, 2, 3, 2, 1]);
  const inv3 = Matrix.invert(m3);
  const m4 = new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const inv4 = Matrix.invert(m4);
  assertExists(inv1);
  assertEquals(inv1.values, [0.5]);
  assertExists(inv2);
  assertEquals(inv2.values, [-2, 1, 1.5, -0.5]);
  assertExists(inv3);
  assertEquals(
    inv3.values,
    [0.125, -0.5, 0.625, -0.5, 1, -0.5, 0.625, -0.5, 0.125],
  );
  assertEquals(inv4, undefined);
});

Deno.test("Matrix perspective", () => {
  const m1 = Matrix.perspective(90, 0.5, 50, 100);
  assertEquals(m1.values, [
    Math.tan(Math.PI * 0.5 - 45) / 0.5,
    0,
    0,
    0,
    0,
    Math.tan(Math.PI * 0.5 - 45),
    0,
    0,
    0,
    0,
    -3,
    -1,
    0,
    0,
    -200,
    0,
  ]);
});

Deno.test("Matrix translation", () => {
  const m1 = Matrix.translation(new Vector([10, 20, 30]));
  assertEquals(m1.values, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1]);
});

Deno.test("Matrix fromQuaternion", () => {
  const m1 = Matrix.fromQuaternion(new Quaternion([0, 0, 0, 1]));
  const m2 = Matrix.fromQuaternion(new Quaternion([1, 0, 0, 0]));
  const m3 = Matrix.fromQuaternion(new Quaternion([0.5, 0.5, 0.5, 0.5]));
  assertEquals(m1.values, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  assertEquals(m2.values, [1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]);
  assertEquals(m3.values, [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1]);
});

Deno.test("Matrix toString", () => {
  const m = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  assertEquals(m.toString(), `[1, 3, 5]\n[2, 4, 6]`);
});
