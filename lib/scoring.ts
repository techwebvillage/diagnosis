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

// QUESTIONSから軸ごとの質問数を集計（複合軸は各軸で1カウント）
const AXIS_COUNTS: AxisScores = QUESTIONS.reduce(
  (acc, q) => {
    const axes = Array.isArray(q.axis) ? q.axis : [q.axis]
    axes.forEach((a) => {
      acc[a] += 1
    })
    return acc
  },
  { S: 0, I: 0, F: 0, A: 0 } as AxisScores,
)

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

// 軸ごとの質問数で割って平均スコアを算出する（軸あたりの質問数の偏りを吸収）
export function calcAxisAverages(answers: number[]): AxisScores {
  const sums = calcAxisScores(answers)
  return {
    S: AXIS_COUNTS.S > 0 ? sums.S / AXIS_COUNTS.S : 0,
    I: AXIS_COUNTS.I > 0 ? sums.I / AXIS_COUNTS.I : 0,
    F: AXIS_COUNTS.F > 0 ? sums.F / AXIS_COUNTS.F : 0,
    A: AXIS_COUNTS.A > 0 ? sums.A / AXIS_COUNTS.A : 0,
  }
}

// 回答合計点（0〜21）からタイプを振り分ける同点時のタイブレーカー
// 全問同一回答などで最大軸が複数並ぶ場合に、回答の強度（全体的な肯定度）で分岐させる
export function tieBreakerByRawTotal(rawTotal: number): DiagnosisType {
  if (rawTotal >= 18) return 'A' // 全方位に強く反応＝成果志向
  if (rawTotal >= 11) return 'S' // バランス良く反応＝積み上げ型
  if (rawTotal >= 4) return 'I'  // 全体的に弱く反応＝現状への小さな疑問＝改善志向
  return 'F'                     // 特定の志向なし＝縛られない自由型
}

// 軸スコアからタイプを決定する
// 最大軸が複数並ぶ（タイ）場合、rawTotal が渡されていればそれで振り分け、
// 渡されていなければ優先順位 (S > I > F > A) に従う
export function determineType(axisScores: AxisScores, rawTotal?: number): DiagnosisType {
  const maxScore = Math.max(...Object.values(axisScores))
  const tiedCount = Object.values(axisScores).filter((v) => v === maxScore).length
  if (tiedCount > 1 && rawTotal !== undefined) {
    return tieBreakerByRawTotal(rawTotal)
  }
  const type = TYPE_PRIORITY.find((axis) => axisScores[axis] === maxScore)
  if (!type) throw new Error(`determineType: no matching axis in scores ${JSON.stringify(axisScores)}`)
  return type
}

// 回答配列の素点合計（0〜21）を返す
export function calcRawTotal(answers: number[]): number {
  return answers.reduce((sum, s) => sum + s, 0)
}

// 回答配列から80〜100の範囲の表示スコアを算出する
export function calcDisplayScore(answers: number[]): number {
  const rawTotal = calcRawTotal(answers)
  return Math.round(SCORE_MIN + (rawTotal / RAW_MAX) * (SCORE_MAX - SCORE_MIN))
}
