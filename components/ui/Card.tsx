import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("card-pad", className)}>{children}</div>;
}

export function CardTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      {eyebrow && <div className="heading-eyebrow mb-1">{eyebrow}</div>}
      {title && <h3 className="text-lg font-semibold text-ink">{title}</h3>}
      {children}
    </div>
  );
}
