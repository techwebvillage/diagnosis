// app/preview/page.tsx
'use client'

import { useEffect, useState } from 'react'

const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://lin.ee/XXXXXXX'
const STORAGE_KEY = 'quiz_result'

type QuizResult = {
  type: string
  displayScore: number
}

export default function PreviewPage() {
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      setResult(JSON.parse(raw))
    } catch {
      // sessionStorage が壊れていた場合は何もしない
    }
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー */}
        <div className="bg-navy text-white rounded-t-2xl px-6 py-5 text-center">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-1">TechVillage</p>
          <h2 className="text-lg font-bold">診断が完了しました</h2>
        </div>

        {/* ボディ */}
        <div className="bg-white border border-t-0 border-navy/15 rounded-b-2xl px-6 py-8 shadow-sm">
          {/* アイコン */}
          <div className="text-center text-5xl mb-4">🎯</div>

          {/* スコア */}
          {result && (
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">エンジニア適性スコア</p>
              <p className="text-5xl font-bold text-navy">
                {result.displayScore}
                <span className="text-lg font-normal text-gray-400 ml-1">点</span>
              </p>
            </div>
          )}

          {/* メッセージ */}
          <div className="bg-navy-light rounded-xl p-4 mb-6 text-sm text-gray-700 leading-relaxed text-center">
            あなたには<span className="font-bold text-navy">高いエンジニア適性</span>が確認されました。
            <br />
            詳しい診断結果（タイプ・向いている職種・次のステップ）は
            LINE公式アカウントで受け取れます。
          </div>

          {/* LINE ボタン */}
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-4 rounded-xl font-bold text-base text-white active:scale-95 transition-all"
            style={{ backgroundColor: '#06c755' }}
          >
            LINEで受け取る →
          </a>

          <p className="text-center text-xs text-gray-400 mt-3">
            ※ 登録後すぐに結果が届きます
          </p>
        </div>
      </div>
    </main>
  )
}
