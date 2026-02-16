import { cn } from '../../lib/utils'

export function GlassCard({ 
  children, 
  className, 
  borderColor = 'border-white/5',
  ...props 
}) {
  return (
    <div 
      className={cn(
        '2glass rounded-[.5rem] p-6 md:p-8',
        borderColor,
        'border shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlassCard
