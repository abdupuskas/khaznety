interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <span
      className={`text-text-muted text-xs uppercase tracking-[0.2em] font-medium ${className}`}
    >
      {children}
    </span>
  );
}
