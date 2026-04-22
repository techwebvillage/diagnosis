# 公務員向けITエンジニア適性診断アプリ 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 公務員がエンジニア適性を7問で診断し、LINE友だち登録に誘導するNext.js静的Webアプリを構築する

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind CSSによる完全静的アプリ。sessionStorageで回答を保持し、スコアリングはクライアントサイドで完結。`/result?type=S/I/F/A` のURLパラメータでタイプ別結果を表示し、LINE側から案内する。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Jest + ts-jest, Vercel

---

## ファイル構成

```
diagnosis-app/
├── app/
│   ├── layout.tsx              # ルートレイアウト（meta タグ、フォント）
│   ├── page.tsx                # TOP：診断開始ページ
│   ├── quiz/
│   │   └── page.tsx            # STEP2：質問ページ（7問、1問ずつ）
│   ├── preview/
│   │   └── page.tsx            # STEP3：簡易フィードバック + LINE登録誘導
│   └── result/
│       └── page.tsx            # STEP5：診断結果（?type=S/I/F/A）
├── lib/
│   ├── questions.ts            # 質問データ・型定義
│   └── scoring.ts              # スコア計算・タイプ判定
├── components/
│   ├── ProgressBar.tsx         # 進捗バー（現在問/全問）
│   ├── QuizCard.tsx            # 質問1問のカード
│   └── ResultCard.tsx          # 診断結果カード（タイプ別）
├── __tests__/
│   └── scoring.test.ts         # scoring.ts のユニットテスト
├── jest.config.ts
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

---

### Task 1: プロジェクトセットアップ

**Files:**
- Create: `diagnosis-app/` (プロジェクトルート)
- Create: `diagnosis-app/tailwind.config.ts`
- Create: `diagnosis-app/jest.config.ts`

- [ ] **Step 1: Next.js プロジェクトを作成する**

```bash
cd /Users/nozaki/Desktop/CEO/TechVillage
npx create-next-app@latest diagnosis-app --typescript --tailwind --app --no-src-dir --no-import-alias
cd diagnosis-app
```

プロンプトが出た場合はすべてデフォルト（Enter）で進む。

- [ ] **Step 2: Jest をインストールする**

```bash
npm install --save-dev jest @types/jest ts-jest
```

- [ ] **Step 3: jest.config.ts を作成する**

```typescript
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default config
```

- [ ] **Step 4: package.json の test スクリプトを jest に書き換える**

`package.json` の `"scripts"` 内の `"test"` を以下で上書き:

```json
"test": "jest"
```

- [ ] **Step 5: tailwind.config.ts にカスタムカラーを追加する**

`tailwind.config.ts` を以下で上書き:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2e6c',
          light: '#f0f4ff',
        },
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 6: ボイラープレートを最小化する**

`app/page.tsx` を以下で上書き（Task 6 で本実装する）:

```tsx
export default function Home() {
  return <main><h1>診断アプリ</h1></main>
}
```

`app/globals.css` を以下で上書き:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 7: 開発サーバーが起動することを確認する**

```bash
npm run dev
```

Expected: `http://localhost:3000` で「診断アプリ」と表示される。Ctrl+C で停止。

- [ ] **Step 8: コミットする**

```bash
git add -A
git commit -m "feat: Next.js プロジェクトセットアップ"
```

---

### Task 2: 質問データ定義 (lib/questions.ts)

**Files:**
- Create: `lib/questions.ts`

- [ ] **Step 1: lib/questions.ts を作成する**

