import { Link } from 'react-router-dom'
import { Scroll, Plus, History } from 'lucide-react'

export function BrewingChoice() {
  const menuItems = [
    { 
      to: '/brew/list', 
      icon: Scroll,
      label: 'Выбрать',
      bgColor: 'group-hover:bg-orange-500'
    },
    { 
      to: '/brew/create', 
      icon: Plus,
      label: 'Добавить',
      bgColor: 'group-hover:bg-emerald-500'
    },
    { 
      to: '/brew/history', 
      icon: History,
      label: 'История',
      bgColor: 'group-hover:bg-blue-500'
    }
  ]
  
  return (
    <div className="flex flex-col items-center gap-12 animate-slide-up min-h-screen justify-center p-6">
      <h2 className="text-4xl font-black italic uppercase text-orange-500 tracking-tighter">
        Меню Пивовара
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {menuItems.map((item, index) => (
          <Link 
            key={index}
            to={item.to}
            className="glass aspect-square rounded-[3rem] flex flex-col items-center justify-center gap-6 group hover:border-orange-500 transition-all shadow-2xl"
          >
            <div className={`w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center ${item.bgColor} transition-colors shadow-xl`}>
              <item.icon className="w-12 h-12 text-white" />
            </div>
            <span className="text-xl font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
      
      <Link 
        to="/" 
        className="text-xs font-black text-slate-700 uppercase tracking-[0.5em] hover:text-white transition-colors mt-8"
      >
        В начало
      </Link>
    </div>
  )
}

export default BrewingChoice
