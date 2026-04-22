// __tests__/scoring.test.ts

import { calcAxisScores, determineType, calcDisplayScore } from '../lib/scoring'
import type { AxisScores } from '../lib/scoring'

describe('calcAxisScores', () => {
  test('全問3点の場合、各軸に正しいスコアを集計する', () => {
    // Q1:S=3, Q2:I=3, Q3:F=3, Q4:A=3, Q5:S=3, Q6:I=3, Q7:[S,A]=3
    const answers = [3, 3, 3, 3, 3, 3, 3]
    const result = calcAxisScores(answers)
    expect(result.S).toBe(9)  // Q1(3) + Q5(3) + Q7(3)
    expect(result.I).toBe(6)  // Q2(3) + Q6(3)
    expect(result.F).toBe(3)  // Q3(3)
    expect(result.A).toBe(6)  // Q4(3) + Q7(3)
  })

  test('全問0点の場合、全軸が0になる', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0]
    const result = calcAxisScores(answers)
    expect(result.S).toBe(0)
    expect(result.I).toBe(0)
    expect(result.F).toBe(0)
    expect(result.A).toBe(0)
  })

  test('混合スコアを正しく集計する', () => {
    // Q1:S=1, Q2:I=2, Q3:F=3, Q4:A=1, Q5:S=2, Q6:I=3, Q7:[S,A]=2
    const answers = [1, 2, 3, 1, 2, 3, 2]
    const result = calcAxisScores(answers)
    expect(result.S).toBe(5)  // Q1(1) + Q5(2) + Q7(2)
    expect(result.I).toBe(5)  // Q2(2) + Q6(3)
    expect(result.F).toBe(3)  // Q3(3)
    expect(result.A).toBe(3)  // Q4(1) + Q7(2)
  })
})

describe('determineType', () => {
  test('最高スコアの軸のタイプを返す', () => {
    const scores: AxisScores = { S: 5, I: 8, F: 3, A: 4 }
    expect(determineType(scores)).toBe('I')
  })

  test('S と I が同点の場合、S を返す（優先順位 S > I > F > A）', () => {
    const scores: AxisScores = { S: 8, I: 8, F: 3, A: 4 }
    expect(determineType(scores)).toBe('S')
  })

  test('全軸同点の場合、S を返す', () => {
    const scores: AxisScores = { S: 5, I: 5, F: 5, A: 5 }
    expect(determineType(scores)).toBe('S')
  })

  test('F のみ最高の場合、F を返す', () => {
    const scores: AxisScores = { S: 2, I: 2, F: 9, A: 2 }
    expect(determineType(scores)).toBe('F')
  })
})

describe('calcDisplayScore', () => {
  test('全問0点（最低回答）で80を返す', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0]
    expect(calcDisplayScore(answers)).toBe(80)
  })

  test('全問3点（最高回答）で100を返す', () => {
    const answers = [3, 3, 3, 3, 3, 3, 3]
    expect(calcDisplayScore(answers)).toBe(100)
  })

  test('どの回答でも80〜100の範囲に収まる', () => {
    const answers = [1, 2, 0, 3, 1, 2, 1]
    const score = calcDisplayScore(answers)
    expect(score).toBeGreaterThanOrEqual(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  test('全問1点でも80以上になる', () => {
    const answers = [1, 1, 1, 1, 1, 1, 1]
    const score = calcDisplayScore(answers)
    expect(score).toBeGreaterThanOrEqual(80)
  })
})
