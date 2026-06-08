import { cn } from '@/utils/cn';

interface YellowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function YellowButton({
  children,
  className,
  ...props
}: YellowButtonProps) {
  return (
    <button
      className={cn(
        'bg-yellow-gradient shadow-yellow-glow text-white font-instrument font-bold text-lg md:text-xl px-8 py-4 rounded-full uppercase tracking-wide hover:opacity-90 transition-opacity',
        className
      )}
      {...props}>
      {children}
    </button>
  );
}
