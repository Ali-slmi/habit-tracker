import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// پیکربندی Vite برای پروژه ردیاب عادت‌ها
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
