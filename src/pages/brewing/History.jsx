import { Link } from 'react-router-dom'
import { useSocketStore } from '../../stores/useSocketStore'

export function History() {
  const { history } = useSocketStore()
  
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date))
  
  return (
    <div className="max-w-4xl mx-auto p-6 animate-slide-up min-h-screen flex flex-col">
      <header className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-200">
          История Варок
        </h2>
        <Link 
          to="/brew" 
          className="bg-slate-800 px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest"
        >
          Назад
        </Link>
      </header>
      
      <div className="space-y-4 overflow-y-auto custom-scroll flex-1 pb-20">
        {sortedHistory.map((item) => (
          <div 
            key={item.id}
            className="w-full flex items-center gap-4 p-6 rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-orange-500/50 group transition-all"
          >
            <div className="flex-1 text-left">
              <div className="text-2xl font-black text-orange-500 group-hover:text-white transition uppercase italic">
                {item.name}
              </div>
              <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>{item.brewer}</span>
                <span className="text-slate-700">|</span>
                <span>{item.date}</span>
                <span className="text-green-500 ml-auto">Завершено: {item.finishTime}</span>
              </div>
            </div>
          </div>
        ))}
        
        {sortedHistory.length === 0 && (
          <p className="text-center py-20 opacity-20 font-black uppercase tracking-widest">
            История пуста
          </p>
        )}
      </div>
    </div>
  )
}

export default History
