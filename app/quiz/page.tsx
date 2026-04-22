// app/quiz/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/lib/questions'
import { calcAxisScores, determineType, calcDisplayScore } from '@/lib/scoring'
import ProgressBar from '@/components/ProgressBar'
import QuizCard from '@/components/QuizCard'

const STORAGE_KEY = 'quiz_result'

export default function QuizPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  function handleAnswer(score: number) {
    const newAnswers = [...answers, score]

    if (newAnswers.length === QUESTIONS.length) {
      // 全問完了: スコア計算して sessionStorage に保存
      const axisScores = calcAxisScores(newAnswers)
      const type = determineType(axisScores)
      const displayScore = calcDisplayScore(newAnswers)

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ type, displayScore }),
      )
      router.push('/preview')
    } else {
      setAnswers(newAnswers)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const question = QUESTIONS[currentIndex]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー（進捗バー） */}
        <div className="bg-navy text-white rounded-t-2xl px-6 py-4">
          <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} />
        </div>

        {/* 質問カード */}
        <div className="bg-white border border-t-0 border-navy/15 rounded-b-2xl px-6 py-8 shadow-sm">
          <QuizCard question={question} onAnswer={handleAnswer} />
        </div>
      </div>
    </main>
  )
}
