/**
 * توابع کمکی برای تاریخ شمسی (جلالی)
 * استفاده از jalaali-js برای تبدیل میلادی به شمسی
 */

import { toJalaali } from 'jalaali-js'

// نام ماه‌های شمسی
const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
]

// تبدیل عدد به اعداد فارسی
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
export function toPersianNumber(num) {
  return String(num).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)])
}

/**
 * تبدیل Date به تاریخ شمسی
 * @param {Date} date
 * @returns {{ jy: number, jm: number, jd: number }}
 */
export function toShamsi(date) {
  return toJalaali(date)
}

/**
 * فرمت تاریخ شمسی برای نمایش
 * @param {Date} date
 * @param {string} format - مثلاً 'd m' یا 'd MMMM yyyy'
 */
export function formatShamsi(date, format = 'd m yyyy') {
  const { jy, jm, jd } = toShamsi(date)
  return format
    .replace('yyyy', String(jy))
    .replace('yy', String(jy).slice(-2))
    .replace('M', PERSIAN_MONTHS[jm - 1])
    .replace('m', String(jm))
    .replace('d', String(jd))
}

/**
 * فقط روز شمسی (۱ تا ۳۱)
 */
export function getShamsiDay(date) {
  return toShamsi(date).jd
}

/**
 * نام ماه شمسی
 */
export function getShamsiMonthName(date) {
  const { jm } = toShamsi(date)
  return PERSIAN_MONTHS[jm - 1]
}

/**
 * ماه و سال شمسی (مثلاً: بهمن ۱۴۰۳)
 */
export function getShamsiMonthYear(date) {
  const { jy, jm } = toShamsi(date)
  return `${PERSIAN_MONTHS[jm - 1]} ${toPersianNumber(jy)}`
}
