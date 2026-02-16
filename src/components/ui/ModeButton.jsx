import { cn } from '../../lib/utils'

export function ModeButton({ 
  children, 
  onClick,
  variant = 'default',
  size = 'normal',
  disabled = false,
  className,
  icon: Icon,
  ...props 
}) {
  const variants = {
    default: 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700',
    primary: 'bg-orange-600 hover:bg-orange-500 text-white border-orange-500 shadow-lg',
    secondary: 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white border-red-500',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white border-transparent',
    disabled: 'bg-slate-800 text-slate-600 cursor-not-allowed border-slate-800'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-xs',
    normal: 'px-6 py-3 text-sm',
    large: 'px-8 py-4 text-base',
    icon: 'p-3'
  }
  
  const finalVariant = disabled ? 'disabled' : variant
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'font-bold uppercase tracking-wider rounded-xl border transition-all flex items-center justify-center gap-2',
        variants[finalVariant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  )
}

export default ModeButton
