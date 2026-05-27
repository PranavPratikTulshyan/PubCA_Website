interface DividerProps {
  className?: string;
}

export default function Divider({ className = '' }: DividerProps) {
  return <div className={`h-px bg-neutral-border ${className}`} />;
}
