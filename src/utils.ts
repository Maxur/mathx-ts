type Next = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
];

type Previous = [
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
];

type Plus<A extends number, B extends number, C extends number = 0> = C extends
  B ? A : Next[A] extends number ? Plus<Next[A], B, Next[C]> : number;

type Minus<A extends number, B extends number, C extends number = 0> = C extends
  B ? A : Previous[A] extends number ? Minus<Previous[A], B, Next[C]> : number;

type Multiply<A extends number, B extends number, C extends number = 0> =
  A extends 0 ? C
    : Next[Plus<B, C>] extends number ? Multiply<Minus<A, 1>, B, Plus<B, C>>
    : number;

type Range<
  A extends number = 0,
  B extends number = 1,
  C extends keyof number[] = A,
> = A extends B ? C : Range<Plus<A, 1>, B, C | A>;

interface FixedArray<T, L extends number> extends Array<T> {
  0: T;
  length: L;
}

export type { FixedArray, Minus, Multiply, Plus, Range };
