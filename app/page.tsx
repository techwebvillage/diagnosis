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
            <span className="block text-sm text-gray-400 mt-1">7問・約1分で診断できます</span>
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

          <p className="text-center text-xs text-gray-400 mt-4">無料</p>
        </div>
      </div>
    </main>
  )
}
