// components/ProgressBar.tsx

type Props = {
  current: number  // 1始まり（現在の問番号）
  total: number    // 全問数（7）
}

export default function ProgressBar({ current, total }: Props) {
  const percentage = (current / total) * 100

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
