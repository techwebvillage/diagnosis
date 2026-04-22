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
