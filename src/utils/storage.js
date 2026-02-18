/**
 * مدیریت ذخیره‌سازی در localStorage
 * تمام داده‌های اپلیکیشن در مرورگر ذخیره می‌شوند
 */

const STORAGE_KEYS = {
  HABITS: 'habit-tracker-habits',
  ORDER: 'habit-tracker-order',
  ARCHIVED: 'habit-tracker-archived',
  THEME: 'habit-tracker-theme',
}

/**
 * خواندن عادت‌ها از localStorage
 * @returns {Array} لیست عادت‌ها
 */
export function getHabits() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * ذخیره عادت‌ها در localStorage
 * @param {Array} habits لیست عادت‌ها
 */
export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits))
  } catch (e) {
    console.error('خطا در ذخیره عادت‌ها:', e)
  }
}

/**
 * خواندن ترتیب عادت‌ها
 */
export function getHabitOrder() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDER)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * ذخیره ترتیب عادت‌ها
 */
export function saveHabitOrder(order) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDER, JSON.stringify(order))
  } catch (e) {
    console.error('خطا در ذخیره ترتیب:', e)
  }
}

/**
 * خواندن عادت‌های آرشیو شده
 */
export function getArchivedHabits() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ARCHIVED)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * ذخیره عادت‌های آرشیو شده
 */
export function saveArchivedHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEYS.ARCHIVED, JSON.stringify(habits))
  } catch (e) {
    console.error('خطا در ذخیره آرشیو:', e)
  }
}

/**
 * خواندن تم (dark/light)
 */
export function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'system'
}

/**
 * ذخیره تم
 */
export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
}
