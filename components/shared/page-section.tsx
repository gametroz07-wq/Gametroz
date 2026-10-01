import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

type PageSectionProps = {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; href: string };
  className?: string;
  children: React.ReactNode;
};

export function PageSection({ id, title, description, icon, action, className, children }: PageSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-4 sm:py-5", className)}>
      <SectionHeader id={headingId} title={title} description={description} icon={icon} action={action} />
      {children}
    </section>
  );
}
