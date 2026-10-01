import { Children } from "react";
import { cn } from "@/lib/utils";

type RailProps = {
  label: string;
  itemClassName?: string;
  className?: string;
  children: React.ReactNode;
};

/** Horizontal, snap-scrolling row. Bleeds to the screen edge on mobile for a native feel. */
export function Rail({ label, itemClassName, className, children }: RailProps) {
  return (
    <ul
      aria-label={label}
      className={cn(
        "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-3 sm:-mx-6 sm:scroll-px-6 sm:px-6 [scrollbar-width:thin]",
        className,
      )}
    >
      {Children.map(children, (child) => (
        <li className={cn("w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[22%] wide:w-[15%]", itemClassName)}>
          {child}
        </li>
      ))}
    </ul>
  );
}
