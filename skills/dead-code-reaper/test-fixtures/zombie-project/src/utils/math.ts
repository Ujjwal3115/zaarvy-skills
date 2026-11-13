/**
 * Active math utilities
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * ZOMBIE EXPORT:
 * This was created for an earlier experimental sorting algorithm
 * that was replaced. It has 0 callers in this file and 0 external importers.
 */
export function unusedDeadCalculation(matrix: number[][]): number {
  return matrix.flat().reduce((acc, curr) => acc * curr, 1);
}
