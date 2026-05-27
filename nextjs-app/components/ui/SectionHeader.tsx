import Badge from './Badge';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  const alignClass = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <div className={`flex flex-col ${alignClass} max-w-[640px] ${align === 'center' ? 'mx-auto' : ''}`}>
      {eyebrow && (
        <div className="mb-4">
          <Badge>{eyebrow}</Badge>
        </div>
      )}
      <h2 className="font-heading font-extrabold text-heading-xl md:text-display-md text-neutral-text-primary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-body-md md:text-body-lg text-neutral-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
}
