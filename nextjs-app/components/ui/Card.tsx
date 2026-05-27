import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-neutral-border shadow-card hover:shadow-card-hover transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
