/**
 * کارت نمایش هر عادت
 * شامل progress، streak، چک‌باکس، heatmap و دکمه‌های ویرایش/حذف
 */

import { useState } from 'react'
import { Check, Pencil, Trash2, Archive } from 'lucide-react'
import confetti from 'canvas-confetti'
import clsx from 'clsx'
import ProgressCircle from './ProgressCircle'
import CalendarHeatmap from './CalendarHeatmap'
import {
  getMonthlyProgress,
  getCurrentStreak,
  isTodayCompleted,
  getMonthHeatmapData,
} from '../utils/habitUtils'
import { getDaysOfCurrentMonth } from '../utils/habitUtils'
import { startOfDay } from 'date-fns'
import { HABIT_ICONS } from '../utils/habitUtils'
import { toPersianNumber } from '../utils/persianDate'

export default function HabitCard({
  habit,
  onToggleToday,
  onEdit,
  onDelete,
  onArchive,
}) {
  const [animating, setAnimating] = useState(false)
  const targetDays = habit.targetDays ?? 14
  const progress = getMonthlyProgress(habit.completedDates || [], targetDays)
  const streak = getCurrentStreak(habit.completedDates || [])
  const todayDone = isTodayCompleted(habit.completedDates || [])
  const heatmapData = getMonthHeatmapData(habit.completedDates || [])

  const days = getDaysOfCurrentMonth()
  const today = startOfDay(new Date())
  const pastDays = days.filter((d) => d <= today)
  const completedThisMonth = (habit.completedDates || []).filter((d) => {
    const date = startOfDay(new Date(d))
    return pastDays.some((p) => p.getTime() === date.getTime())
  }).length

  const iconData = HABIT_ICONS.find((i) => i.id === habit.icon) || HABIT_ICONS[0]

  const handleCheck = () => {
    setAnimating(true)
    onToggleToday(habit.id)
    if (!todayDone) {
      // اگر ۱۰۰٪ شد، confetti!
      const newProgress =
        progress >= 99 || (completedThisMonth + 1 >= targetDays)
      if (newProgress && pastDays.length > 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        })
      }
    }
    setTimeout(() => setAnimating(false), 400)
  }

  const isComplete = progress >= 100 && completedThisMonth >= targetDays

  return (
    <div
      className={clsx(
        'relative rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden',
        isComplete && 'ring-2 ring-emerald-400/50 dark:ring-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-900/10'
      )}
    >
      {/* نوار رنگی بالای کارت */}
      <div
        className={clsx(
          'absolute top-0 right-0 left-0 h-1',
          habit.color === 'emerald' && 'bg-emerald-500',
          habit.color === 'blue' && 'bg-blue-500',
          habit.color === 'violet' && 'bg-violet-500',
          habit.color === 'amber' && 'bg-amber-500',
          habit.color === 'rose' && 'bg-rose-500',
          habit.color === 'cyan' && 'bg-cyan-500',
          habit.color === 'orange' && 'bg-orange-500',
          habit.color === 'teal' && 'bg-teal-500',
          !habit.color && 'bg-emerald-500'
        )}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        {/* سمت راست: آیکون و چک‌باکس */}
        <div className="flex flex-row sm:flex-col items-center gap-3 shrink-0">
          <span className="text-2xl sm:text-3xl">{iconData.emoji}</span>
          <button
            onClick={handleCheck}
            className={clsx(
              'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0',
              todayDone
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
              animating && 'animate-check-bounce'
            )}
            title={todayDone ? 'امروز انجام شد ✓' : 'امروز انجام شد؟'}
          >
            <Check size={28} strokeWidth={3} />
          </button>
        </div>

        {/* وسط: اطلاعات اصلی */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
              {habit.name}
            </h3>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(habit)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                title="ویرایش"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onArchive(habit)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                title="آرشیو"
              >
                <Archive size={16} />
              </button>
              <button
                onClick={() => onDelete(habit.id)}
                className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 transition-colors"
                title="حذف"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <ProgressCircle
                progress={progress}
                color={habit.color || 'emerald'}
                size={48}
                strokeWidth={5}
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div dir="ltr" className="font-medium">
                {toPersianNumber(completedThisMonth)} / {toPersianNumber(targetDays)} روز
              </div>
              <div className="font-medium text-emerald-600 dark:text-emerald-400">
                🔥 {toPersianNumber(streak)} روز متوالی
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="mt-4">
            <CalendarHeatmap
              heatmapData={heatmapData}
              color={habit.color || 'emerald'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
