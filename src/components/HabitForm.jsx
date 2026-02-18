/**
 * فرم اضافه کردن / ویرایش عادت
 * شامل نام، رنگ، آیکون و دکمه ذخیره
 */

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { HABIT_COLORS, HABIT_ICONS } from '../utils/habitUtils'

export default function HabitForm({ isOpen, onClose, onSubmit, editHabit = null }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('emerald')
  const [icon, setIcon] = useState('star')
  const [targetDays, setTargetDays] = useState(14)

  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name)
      setColor(editHabit.color || 'emerald')
      setIcon(editHabit.icon || 'star')
      setTargetDays(editHabit.targetDays ?? 14)
    } else {
      setName('')
      setColor('emerald')
      setIcon('star')
      setTargetDays(14)
    }
  }, [editHabit, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), color, icon, targetDays: Math.max(1, Math.min(31, targetDays)) })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {editHabit ? 'ویرایش عادت' : 'عادت جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* نام عادت */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نام عادت <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: مطالعه روزانه"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
              autoFocus
            />
          </div>

          {/* انتخاب رنگ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رنگ
            </label>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-10 h-10 rounded-full ${c.bg} transition-transform hover:scale-110 ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800' : ''
                  }`}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* هدف تعداد روز در ماه */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              هدف (تعداد روز در ماه)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={31}
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value) || 14)}
                className="w-20 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">روز</span>
            </div>
          </div>

          {/* انتخاب آیکون */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              آیکون
            </label>
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setIcon(i.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    icon === i.id
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 ring-2 ring-emerald-500'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={i.name}
                  aria-label={i.name}
                >
                  {i.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!name.trim()}
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
