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
