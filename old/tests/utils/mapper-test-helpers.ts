import { expect } from 'vitest';

export const expectMapsArray = <T, R>(
  mapperFn: (items: T[]) => R[],
  input: T[],
  expected: R[]
) => {
  const result = mapperFn(input);
  expect(result).toHaveLength(expected.length);
  expect(result).toEqual(expected);
};

export const expectHandlesEmptyArray = <T, R>(
  mapperFn: (items: T[]) => R[]
) => {
  const result = mapperFn([]);
  expect(Array.isArray(result)).toBe(true);
  expect(result).toHaveLength(0);
};

export const expectMapsObject = <T, R>(
  mapperFn: (item: T) => R,
  input: T,
  expected: R
) => {
  const result = mapperFn(input);
  expect(result).toEqual(expected);
};
