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
