import { Outlet } from 'react-router-dom'
import { useSocketStore } from '../stores/useSocketStore'

export function Layout() {
  const { connected, connecting } = useSocketStore()
  
  return (
    <div className="min-h-screen bg-bg">
      {/* Connection Status Indicator */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3 rounded-full glass border border-white/10 shadow-2xl">
        <div className={`w-2.5 h-2.5 rounded-full ${
          connected 
            ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' 
            : connecting 
              ? 'bg-yellow-500 animate-pulse'
              : 'bg-red-500 animate-pulse'
        }`}></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {connected ? 'Server Online' : connecting ? 'Connecting...' : 'Disconnected'}
        </span>
      </div>
      
      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
