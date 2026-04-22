// lib/scoring.ts

import { QUESTIONS } from './questions'
import type { ScoreAxis } from './questions'

export type AxisScores = Record<ScoreAxis, number>
export type DiagnosisType = ScoreAxis

// タイプ判定の優先順位: S > I > F > A
const TYPE_PRIORITY: ScoreAxis[] = ['S', 'I', 'F', 'A']
const SCORE_MIN = 80
const SCORE_MAX = 100
const RAW_MAX = 21 // 7問 × 3点

// 回答配列から各軸のスコアを集計する
export function calcAxisScores(answers: number[]): AxisScores {
  const scores: AxisScores = { S: 0, I: 0, F: 0, A: 0 }
  answers.forEach((score, index) => {
    const question = QUESTIONS[index]
    const axes = Array.isArray(question.axis) ? question.axis : [question.axis]
    axes.forEach((axis) => {
      scores[axis] += score
    })
  })
  return scores
}

// 軸スコアからタイプを決定する（同点の場合は優先順位に従う）
export function determineType(axisScores: AxisScores): DiagnosisType {
  const maxScore = Math.max(...Object.values(axisScores))
  return TYPE_PRIORITY.find((axis) => axisScores[axis] === maxScore)!
}

// 回答配列から80〜100の範囲の表示スコアを算出する
export function calcDisplayScore(answers: number[]): number {
  const rawTotal = answers.reduce((sum, s) => sum + s, 0)
  return Math.round(SCORE_MIN + (rawTotal / RAW_MAX) * (SCORE_MAX - SCORE_MIN))
}
