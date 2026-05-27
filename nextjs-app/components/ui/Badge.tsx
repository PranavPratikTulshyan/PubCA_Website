import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
}

const variantStyles = {
  default:   'bg-primary-50 text-primary-700',
  primary:   'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-600',
};

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3.5 py-1 font-body text-body-sm font-semibold ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
