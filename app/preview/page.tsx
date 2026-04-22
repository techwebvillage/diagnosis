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
      const parsed: unknown = JSON.parse(raw)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof (parsed as QuizResult).displayScore === 'number' &&
        typeof (parsed as QuizResult).type === 'string'
      ) {
        const score = (parsed as QuizResult).displayScore
        const type = (parsed as QuizResult).type
        setResult({ type, displayScore: Math.max(80, Math.min(100, score)) })
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
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
          {result === null ? (
            <div className="text-center text-gray-400 py-8">読み込み中...</div>
          ) : (
            <>
              {/* タイプキー（大きく強調表示） */}
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500 mb-2">あなたの診断タイプ</p>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-navy text-white text-5xl font-bold shadow-lg">
                  {result.type}
                </div>
                <p className="text-xs text-gray-400 mt-2">このアルファベットをLINEに送ってください</p>
              </div>

              {/* 区切り */}
              <div className="border-t border-gray-100 my-5" />

              {/* ぼかしエリア */}
              <div className="relative mb-6">
                <div className="select-none" style={{ pointerEvents: 'none' }}>
                  {/* スコア */}
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-1">エンジニア適性スコア</p>
                    <p className="text-5xl font-bold text-navy" style={{ filter: 'blur(10px)' }}>
                      {result.displayScore}
                      <span className="text-lg font-normal text-gray-400 ml-1">点</span>
                    </p>
                  </div>

                  {/* タイプ名・詳細 */}
                  <div className="bg-navy-light rounded-xl p-4 text-center" style={{ filter: 'blur(6px)' }}>
                    <p className="text-xs text-gray-500 mb-1">あなたのタイプ名・向いている職種</p>
                    <p className="text-sm font-bold text-navy">〇〇型エンジニアタイプ</p>
                    <p className="text-xs text-gray-500 mt-1">Webエンジニア・〇〇エンジニア...</p>
                  </div>
                </div>

                {/* オーバーレイ */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-xl">
                  <p className="text-navy font-bold text-sm mb-1">🔒 LINE登録後に公開</p>
                  <p className="text-xs text-gray-500">スコア・タイプ名・向いている職種</p>
                </div>
              </div>

              {/* 手順説明 */}
              <div className="bg-navy-light rounded-xl p-4 mb-5 text-sm text-gray-700 leading-relaxed">
                <p className="font-bold text-navy mb-2">受け取り方</p>
                <ol className="space-y-1 list-none">
                  <li>① 下のボタンからLINE友だち追加</li>
                  <li>② LINEに上のアルファベット（<span className="font-bold text-navy">{result.type}</span>）を送信</li>
                  <li>③ 診断結果URLが届きます</li>
                </ol>
              </div>

              {/* LINE ボタン */}
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LINEで詳しい診断結果を受け取る（外部リンク）"
                className="block w-full text-center py-4 rounded-xl font-bold text-base text-white active:scale-95 transition-all"
                style={{ backgroundColor: '#06c755' }}
              >
                LINEで結果を受け取る →
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
