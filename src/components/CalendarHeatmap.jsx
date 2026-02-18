/**
 * کامپوننت heatmap تقویم ماه جاری - شمسی
 * مربع‌های رنگی با شماره روز، ترتیب شنبه تا جمعه
 * در موبایل: قابل گسترش با کلیک
 */

import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import {
  toShamsi,
  toPersianNumber,
  getShamsiMonthYear,
} from '../utils/persianDate'

// شنبه=0 تا جمعه=6 در تقویم شمسی
function getPersianWeekday(date) {
  const jsDay = date.getDay() // 0=یکشنبه, 6=شنبه
  return (jsDay + 1) % 7 // شنبه=0، یکشنبه=1، ...
}

export default function CalendarHeatmap({ heatmapData, color = 'emerald' }) {
  const [expanded, setExpanded] = useState(false)
  const colorMap = {
    emerald: {
      completed: 'bg-emerald-500 text-white',
      empty: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      today: 'ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-gray-800',
    },
    blue: {
      completed: 'bg-blue-500 text-white',
      empty: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      today: 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-800',
    },
    violet: {
      completed: 'bg-violet-500 text-white',
      empty: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      today: 'ring-2 ring-violet-400 ring-offset-2 dark:ring-offset-gray-800',
    },
    amber: {
      completed: 'bg-amber-500 text-white',
      empty: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      today: 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-gray-800',
    },
    rose: {
      completed: 'bg-rose-500 text-white',
      empty: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      today: 'ring-2 ring-rose-400 ring-offset-2 dark:ring-offset-gray-800',
    },
    cyan: {
      completed: 'bg-cyan-500 text-white',
      empty: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      today: 'ring-2 ring-cyan-400 ring-offset-2 dark:ring-offset-gray-800',
    },
    orange: {
      completed: 'bg-orange-500 text-white',
      empty: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      today: 'ring-2 ring-orange-400 ring-offset-2 dark:ring-offset-gray-800',
    },
    teal: {
      completed: 'bg-teal-500 text-white',
      empty: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      today: 'ring-2 ring-teal-400 ring-offset-2 dark:ring-offset-gray-800',
    },
  }
  const colors = colorMap[color] || colorMap.emerald
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  // ساخت تقویم با ترتیب شنبه تا جمعه (۶ ستون برای روزهای هفته)
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] // شنبه، یکشنبه، ...
  const firstDay = heatmapData[0]?.date
  const startOffset = firstDay ? getPersianWeekday(firstDay) : 0

  // آرایه با خانه‌های خالی در ابتدا + روزها
  const calendarCells = [
    ...Array(startOffset).fill(null),
    ...heatmapData.map((item) => item),
  ]

  // تقسیم به ردیف‌های ۷ تایی برای جدول (ردیف آخر با خانه خالی پر شود)
  const rows = []
  for (let i = 0; i < calendarCells.length; i += 7) {
    const row = calendarCells.slice(i, i + 7)
    while (row.length < 7) row.push(null)
    rows.push(row)
  }
  const cellClass = 'w-7 h-7 min-w-7 min-h-7 text-center text-xs font-medium border border-gray-300 dark:border-gray-600'

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center justify-between w-full py-1 text-right md:cursor-default -mb-1"
      >
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {getShamsiMonthYear(new Date())}
        </span>
        <span className="md:hidden text-gray-500 dark:text-gray-400 text-xs">
          {expanded ? 'بستن تقویم' : 'مشاهده تقویم'}
        </span>
        <span className="md:hidden">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      <div className={clsx(!expanded && 'hidden md:block')}>
        <table className="border-collapse border border-gray-300 dark:border-gray-600 w-full">
          <thead>
            <tr>
              {weekDays.map((d) => (
                <th
                  key={d}
                  className="w-7 h-6 min-w-7 border border-gray-300 dark:border-gray-600 text-[10px] text-gray-500 dark:text-gray-400 font-normal bg-gray-50 dark:bg-gray-800/50"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((item, colIdx) => {
                  if (!item) {
                    return (
                      <td key={`empty-${rowIdx}-${colIdx}`} className={cellClass + ' bg-gray-50 dark:bg-gray-800/30'} />
                    )
                  }
                  const { date, completed } = item
                  const dayNum = toShamsi(date).jd
                  const isToday = format(date, 'yyyy-MM-dd') === todayStr
                  return (
                    <td
                      key={format(date, 'yyyy-MM-dd')}
                      title={`${toPersianNumber(dayNum)} ${getShamsiMonthYear(date)}: ${completed ? 'انجام شده ✓' : 'انجام نشده'}`}
                      className={clsx(
                        cellClass,
                        'transition-colors',
                        completed ? colors.completed : colors.empty,
                        isToday && 'ring-2 ring-inset ring-gray-400 dark:ring-gray-500'
                      )}
                    >
                      {toPersianNumber(dayNum)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
