import { Link } from 'react-router-dom'

export function Home() {
  const menuItems = [
    { to: '/brew', label: 'Пивоварение', color: 'text-orange-500 hover:text-orange-500', disabled: false },
    { to: '#', label: 'Дистилляция', color: 'text-slate-700 cursor-not-allowed', disabled: true },
    { to: '#', label: 'Ректификация', color: 'text-slate-700 cursor-not-allowed', disabled: true },
    { to: '#', label: 'Брожение', color: 'text-slate-700 cursor-not-allowed', disabled: true }
  ]
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-slide-up">
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase mb-4 text-center">
        ORANGE<span className="text-orange-500">BREW</span>
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
        {menuItems.map((item, index) => (
          <Link 
            key={index}
            to={item.to}
            className={`text-sm font-black uppercase tracking-[0.2em] transition ${item.color} ${item.disabled ? 'pointer-events-none' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      <Link 
        to="/settings" 
        className="mt-10 text-[10px] font-bold text-slate-800 uppercase tracking-widest hover:text-slate-600"
      >
        Настройки
      </Link>
    </div>
  )
}

export default Home
