/**
 * TODO: Expand
 */

function add(a: number, b: number): number {
  return a + b
}

describe('Basic Backend Tests', () => {
  test('add function should correctly add two numbers', () => {
    expect(add(1, 2)).toBe(3)
    expect(add(0, 0)).toBe(0)
    expect(add(-1, 1)).toBe(0)
  })
})
