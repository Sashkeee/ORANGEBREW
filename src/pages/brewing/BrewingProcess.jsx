import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSocketStore } from '../../stores/useSocketStore'
import { GlassCard } from '../../components/ui/GlassCard'
import { LcdText } from '../../components/ui/LcdText'
import { ModeButton } from '../../components/ui/ModeButton'
import { getPauseName, formatTime } from '../../lib/utils'
import { Activity, Zap, Settings } from 'lucide-react'

export function BrewingProcess() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, send, t1, process, connect } = useSocketStore()
  
  const [heaterSafe, setHeaterSafe] = useState(false)
  const [pump, setPump] = useState(false)
  const [simTemp, setSimTemp] = useState(null)
  
  // Get recipe from location state or store
  const recipe = location.state?.recipe || process.pendingRecipe
  
  // Connect on mount
  useEffect(() => {
    connect()
  }, [connect])
  
  const { active, step, totalTime, stepTime, targetTemp, power, recipeName, recipePauses } = process
  
  const actualTemp = simTemp !== null ? simTemp : (t1 || 20)
  
  // Check if process is finished
  const isFinished = step === 999
  
  const handleStart = () => {
    if (!recipe) return
    send('start_brew', recipe)
  }
  
  const handleStop = () => {
    send('stop_brew', null)
    navigate('/brew')
  }
  
  const handlePump = () => {
    const newPumpState = !pump
    setPump(newPumpState)
    send('set_pwm', { pin: 'ph3', value: newPumpState ? 100 : 0 })
  }
  
  const handleFinish = (toBoil) => {
    if (toBoil) {
      navigate('/brew/boil')
    } else {
      navigate('/brew')
    }
  }
  
  const handleSimTemp = (value) => {
    setSimTemp(Number(value))
    send('debug_temp', Number(value))
  }
  
  const handleResetSim = () => {
    setSimTemp(null)
    send('debug_temp', null)
  }
  
  const pauses = recipePauses || recipe?.pauses || []
  const name = recipeName || recipe?.name || 'ГОТОВ К СТАРТУ'
  
  return (
    <div className="max-w-6xl mx-auto p-4 animate-slide-up min-h-screen relative">
      {/* Debug Panel */}
      <div className="absolute top-24 right-4 p-4 bg-slate-800/90 rounded-2xl border border-slate-700 z-40 w-48 shadow-2xl backdrop-blur">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-black uppercase text-orange-500 tracking-widest">
            Debug Temp
          </span>
          {simTemp !== null && (
            <button 
              onClick={handleResetSim}
              className="text-[8px] text-slate-400 hover:text-white uppercase"
            >
              Reset
            </button>
          )}
        </div>
        <input
          type="range"
          min="20"
          max="100"
          step="0.5"
          value={actualTemp}
          onChange={(e) => handleSimTemp(e.target.value)}
          className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="text-right text-xs font-mono font-bold text-white mt-1">
          {actualTemp.toFixed(1)}°C
        </div>
      </div>
      
      {/* Finish Modal */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-slide-up">
          <GlassCard className="text-center border-t-4 border-green-500 max-w-lg" borderColor="border-green-500">
            <h3 className="text-3xl font-black text-white mb-4 uppercase italic">
              Затирание завершено!
            </h3>
            <p className="text-slate-400 mb-8">
              Все паузы пройдены. Время: {formatTime(totalTime)}.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <ModeButton variant="default" onClick={() => handleFinish(false)}>
                В меню
              </ModeButton>
              <ModeButton variant="secondary" onClick={() => handleFinish(true)}>
                На кипячение
              </ModeButton>
            </div>
          </GlassCard>
        </div>
      )}
      
      {/* Header */}
      <header className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-5xl font-black italic text-orange-500 uppercase tracking-tighter">
            {name}
          </h2>
          <div className="flex gap-4 mt-2">
            <span className="bg-slate-800 px-3 py-1 rounded text-[10px] font-bold uppercase text-slate-400">
              Таймер: {formatTime(totalTime)}
            </span>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Temperature Display */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="border-t-4 border-orange-500" borderColor="border-orange-500">
            <div className="flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                {pump && <div className="animate-spin-slow text-9xl">⚙️</div>}
              </div>
              
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
                  Текущая Температура
                </div>
                <LcdText size="huge" color="white">
                  {actualTemp.toFixed(1)}°C
                </LcdText>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900/50 border border-slate-700">
                  <div className={`w-2 h-2 rounded-full ${
                    active ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                  }`}></div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Статус: {
                      step === -1 
                        ? 'РАЗОГРЕВ' 
                        : step >= 0 
                          ? 'УДЕРЖАНИЕ ПАУЗЫ' 
                          : 'ОЖИДАНИЕ'
                    }
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
                  Цель
                </div>
                <LcdText size="large" color="orange">
                  {targetTemp}°C
                </LcdText>
              </div>
            </div>
          </GlassCard>
          
          {/* Pauses List */}
          <div className="space-y-2">
            {pauses.map((pause, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  step === index 
                    ? 'bg-orange-500/10 border-orange-500 scale-[1.02]' 
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                    step === index ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-sm uppercase">
                      {getPauseName(pause.t)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {pause.t}°C
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <LcdText size="normal" color={step === index ? 'orange' : 'white'}>
                    {step === index 
                      ? formatTime((pause.m * 60) - stepTime) 
                      : `${pause.m} мин`
                    }
                  </LcdText>
                  {step === index && (
                    <div className="text-[8px] font-bold text-orange-500 uppercase">
                      Активна
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Heater Control */}
          <GlassCard className="border-t-4 border-red-500" borderColor="border-red-500">
            <label className="flex items-center gap-4 cursor-pointer group p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-red-500 transition-all mb-6">
              <input
                type="checkbox"
                className="brew-checkbox"
                checked={heaterSafe}
                onChange={(e) => setHeaterSafe(e.target.checked)}
                disabled={active}
              />
              <span className="text-xs font-black uppercase text-slate-300">
                ТЭН покрыт водой
              </span>
            </label>
            
            {!active ? (
              <ModeButton
                variant={heaterSafe ? 'secondary' : 'default'}
                onClick={handleStart}
                disabled={!heaterSafe}
                className="w-full"
                icon={Zap}
              >
                Начать затирание
              </ModeButton>
            ) : (
              <ModeButton
                variant="danger"
                onClick={handleStop}
                className="w-full"
                icon={Activity}
              >
                ОСТАНОВИТЬ
              </ModeButton>
            )}
          </GlassCard>
          
          {/* Power & Pump */}
          <GlassCard>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-slate-500">
                  Мощность ТЭНа
                </span>
                <LcdText size="normal" color="orange">
                  {power}%
                </LcdText>
              </div>
              <input
                type="range"
                className="w-full h-2 bg-slate-900 rounded-lg"
                value={power}
                disabled
              />
            </div>
            
            <ModeButton
              variant={pump ? 'primary' : 'default'}
              onClick={handlePump}
              className="w-full"
              icon={Settings}
            >
              {pump ? 'Насос ВКЛ' : 'Насос ВЫКЛ'}
            </ModeButton>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default BrewingProcess
