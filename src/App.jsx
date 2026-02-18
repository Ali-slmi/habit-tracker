/**
 * کامپوننت اصلی اپلیکیشن ردیاب عادت‌ها
 * شامل لیست عادت‌ها، modal فرم، آرشیو، drag & drop و dark mode
 */

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useHabits } from './hooks/useHabits'
import Header from './components/Header'
import HabitCard from './components/HabitCard'
import HabitForm from './components/HabitForm'
import MotivationalQuote from './components/MotivationalQuote'
import { getTheme, saveTheme } from './utils/storage'

// کامپوننت Sortable برای هر کارت عادت
function SortableHabitCard({ habit, onToggle, onEdit, onDelete, onArchive }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50' : ''}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing text-gray-400 shrink-0 hidden sm:block"
          aria-label="جابجایی"
        >
          <GripVertical size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <HabitCard
            habit={habit}
            onToggleToday={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
          />
        </div>
      </div>
    </div>
  )
}

// لیست عادت‌های آرشیو شده
function ArchivedList({ archived, onUnarchive, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">عادت‌های آرشیو شده</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-96">
          {archived.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              عادتی آرشیو نشده است.
            </p>
          ) : (
            <div className="space-y-2">
              {archived.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <span className="font-medium">{h.name}</span>
                  <button
                    onClick={() => onUnarchive(h)}
                    className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
                  >
                    بازیابی
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const {
    habits,
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
  } = useHabits()

  const [formOpen, setFormOpen] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [showArchived, setShowArchived] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = getTheme()
    if (saved === 'dark' || saved === 'light') return saved
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // اعمال فوری تم - یک کلیک کافی
  useEffect(() => {
    const root = document.documentElement
    const isDark = darkMode === 'dark'
    root.classList.toggle('dark', isDark)
    saveTheme(darkMode)
  }, [darkMode])

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleAddHabit = () => {
    setEditHabit(null)
    setFormOpen(true)
  }

  const handleEditHabit = (habit) => {
    setEditHabit(habit)
    setFormOpen(true)
  }

  const handleSubmitHabit = (data) => {
    if (editHabit) {
      updateHabit(editHabit.id, data)
    } else {
      addHabit(data)
    }
    setFormOpen(false)
    setEditHabit(null)
  }

  const handleDeleteHabit = (id) => {
    if (window.confirm('آیا از حذف این عادت اطمینان داری؟')) {
      deleteHabit(id)
    }
  }

  // بستن با Escape
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setFormOpen(false)
        setEditHabit(null)
        setShowArchived(false)
      }
    },
    []
  )
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id)
      const newIndex = order.indexOf(over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(order, oldIndex, newIndex)
        reorderHabits(newOrder)
      }
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const statValues = stats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        onAddHabit={handleAddHabit}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        stats={statValues}
        onShowArchived={() => setShowArchived(true)}
        showArchived={showArchived}
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <MotivationalQuote />

        {habits.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              هنوز عادتی اضافه نکردی. از دکمه بالا شروع کن!
            </p>
            <button
              onClick={handleAddHabit}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
            >
              اضافه کردن اولین عادت
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={habits.map((h) => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {habits.map((habit) => (
                  <SortableHabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleToday}
                    onEdit={handleEditHabit}
                    onDelete={handleDeleteHabit}
                    onArchive={(h) => archiveHabit(h)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </main>

      <HabitForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditHabit(null)
        }}
        onSubmit={handleSubmitHabit}
        editHabit={editHabit}
      />

      {showArchived && (
        <ArchivedList
          archived={archived}
          onUnarchive={unarchiveHabit}
          onClose={() => setShowArchived(false)}
        />
      )}
    </div>
  )
}
