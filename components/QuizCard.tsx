// components/QuizCard.tsx

import { ANSWER_OPTIONS } from '@/lib/questions'
import type { Question } from '@/lib/questions'

type Props = {
  question: Question
  onAnswer: (score: number) => void
}

export default function QuizCard({ question, onAnswer }: Props) {
  return (
    <div className="w-full">
      <p className="text-navy font-bold text-lg leading-relaxed mb-6">
        {question.text}
      </p>
      <div className="flex flex-col gap-3">
        {ANSWER_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => onAnswer(option.score)}
            className="w-full text-left px-4 py-3 rounded-lg border-2 border-navy/20 text-gray-700 hover:border-navy hover:bg-navy-light hover:text-navy font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
