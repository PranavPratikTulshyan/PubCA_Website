import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  className?: string;
}

const variantStyles = {
  primary:   'bg-primary-500 text-white hover:bg-primary-600 shadow-card hover:shadow-card-hover',
  secondary: 'bg-white text-primary-500 border border-neutral-border hover:bg-primary-50',
  ghost:     'bg-transparent text-neutral-text-primary hover:bg-neutral-bg-secondary',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-body-sm',
  md: 'px-7 py-3.5 text-body-md',
  lg: 'px-9 py-4 text-body-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  external = false,
  className = '',
}: ButtonProps) {
  const base = `inline-flex items-center justify-center font-body font-medium rounded-xl transition-all duration-300`;
  const combined = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={combined}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combined}>
      {children}
    </button>
  );
}
