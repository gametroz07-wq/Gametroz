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
        "-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:gap-3 sm:scroll-px-6 sm:px-6 [scrollbar-width:none]",
        className,
      )}
    >
      {Children.map(children, (child) => (
        <li className={cn("w-[42%] shrink-0 snap-start sm:w-[28%] lg:w-[19%] wide:w-[15.5%]", itemClassName)}>
          {child}
        </li>
      ))}
    </ul>
  );
}