```typescript
// lib/questions.ts

export type ScoreAxis = 'S' | 'I' | 'F' | 'A'

export type AnswerOption = {
  label: string
  score: number
}

export type Question = {
  id: number
  text: string
  axis: ScoreAxis | ScoreAxis[]
}

export const ANSWER_OPTIONS: AnswerOption[] = [
  { label: 'よくある', score: 3 },
  { label: 'ときどきある', score: 2 },
  { label: 'あまりない', score: 1 },
  { label: 'ほとんどない', score: 0 },
]

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: '同じ部署・業務が続くより、新しいことを学び続けたい',
    axis: 'S',
  },
  {
    id: 2,
    text: '仕事の中で「なぜこの手順なんだろう」と疑問を感じることがある',
    axis: 'I',
  },
  {
    id: 3,
    text: '通勤・時間・場所に縛られない働き方に魅力を感じる',
    axis: 'F',
  },
  {
    id: 4,
    text: '頑張りや成果が給与や評価に反映されてほしい',
    axis: 'A',
  },
  {
    id: 5,
    text: '毎年の定期異動に違和感やもったいなさを感じる',
    axis: 'S',
  },
  {
    id: 6,
    text: '業務をもっと効率化・自動化できればと思うことがある',
    axis: 'I',
  },
  {
    id: 7,
    text: '5年後・10年後も自分のスキルが市場で通用するか不安がある',
    axis: ['S', 'A'],
  },
]
```

- [ ] **Step 2: 型チェックを実行する**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミットする**

```bash
git add lib/questions.ts
git commit -m "feat: 質問データ定義 (lib/questions.ts)"
```

---

### Task 3: スコアリングロジック TDD (lib/scoring.ts)

**Files:**
- Create: `__tests__/scoring.test.ts`
- Create: `lib/scoring.ts`

- [ ] **Step 1: テストファイルを作成する**

```typescript
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
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../lib/scoring'`

- [ ] **Step 3: lib/scoring.ts を実装する**

```typescript
// lib/scoring.ts

import { QUESTIONS } from './questions'
import type { ScoreAxis } from './questions'

export type AxisScores = Record<ScoreAxis, number>
export type DiagnosisType = ScoreAxis

const TYPE_PRIORITY: ScoreAxis[] = ['S', 'I', 'F', 'A']
const SCORE_MIN = 80
const SCORE_MAX = 100
const RAW_MAX = 21 // 7問 × 3点

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

export function determineType(axisScores: AxisScores): DiagnosisType {
  const maxScore = Math.max(...Object.values(axisScores))
  return TYPE_PRIORITY.find((axis) => axisScores[axis] === maxScore)!
}

export function calcDisplayScore(answers: number[]): number {
  const rawTotal = answers.reduce((sum, s) => sum + s, 0)
  return Math.round(SCORE_MIN + (rawTotal / RAW_MAX) * (SCORE_MAX - SCORE_MIN))
}
```

- [ ] **Step 4: テストが通ることを確認する**

```bash
npm test
```

Expected: PASS — 10 tests passed

- [ ] **Step 5: コミットする**

```bash
git add lib/scoring.ts __tests__/scoring.test.ts
git commit -m "feat: スコアリングロジック TDD (lib/scoring.ts)"
```

---

### Task 4: ProgressBar コンポーネント

**Files:**
- Create: `components/ProgressBar.tsx`

- [ ] **Step 1: components/ProgressBar.tsx を作成する**

