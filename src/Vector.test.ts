import { assertEquals } from "../deps.ts";
import Vector from "./Vector.ts";

Deno.test("Vector create", () => {
  const v = new Vector([1, 2, 3, 4]);
  assertEquals(v.size, 4);
  assertEquals(v.x, 1);
  assertEquals(v.y, 2);
  assertEquals(v.z, 3);
  assertEquals(v.w, 4);
  assertEquals(v.at(0), 1);
  assertEquals(v.at(1), 2);
  assertEquals(v.at(2), 3);
  assertEquals(v.at(3), 4);
});

Deno.test("Vector plus", () => {
  const v1 = new Vector([1, 2, 3]);
  const v2 = new Vector([0, 2, 4]);
  const v = Vector.plus(v1, v2);
  assertEquals(v.at(0), 1);
  assertEquals(v.at(1), 4);
  assertEquals(v.at(2), 7);
});

Deno.test("Vector minus", () => {
  const v1 = new Vector([0, 2, 4]);
  const v2 = new Vector([1, 2, 3]);
  const v = Vector.minus(v1, v2);
  assertEquals(v.at(0), -1);
  assertEquals(v.at(1), 0);
  assertEquals(v.at(2), 1);
});

Deno.test("Vector scale", () => {
  const v = new Vector([1, 2, 3]);
  const scale = Vector.scale(v, 2);
  assertEquals(scale.at(0), 2);
  assertEquals(scale.at(1), 4);
  assertEquals(scale.at(2), 6);
});

Deno.test("Vector dot", () => {
  const v1 = new Vector([1, 2, 3]);
  const v2 = new Vector([4, 5, 6]);
  const dot = Vector.dot(v1, v2);
  assertEquals(dot, 32);
});

Deno.test("Vector cross", () => {
  const v1 = new Vector([1, 2, 3]);
  const v2 = new Vector([4, 5, 6]);
  const dot = Vector.cross(v1, v2);
  assertEquals(dot.at(0), -3);
  assertEquals(dot.at(1), 6);
  assertEquals(dot.at(2), -3);
});

Deno.test("Vector magnitude", () => {
  const v = new Vector([0, 3, 4]);
  assertEquals(v.magnitude, 5);
});

Deno.test("Vector normalize", () => {
  const v = new Vector([0, 3, 4]);
  const normalize = Vector.normalize(v);
  assertEquals(normalize.at(0), 0);
  assertEquals(normalize.at(1), 0.6);
  assertEquals(normalize.at(2), 0.8);
});

Deno.test("Vector toString", () => {
  const v = new Vector([1, 2, 3]);
  const str = v.toString();
  assertEquals(str, "[1, 2, 3]");
});
