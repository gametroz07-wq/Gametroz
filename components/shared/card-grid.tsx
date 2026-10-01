import { cn } from "@/lib/utils";

// One place for every grid density so pages stay consistent across breakpoints.
export const gridVariants = {
  games: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5 wide:grid-cols-6",
  gamesDense: "grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 wide:grid-cols-8",
  cards: "grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  feature: "grid gap-3 md:grid-cols-3",
  categories: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  guides: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
} as const;

type CardGridProps = {
  variant: keyof typeof gridVariants;
  className?: string;
  children: React.ReactNode;
};

export function CardGrid({ variant, className, children }: CardGridProps) {
  return <div className={cn(gridVariants[variant], className)}>{children}</div>;
}
