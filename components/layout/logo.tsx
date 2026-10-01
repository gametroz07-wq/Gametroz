import Link from "next/link";
import { GametrozLogo } from "@/components/brand/gametroz-logo";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** Unique per instance (SVG ids are global). */
  id?: string;
  size?: "header" | "footer";
  className?: string;
};

export function Logo({ id = "logo-header", size = "header", className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "block shrink-0 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        size === "header" ? "w-36 sm:w-40" : "w-52 sm:w-60",
        className,
      )}
    >
      <GametrozLogo id={id} halo={size === "footer"} className="w-full" />
    </Link>
  );
}
