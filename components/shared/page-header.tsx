import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

/** Compact page intro: never a full-screen hero, content starts above the fold. */
export function PageHeader({ title, description, eyebrow, className, children }: PageHeaderProps) {
  return (
    <header className={cn("space-y-3 pt-6 pb-2 sm:pt-8", className)}>
      {eyebrow}
      <h1 className="type-h1">{title}</h1>
      {description && <p className="type-body max-w-2xl text-muted-foreground">{description}</p>}
      {children}
    </header>
  );
}
