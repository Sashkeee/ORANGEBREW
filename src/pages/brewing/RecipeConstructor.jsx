import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSocketStore } from '../../stores/useSocketStore'
import { GlassCard } from '../../components/ui/GlassCard'
import { ModeButton } from '../../components/ui/ModeButton'

export function RecipeConstructor() {
  const navigate = useNavigate()
  const { send } = useSocketStore()
  
  const [form, setForm] = useState({
    brewer: '',
    date: new Date().toISOString().split('T')[0],
    name: '',
    location: '',
    ingredients: '',
    pauses: [{ t: 62, m: 40 }]
  })
  
  const [errors, setErrors] = useState({})
  
  const updatePause = (index, field, value) => {
    const newPauses = [...form.pauses]
    newPauses[index] = { ...newPauses[index], [field]: Number(value) }
    setForm({ ...form, pauses: newPauses })
  }
  
  const addPause = () => {
    setForm({
      ...form,
      pauses: [...form.pauses, { t: 72, m: 20 }]
    })
  }
  
  const removePause = (index) => {
    if (form.pauses.length > 1) {
      const newPauses = form.pauses.filter((_, i) => i !== index)
      setForm({ ...form, pauses: newPauses })
    }
  }
  
  const validate = () => {
    const newErrors = {}
    if (!form.brewer.trim()) newErrors.brewer = 'Обязательно'
    if (!form.name.trim()) newErrors.name = 'Обязательно'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSave = () => {
    if (!validate()) return
    const recipe = { ...form, id: Date.now().toString() }
    send('save_recipe', recipe)
    navigate('/brew')
  }
  
  const handleStart = () => {
    if (!validate()) return
    const recipe = { ...form, id: Date.now().toString() }
    send('save_recipe', recipe)
    useSocketStore.setState(state => ({
      process: { ...state.process, pendingRecipe: recipe }
    }))
    navigate('/brew/process', { state: { recipe } })
  }
  
  return (
    <div className="max-w-4xl mx-auto my-10 px-6 animate-slide-up">
      <GlassCard className="border-t-4 border-orange-500" borderColor="border-orange-500">
        <h3 className="text-3xl font-black uppercase text-orange-500 mb-8 italic">
          Новый Рецепт
        </h3>
        
        <div className="space-y-6">
          {/* Основные поля */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                className={`w-full input-glass p-4 rounded-xl font-bold ${errors.brewer ? 'border-red-500' : ''}`}
                value={form.brewer}
                onChange={(e) => setForm({ ...form, brewer: e.target.value })}
                placeholder="Пивовар *"
              />
              {errors.brewer && <span className="text-red-500 text-xs">{errors.brewer}</span>}
            </div>
            <input
              type="date"
              className="input-glass p-4 rounded-xl font-bold"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          
          <div>
            <input
              className={`w-full input-glass p-4 rounded-xl font-bold text-xl ${errors.name ? 'border-red-500' : ''}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Название Рецепта *"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              className="input-glass p-4 rounded-xl"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Место варки"
            />
            <input
              className="input-glass p-4 rounded-xl"
              value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              placeholder="Ингредиенты"
            />
          </div>
          
          {/* Паузы */}
          <div className="space-y-3 pt-6 border-t border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Паузы
              </span>
              <button
                onClick={addPause}
                className="bg-orange-500 text-[10px] font-black px-4 py-2 rounded-lg uppercase"
              >
                + Добавить
              </button>
            </div>
            
            {form.pauses.map((pause, index) => (
              <div 
                key={index}
                className="flex gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800"
              >
                <span className="text-xs font-black text-slate-700 w-4">{index + 1}</span>
                <input
                  type="number"
                  className="w-full input-glass p-2 rounded-lg text-center font-bold text-orange-500"
                  value={pause.t}
                  onChange={(e) => updatePause(index, 't', e.target.value)}
                />
                <span className="text-[10px] font-bold text-slate-500">°C</span>
                <input
                  type="number"
                  className="w-full input-glass p-2 rounded-lg text-center font-bold"
                  value={pause.m}
                  onChange={(e) => updatePause(index, 'm', e.target.value)}
                />
                <span className="text-[10px] font-bold text-slate-500">МИН</span>
                {form.pauses.length > 1 && (
                  <button
                    onClick={() => removePause(index)}
                    className="text-slate-600 hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Кнопки */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <Link to="/brew">
              <ModeButton variant="default" className="w-full">
                Отмена
              </ModeButton>
            </Link>
            <ModeButton variant="default" onClick={handleSave} className="w-full">
              Сохранить
            </ModeButton>
            <ModeButton variant="primary" onClick={handleStart} className="w-full">
              Начать Варку
            </ModeButton>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default RecipeConstructor