```tsx
// components/ProgressBar.tsx

type Props = {
  current: number  // 1始まり（現在の問番号）
  total: number    // 全問数（7）
}

export default function ProgressBar({ current, total }: Props) {
  const percentage = ((current - 1) / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-white/60 mb-1">
        <span>Q{current} / {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 型チェックを実行する**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミットする**

```bash
git add components/ProgressBar.tsx
git commit -m "feat: ProgressBar コンポーネント"
```

---

### Task 5: QuizCard コンポーネント

**Files:**
- Create: `components/QuizCard.tsx`

- [ ] **Step 1: components/QuizCard.tsx を作成する**

```tsx
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
```

- [ ] **Step 2: 型チェックを実行する**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミットする**

```bash
git add components/QuizCard.tsx
git commit -m "feat: QuizCard コンポーネント"
```

---

### Task 6: layout.tsx + TOP ページ (app/page.tsx)

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: app/layout.tsx を実装する**

```tsx
// app/layout.tsx

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '公務員 × ITエンジニア適性診断 | TechVillage',
  description:
    '今のモヤモヤは、エンジニア適性のサインかもしれない。公務員としての違和感からわかるITエンジニアとの相性診断。7問・約2分で診断できます。',
  openGraph: {
    title: '公務員 × ITエンジニア適性診断',
    description: 'あなたのモヤモヤはエンジニア適性のサインかもしれない。',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 font-sans">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: app/page.tsx を実装する**

```tsx
// app/page.tsx

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー */}
        <div className="bg-navy text-white rounded-t-2xl px-6 py-5 text-center">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-1">TechVillage</p>
          <h1 className="text-xl font-bold leading-snug">
            公務員 × ITエンジニア<br />適性診断
          </h1>
        </div>

        {/* ボディ */}
        <div className="bg-white border border-t-0 border-navy/15 rounded-b-2xl px-6 py-8 shadow-sm">
          <p className="text-center text-gray-700 leading-relaxed mb-6">
            今のモヤモヤは、<br />
            <span className="font-bold text-navy">エンジニア適性のサイン</span>かもしれない。
            <span className="block text-sm text-gray-400 mt-1">7問・約2分で診断できます</span>
          </p>

          <ul className="space-y-2 text-sm text-gray-600 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-navy font-bold mt-0.5">✓</span>
              <span>公務員の悩みからわかるエンジニア適性</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-navy font-bold mt-0.5">✓</span>
              <span>4タイプの詳細診断結果</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-navy font-bold mt-0.5">✓</span>
              <span>向いている職種・次のステップを提示</span>
            </li>
          </ul>

          <Link
            href="/quiz"
            className="block w-full bg-navy text-white text-center py-4 rounded-xl font-bold text-base hover:bg-navy/90 active:scale-95 transition-all"
          >
            診断スタート →
          </Link>

          <p className="text-center text-xs text-gray-400 mt-4">無料・登録不要</p>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: 開発サーバーで確認する**

```bash
npm run dev
```

`http://localhost:3000` でネイビー×ホワイトのTOPページが表示され、「診断スタート」ボタンがあることを確認する。

- [ ] **Step 4: コミットする**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: TOP ページ + SEO meta タグ"
```

---

### Task 7: 質問ページ (app/quiz/page.tsx)

**Files:**
- Create: `app/quiz/page.tsx`

- [ ] **Step 1: app/quiz/page.tsx を作成する**

```tsx
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
```

- [ ] **Step 2: 動作確認する**

```bash
npm run dev
```

1. `http://localhost:3000` → 「診断スタート」をクリックして `/quiz` に遷移する
2. 質問が1問表示され、進捗バーが 0% になっていることを確認する
3. 選択肢をクリックすると次の質問に進むことを確認する
4. 7問すべて回答すると `/preview` に遷移しようとすることを確認する（この時点では404で問題ない）

- [ ] **Step 3: コミットする**

```bash
git add app/quiz/page.tsx
git commit -m "feat: 質問ページ（7問・1問ずつ表示）"
```

---

### Task 8: 簡易フィードバックページ (app/preview/page.tsx)

**Files:**
- Create: `app/preview/page.tsx`
- Create: `.env.local`

- [ ] **Step 1: .env.local を作成する**

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_LINE_URL=https://lin.ee/XXXXXXX
NEXT_PUBLIC_CONSULTATION_URL=https://techvillage.jp/contact
EOF
```

> 本番デプロイ時は Vercel の環境変数設定で実際の LINE URL と相談URLに差し替える。

- [ ] **Step 2: app/preview/page.tsx を作成する**

```tsx
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
```

- [ ] **Step 3: 動作確認する**

```bash
npm run dev
```

1. `/quiz` で7問すべて回答して `/preview` に遷移する
2. 「🎯 診断が完了しました」とスコア（80〜100点）が表示されることを確認する
3. 緑の「LINEで受け取る」ボタンが表示されることを確認する

- [ ] **Step 4: コミットする**

```bash
git add app/preview/page.tsx .env.local
git commit -m "feat: 簡易フィードバックページ（LINE登録誘導）"
```

---

### Task 9: ResultCard コンポーネント

**Files:**
- Create: `components/ResultCard.tsx`

- [ ] **Step 1: components/ResultCard.tsx を作成する**

```tsx
// components/ResultCard.tsx

import type { DiagnosisType } from '@/lib/scoring'

type TypeDefinition = {
  name: string
  englishName: string
  catch: string
  description: string
  roles: string[]
}

const TYPE_DEFINITIONS: Record<DiagnosisType, TypeDefinition> = {
  S: {
    name: '積み上げ型エンジニアタイプ',
    englishName: 'Specialist Type',
    catch: '専門性を武器にする、コツコツ成長型',
    description:
      '異動のない環境でスキルを積み上げることにやりがいを感じやすいタイプ。知識が資産になる働き方と相性が良く、深い専門性を持つエンジニアとして活躍できます。',
    roles: ['Webエンジニア', 'インフラエンジニア', 'セキュリティエンジニア'],
  },
  I: {
    name: '改善志向型エンジニアタイプ',
    englishName: 'Improver Type',
    catch: '仕組みを変えたい、課題解決型',
    description:
      '業務の非効率や無駄に気づきやすく、仕組みを良くしたい気持ちが強いタイプ。現状に疑問を持ち改善策を考える姿勢はエンジニアの本質そのもの。システム開発やDX推進に適性があります。',
    roles: ['Webエンジニア', '業務システム開発', 'DX推進エンジニア'],
  },
  F: {
    name: '自由志向型エンジニアタイプ',
    englishName: 'Flexible Type',
    catch: '場所も時間も、自分らしく働きたい型',
    description:
      '場所や時間に縛られない働き方を重視するタイプ。リモートワーク中心のIT業界と相性が良く、自分のペースで高い成果を出せる環境で力を発揮できます。',
    roles: ['フリーランスエンジニア', 'フルリモート企業のエンジニア', 'Webエンジニア'],
  },
  A: {
    name: '成果実感型エンジニアタイプ',
    englishName: 'Achiever Type',
    catch: '頑張りが報われる環境で、本気を出せる型',
    description:
      '実力や努力が正当に評価される環境にモチベーションを感じるタイプ。成果が見えやすいIT業界と相性が良く、スキルを磨けば磨くほど市場価値が上がる仕事と言えます。',
    roles: ['スタートアップエンジニア', 'フリーランスエンジニア', '事業会社エンジニア'],
  },
}

type Props = {
  type: DiagnosisType
  displayScore: number
  consultationUrl: string
}

export default function ResultCard({ type, displayScore, consultationUrl }: Props) {
  const def = TYPE_DEFINITIONS[type]
  const scorePercent = ((displayScore - 80) / 20) * 100  // 80-100 → 0-100%

  return (
    <div className="w-full">
      {/* タイプバッジ */}
      <div className="text-center mb-4">
        <span className="inline-block bg-navy-light border-2 border-navy rounded-full px-5 py-1 text-sm text-navy font-bold">
          あなたのタイプ
        </span>
      </div>

      {/* タイプ名 */}
      <h2 className="text-center text-xl font-bold text-navy leading-tight mb-1">
        {def.name}
      </h2>
      <p className="text-center text-xs text-gray-400 mb-4">{def.englishName}</p>

      {/* キャッチ */}
      <p className="text-center text-sm font-medium text-gray-600 mb-5 italic">
        「{def.catch}」
      </p>

      {/* スコアバー */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>エンジニア適性スコア</span>
          <span className="font-bold text-navy">{displayScore}点</span>
        </div>
        <div className="w-full bg-navy/10 rounded-full h-3">
          <div
            className="bg-navy h-3 rounded-full transition-all duration-700"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* 説明 */}
      <div className="bg-navy-light rounded-xl p-4 mb-5 text-sm text-gray-700 leading-relaxed">
        {def.description}
      </div>

      {/* 向いている職種 */}
      <div className="mb-6">
        <p className="text-xs font-bold text-navy mb-2">向いている職種</p>
        <div className="flex flex-wrap gap-2">
          {def.roles.map((role) => (
            <span
              key={role}
              className="bg-navy-light text-navy text-xs px-3 py-1 rounded-full border border-navy/20"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={consultationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-navy text-white text-center py-4 rounded-xl font-bold text-base hover:bg-navy/90 active:scale-95 transition-all"
      >
        無料カウンセリングに申し込む →
      </a>
    </div>
  )
}
```

- [ ] **Step 2: 型チェックを実行する**

```bash
npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミットする**

```bash
git add components/ResultCard.tsx
git commit -m "feat: ResultCard コンポーネント（4タイプ定義込み）"
```

---

### Task 10: 診断結果ページ (app/result/page.tsx)

**Files:**
- Create: `app/result/page.tsx`

- [ ] **Step 1: app/result/page.tsx を作成する**

```tsx
// app/result/page.tsx

import type { DiagnosisType } from '@/lib/scoring'
import ResultCard from '@/components/ResultCard'

const CONSULTATION_URL =
  process.env.NEXT_PUBLIC_CONSULTATION_URL ?? 'https://techvillage.jp/contact'

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
  searchParams: { type?: string }
}

export default function ResultPage({ searchParams }: Props) {
  const rawType = searchParams.type?.toUpperCase()
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
            consultationUrl={CONSULTATION_URL}
          />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: エンドツーエンドで全ページを確認する**

```bash
npm run dev
```

以下をすべて確認する:

1. `http://localhost:3000` — TOPページが表示される
2. 「診断スタート」クリック → `/quiz` に遷移
3. 7問回答 → `/preview` に遷移し、スコアとLINEボタンが表示される
4. `http://localhost:3000/result?type=S` — 「積み上げ型エンジニアタイプ」、スコア92点が表示される
5. `http://localhost:3000/result?type=I` — 「改善志向型エンジニアタイプ」、スコア89点が表示される
6. `http://localhost:3000/result?type=F` — 「自由志向型エンジニアタイプ」、スコア85点が表示される
7. `http://localhost:3000/result?type=A` — 「成果実感型エンジニアタイプ」、スコア91点が表示される
8. `http://localhost:3000/result?type=invalid` — デフォルト（I型）が表示される
9. `http://localhost:3000/result` — デフォルト（I型）が表示される

- [ ] **Step 3: テストを全件実行する**

```bash
npm test
```

Expected: PASS — 全テスト通過

- [ ] **Step 4: ビルドが通ることを確認する**

```bash
npm run build
```

Expected: エラーなし。`✓ Compiled successfully` が表示される。

- [ ] **Step 5: コミットする**

```bash
git add app/result/page.tsx
git commit -m "feat: 診断結果ページ（?type=S/I/F/A 対応）"
```

---

## デプロイ手順（Vercel）

実装完了後に以下の手順でデプロイする。

1. GitHub にリポジトリを作成してプッシュする
2. [vercel.com](https://vercel.com) でプロジェクトをインポートする
3. 環境変数を設定する:
   - `NEXT_PUBLIC_LINE_URL` — LINE公式アカウントの友だち追加URL（`https://lin.ee/XXXXXXX`）
   - `NEXT_PUBLIC_CONSULTATION_URL` — 無料カウンセリング申し込みページのURL
4. デプロイを実行する
5. 発行されたURLを LINE側の自動返信メッセージに設定する（アプリ外の作業）
