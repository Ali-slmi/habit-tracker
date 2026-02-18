/**
 * هوک مدیریت عادت‌ها
 * شامل CRUD، آرشیو، تیک‌زدن، و مرتب‌سازی
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getHabits,
  saveHabits,
  getHabitOrder,
  saveHabitOrder,
  getArchivedHabits,
  saveArchivedHabits,
} from '../utils/storage'
import {
  generateId,
  getMonthlyProgress,
  getCurrentStreak,
  getLongestStreak,
  isTodayCompleted,
  getMonthHeatmapData,
} from '../utils/habitUtils'
import { format } from 'date-fns'

// خواندن اولیه از localStorage (قبل از رندر اول)
function loadFromStorage() {
  if (typeof window === 'undefined') return { habits: [], order: [], archived: [] }
  return {
    habits: getHabits(),
    order: getHabitOrder(),
    archived: getArchivedHabits(),
  }
}

export function useHabits() {
  const [habits, setHabits] = useState(() => loadFromStorage().habits)
  const [order, setOrder] = useState(() => loadFromStorage().order)
  const [archived, setArchived] = useState(() => loadFromStorage().archived)

  // ذخیره خودکار هنگام تغییر (هیچ‌وقت با آرایه خالی روی داده‌های موجود overwrite نکن)
  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  useEffect(() => {
    saveHabitOrder(order)
  }, [order])

  useEffect(() => {
    saveArchivedHabits(archived)
  }, [archived])

  // مرتب‌سازی عادت‌ها بر اساس order
  const sortedHabits = useCallback(() => {
    if (order.length === 0) return habits
    const orderMap = new Map(order.map((id, i) => [id, i]))
    return [...habits].sort((a, b) => {
      const ai = orderMap.has(a.id) ? orderMap.get(a.id) : 999
      const bi = orderMap.has(b.id) ? orderMap.get(b.id) : 999
      return ai - bi
    })
  }, [habits, order])

  const addHabit = useCallback((habitData) => {
    const newHabit = {
      id: generateId(),
      name: habitData.name,
      color: habitData.color || 'emerald',
      icon: habitData.icon || 'star',
      targetDays: habitData.targetDays ?? 14,
      completedDates: [],
      createdAt: new Date().toISOString(),
    }
    setHabits((prev) => [...prev, newHabit])
    setOrder((prev) => [...prev, newHabit.id])
    return newHabit.id
  }, [])

  const updateHabit = useCallback((id, updates) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    )
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setOrder((prev) => prev.filter((o) => o !== id))
  }, [])

  const toggleToday = useCallback((id) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const exists = h.completedDates?.some(
          (d) => format(new Date(d), 'yyyy-MM-dd') === today
        )
        if (exists) {
          return {
            ...h,
            completedDates: h.completedDates.filter(
              (d) => format(new Date(d), 'yyyy-MM-dd') !== today
            ),
          }
        }
        return {
          ...h,
          completedDates: [...(h.completedDates || []), new Date().toISOString()],
        }
      })
    )
  }, [])

  // آرشیو: بدون فراخوانی setState داخل callback (جلوگیری از دو نسخه در Strict Mode)
  const archiveHabit = useCallback((habit) => {
    const id = habit.id
    const toArchive = { ...habit, archivedAt: new Date().toISOString() }
    setArchived((prev) => (prev.some((h) => h.id === id) ? prev : [...prev, toArchive]))
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setOrder((prev) => prev.filter((o) => o !== id))
  }, [])

  const unarchiveHabit = useCallback((habit) => {
    const { archivedAt, ...rest } = habit
    const id = rest.id
    setArchived((prev) => prev.filter((h) => h.id !== id))
    setHabits((prev) => [...prev, rest])
    setOrder((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const reorderHabits = useCallback((newOrder) => {
    setOrder(newOrder)
  }, [])

  // آمار کلی
  const stats = useCallback(() => {
    const activeCount = habits.length
    const totalCompleted = habits.reduce(
      (sum, h) => sum + (h.completedDates?.length || 0),
      0
    )
    let longestStreak = 0
    habits.forEach((h) => {
      const ls = getLongestStreak(h.completedDates)
      if (ls > longestStreak) longestStreak = ls
    })
    return { activeCount, totalCompleted, longestStreak }
  }, [habits])

  return {
    habits: sortedHabits(),
    archived,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleToday,
    archiveHabit,
    unarchiveHabit,
    reorderHabits,
    stats,
    order,
    setOrder,
  }
}
