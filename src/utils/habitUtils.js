/**
 * توابع کمکی برای محاسبات مربوط به عادت‌ها
 * استفاده از date-fns برای مدیریت تاریخ
 */

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  isBefore,
  isAfter,
  differenceInDays,
  startOfDay,
} from 'date-fns'
// رنگ‌های پیش‌فرض برای عادت‌ها
export const HABIT_COLORS = [
  { id: 'emerald', name: 'زمردی', bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'blue', name: 'آبی', bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600', light: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'violet', name: 'بنفش', bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-600', light: 'bg-violet-100 dark:bg-violet-900/30' },
  { id: 'amber', name: 'کهربایی', bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-600', light: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'rose', name: 'صورتی', bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-600', light: 'bg-rose-100 dark:bg-rose-900/30' },
  { id: 'cyan', name: 'فیروزه‌ای', bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-100 dark:bg-cyan-900/30' },
  { id: 'orange', name: 'نارنجی', bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600', light: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'teal', name: 'سبز دریایی', bg: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-600', light: 'bg-teal-100 dark:bg-teal-900/30' },
]

// آیکون‌های پیش‌فرض (emoji)
export const HABIT_ICONS = [
  { id: 'book', emoji: '📚', name: 'کتاب' },
  { id: 'sport', emoji: '🏃', name: 'ورزش' },
  { id: 'meditate', emoji: '🧘', name: 'مدیتیشن' },
  { id: 'water', emoji: '💧', name: 'آب' },
  { id: 'sleep', emoji: '😴', name: 'خواب' },
  { id: 'study', emoji: '✏️', name: 'مطالعه' },
  { id: 'heart', emoji: '❤️', name: 'قلب' },
  { id: 'star', emoji: '⭐', name: 'ستاره' },
]

/**
 * تولید شناسه یکتا برای عادت
 */
export function generateId() {
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * گرفتن روزهای ماه جاری
 */
export function getDaysOfCurrentMonth() {
  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)
  return eachDayOfInterval({ start, end })
}

/**
 * محاسبه درصد تکمیل ماه جاری بر اساس هدف
 * @param {Array<string>} completedDates آرایه تاریخ‌های انجام شده (ISO string)
 * @param {number} targetDays هدف تعداد روز (پیش‌فرض: روزهای گذشته ماه)
 */
export function getMonthlyProgress(completedDates, targetDays = null) {
  const days = getDaysOfCurrentMonth()
  const today = startOfDay(new Date())
  const pastDays = days.filter((d) => !isAfter(d, today))
  const completedThisMonth = pastDays.filter((d) =>
    completedDates.some(
      (dateStr) => format(startOfDay(new Date(dateStr)), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
    )
  )
  const completed = completedThisMonth.length
  const total = targetDays != null ? targetDays : pastDays.length
  if (total <= 0) return 0
  return Math.min(100, Math.round((completed / total) * 100))
}

/**
 * محاسبه streak (روزهای متوالی انجام شده)
 * از امروز به عقب شمرده می‌شود
 */
export function getCurrentStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0

  const sortedDates = [...completedDates]
    .map((d) => startOfDay(new Date(d)))
    .sort((a, b) => b - a)

  const today = startOfDay(new Date())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // اگر امروز یا دیروز انجام نشده، streak صفر است
  const latestDate = sortedDates[0]
  const daysDiff = differenceInDays(today, latestDate)
  if (daysDiff > 1) return 0

  let streak = 0
  let checkDate = latestDate

  for (const date of sortedDates) {
    const diff = differenceInDays(checkDate, date)
    if (diff === 0) {
      streak++
      checkDate = new Date(date)
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (diff > 1) {
      break
    }
  }

  return streak
}

/**
 * محاسبه طولانی‌ترین streak از کل تاریخچه
 */
export function getLongestStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0

  const sortedDates = [...completedDates]
    .map((d) => format(startOfDay(new Date(d)), 'yyyy-MM-dd'))
    .sort()
    .reverse()

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1])
    const curr = new Date(sortedDates[i])
    const diff = differenceInDays(prev, curr)

    if (diff === 1) {
      currentStreak++
    } else {
      maxStreak = Math.max(maxStreak, currentStreak)
      currentStreak = 1
    }
  }

  return Math.max(maxStreak, currentStreak)
}

/**
 * بررسی اینکه آیا امروز انجام شده
 */
export function isTodayCompleted(completedDates) {
  const today = format(new Date(), 'yyyy-MM-dd')
  return completedDates.some(
    (d) => format(new Date(d), 'yyyy-MM-dd') === today
  )
}

/**
 * گرفتن نقشه گرمایی روزهای ماه برای heatmap
 * @returns {Array<{date: Date, completed: boolean}>}
 */
export function getMonthHeatmapData(completedDates) {
  const days = getDaysOfCurrentMonth()
  return days.map((date) => ({
    date,
    completed: completedDates.some(
      (d) => format(new Date(d), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ),
  }))
}
