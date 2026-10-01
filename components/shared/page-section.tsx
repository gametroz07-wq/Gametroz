import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

type PageSectionProps = {
  id: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
  children: React.ReactNode;
};

export function PageSection({ id, title, description, action, className, children }: PageSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-6 sm:py-8", className)}>
      <SectionHeader id={headingId} title={title} description={description} action={action} />
      {children}
    </section>
  );
}
