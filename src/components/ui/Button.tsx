import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-[0_8px_30px_-8px_rgba(20,184,166,0.6)]',
  outline: 'text-white border border-zinc-700 bg-zinc-900/40 hover:border-teal-500/60 hover:bg-zinc-800/60',
};

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm rounded-lg',
  md: 'h-12 px-5 text-base rounded-xl',
  lg: 'min-h-14 px-7 py-3 text-base sm:text-lg rounded-xl',
};

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-semibold text-center transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
