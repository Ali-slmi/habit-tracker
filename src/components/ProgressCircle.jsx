/**
 * کامپوننت progress bar دایره‌ای
 * نمایش درصد تکمیل ماه جاری
 */

import clsx from 'clsx'
import { toPersianNumber } from '../utils/persianDate'

export default function ProgressCircle({ progress, color = 'emerald', size = 56, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const colorMap = {
    emerald: 'stroke-emerald-500',
    blue: 'stroke-blue-500',
    violet: 'stroke-violet-500',
    amber: 'stroke-amber-500',
    rose: 'stroke-rose-500',
    cyan: 'stroke-cyan-500',
    orange: 'stroke-orange-500',
    teal: 'stroke-teal-500',
  }
  const strokeColor = colorMap[color] || colorMap.emerald

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* پس‌زمینه دایره */}
        <circle
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* دایره پیشرفت */}
        <circle
          className={clsx(
            strokeColor,
            'transition-all duration-500 ease-out'
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* عدد درصد در وسط */}
      <div
        className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200"
        style={{ fontSize: size * 0.2 }}
      >
        {toPersianNumber(progress)}٪
      </div>
    </div>
  )
}
