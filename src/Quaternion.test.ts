import { assertAlmostEquals, assertEquals } from "../deps.ts";
import Quaternion from "./Quaternion.ts";
import Vector from "./Vector.ts";

Deno.test("Quaternion create", () => {
  const q = new Quaternion([1, 1, 1, 1]);
  assertEquals(q.x, 0.5);
  assertEquals(q.y, 0.5);
  assertEquals(q.z, 0.5);
  assertEquals(q.w, 0.5);
  assertEquals(q.values, [0.5, 0.5, 0.5, 0.5]);
});

Deno.test("Quaternion fromAxis", () => {
  const q1 = Quaternion.fromAxis(new Vector([0, 0, 0]), 0);
  const q2 = Quaternion.fromAxis(new Vector([1, 0, 0]), Math.PI / 2);
  const q3 = Quaternion.fromAxis(
    new Vector([0, Math.sqrt(0.5), Math.sqrt(0.5)]),
    Math.PI / 2,
  );
  assertEquals(q1.values, [0, 0, 0, 1]);
  assertAlmostEquals(q2.x, Math.sqrt(0.5));
  assertAlmostEquals(q2.y, 0);
  assertAlmostEquals(q2.z, 0);
  assertAlmostEquals(q2.w, Math.sqrt(0.5));
  assertAlmostEquals(q3.x, 0);
  assertAlmostEquals(q3.y, 0.5);
  assertAlmostEquals(q3.z, 0.5);
  assertAlmostEquals(q3.w, Math.cos(Math.PI / 4));
});

Deno.test("Quaternion multiply", () => {
  const q1 = new Quaternion([Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)]);
  const q2 = new Quaternion([0, 0.5, 0.5, Math.cos(Math.PI / 4)]);
  const q = Quaternion.multiply(q1, q2);
  assertAlmostEquals(q.x, 0.5);
  assertAlmostEquals(q.y, Math.sqrt(0.5));
  assertAlmostEquals(q.z, 0);
  assertAlmostEquals(q.w, 0.5);
});

Deno.test("Quaternion toString", () => {
  const q = new Quaternion([0.5, 0.5, 0.5, 0.5]);
  const str = q.toString();
  assertEquals(str, "[0.5, 0.5, 0.5, 0.5]");
});
