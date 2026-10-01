import { cn } from "@/lib/utils";

// One place for every grid density so pages stay consistent across breakpoints.
export const gridVariants = {
  games: "grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 wide:grid-cols-6",
  cards: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  feature: "grid gap-4 md:grid-cols-3",
  categories: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  guides: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
} as const;

type CardGridProps = {
  variant: keyof typeof gridVariants;
  className?: string;
  children: React.ReactNode;
};

export function CardGrid({ variant, className, children }: CardGridProps) {
  return <div className={cn(gridVariants[variant], className)}>{children}</div>;
}
