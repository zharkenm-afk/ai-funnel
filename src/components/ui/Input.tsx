import { useId, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block mb-2 text-base font-medium text-zinc-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full h-12 px-4 rounded-xl bg-zinc-950/60 border text-base text-white placeholder:text-zinc-600 outline-none transition-colors ${error ? 'border-error' : 'border-zinc-800 focus:border-teal-500'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </div>
  );
}
