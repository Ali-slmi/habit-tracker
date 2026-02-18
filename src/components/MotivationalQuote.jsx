/**
 * جمله انگیزشی فارسی تصادفی
 */

const QUOTES = [
  'هر روز یک قدم کوچک، یک دستاورد بزرگ. 💪',
  'عادت‌های کوچک، زندگی بزرگ می‌سازند. 🌱',
  'امروز بهترین روز برای شروع است. ✨',
  'پایداری کلید موفقیت است. 🔑',
]

export default function MotivationalQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  return (
    <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-2 font-sans">
      {quote}
    </p>
  )
}
