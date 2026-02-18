/**
 * هدر اصلی اپلیکیشن
 * شامل عنوان، دکمه اضافه کردن، تم و آمار
 */

import { Plus, Sun, Moon, Archive } from 'lucide-react'
import { toPersianNumber } from '../utils/persianDate'

export default function Header({
  onAddHabit,
  darkMode,
  onToggleDarkMode,
  stats,
  onShowArchived,
  showArchived,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ردیاب عادت‌های من
          </h1>

          <div className="flex items-center gap-2">
            {/* دکمه تم - یک کلیک برای سوییچ */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={darkMode === 'dark' ? 'حالت روشن' : 'حالت تیره'}
            >
              {darkMode === 'dark' ? (
                <Sun size={20} className="text-amber-500" aria-hidden />
              ) : (
                <Moon size={20} className="text-indigo-400" aria-hidden />
              )}
            </button>

            {/* دکمه آرشیو */}
            <button
              onClick={onShowArchived}
              className={`p-2 rounded-lg transition-colors ${
                showArchived
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="عادت‌های آرشیو شده"
            >
              <Archive size={20} />
            </button>

            {/* دکمه اضافه کردن */}
            <button
              onClick={onAddHabit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">عادت جدید</span>
            </button>
          </div>
        </div>

        {/* آمار */}
        {stats && (
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span>عادت‌های فعال: {toPersianNumber(stats.activeCount)}</span>
            <span>•</span>
            <span>مجموع روزهای موفق: {toPersianNumber(stats.totalCompleted)}</span>
            <span>•</span>
            <span>طولانی‌ترین streak: {toPersianNumber(stats.longestStreak)} روز</span>
          </div>
        )}
      </div>
    </header>
  )
}
