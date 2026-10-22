import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon = null,
  title = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 focus:ring-offset-[#080612] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-glow hover:shadow-purple-500/30',
    secondary: 'bg-[#15102d] hover:bg-[#241b4d] text-purple-100 border border-[#2a1f56] hover:border-[#4c3891] shadow-xs',
    ghost: 'bg-transparent hover:bg-[#1a1438] text-purple-200 hover:text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    accent: 'bg-purple-600 hover:bg-purple-700 text-white shadow-glow',
    dark: 'bg-[#0e0b1f] hover:bg-[#15102d] text-purple-100 border border-[#2a1f56]'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2 text-purple-300 hover:text-white'
  };

  return (
    <button
      title={title}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.secondary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className={`w-4 h-4 shrink-0 ${children ? '' : 'mx-auto'}`} />
      ) : null}
      {children}
    </button>
  );
};
