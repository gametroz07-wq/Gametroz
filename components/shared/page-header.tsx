import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: React.ReactNode;
  /** Right-hand slot on desktop (search, counts...); stacks below on mobile. */
  aside?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

/** Compact page intro: content starts within the first viewport. */
export function PageHeader({ title, description, eyebrow, aside, className, children }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3 pt-3 pb-1 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0 space-y-1">
        {eyebrow}
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="type-muted max-w-2xl sm:text-[15px]">{description}</p>}
        {children}
      </div>
      {aside && <div className="w-full shrink-0 md:w-80 lg:w-96">{aside}</div>}
    </header>
  );
}
