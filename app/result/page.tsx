// app/result/page.tsx
// LINE からのアクセスで ?type=S/I/F/A を受け取り、診断結果を表示するページ

import type { DiagnosisType } from '@/lib/scoring'
import ResultCard from '@/components/ResultCard'

const LINE_URL =
  process.env.NEXT_PUBLIC_LINE_URL ?? 'https://lin.ee/XXXXXXX'

const VALID_TYPES: DiagnosisType[] = ['S', 'I', 'F', 'A']
const DEFAULT_TYPE: DiagnosisType = 'I'

// LINE から直接アクセスするためセッション情報がない。
// タイプ別に固定スコアを設定（80〜100 の範囲）
const DISPLAY_SCORE_BY_TYPE: Record<DiagnosisType, number> = {
  S: 92,
  I: 89,
  F: 85,
  A: 91,
}

type Props = {
  searchParams: Promise<{ type?: string }>
}

export default async function ResultPage({ searchParams }: Props) {
  // Next.js 15 以降、searchParams は Promise のため await が必要
  const params = await searchParams
  const rawType = params.type?.toUpperCase()
  const type: DiagnosisType =
    rawType && (VALID_TYPES as string[]).includes(rawType)
      ? (rawType as DiagnosisType)
      : DEFAULT_TYPE

  const displayScore = DISPLAY_SCORE_BY_TYPE[type]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー */}
        <div className="bg-navy text-white rounded-t-2xl px-6 py-5 text-center">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-1">TechVillage</p>
          <h1 className="text-lg font-bold">診断結果</h1>
        </div>

        {/* 結果カード */}
        <div className="bg-white border border-t-0 border-navy/15 rounded-b-2xl px-6 py-8 shadow-sm">
          <ResultCard
            type={type}
            displayScore={displayScore}
            lineUrl={LINE_URL}
          />
        </div>
      </div>
    </main>
  )
}
