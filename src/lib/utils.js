import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function getPauseName(temp) {
  if (temp >= 35 && temp <= 45) return "Кислотная пауза"
  if (temp >= 44 && temp <= 59) return "Белковая пауза"
  if (temp >= 61 && temp <= 72) return "Пауза осахаривания"
  if (temp >= 77 && temp <= 79) return "Мэш-аут"
  return "Температурная пауза"
}
