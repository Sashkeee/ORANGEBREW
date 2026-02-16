import { cn } from '../../lib/utils'

export function LcdText({ 
  children, 
  className, 
  size = 'normal',
  color = 'white',
  ...props 
}) {
  const sizeClasses = {
    small: 'text-2xl',
    normal: 'text-4xl md:text-6xl',
    large: 'text-6xl md:text-9xl',
    huge: 'text-8xl md:text-9xl'
  }
  
  const colorClasses = {
    white: 'text-white',
    orange: 'text-orange-500',
    green: 'text-green-500',
    red: 'text-red-500'
  }
  
  return (
    <div 
      className={cn(
        'font-mono font-bold tracking-tighter lcd',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default LcdText
