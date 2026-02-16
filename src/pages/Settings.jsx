import { Link } from 'react-router-dom'

export function Settings() {
  return (
    <div className="text-center py-20 text-slate-500 animate-slide-up">
      <Link to="/" className="text-xs font-bold text-slate-800 uppercase tracking-widest hover:text-slate-600">
        Назад
      </Link>
      <h2 className="text-3xl mt-4 font-black uppercase">Настройки</h2>
      <p className="mt-4 text-sm">В разработке...</p>
    </div>
  )
}

export default Settings
