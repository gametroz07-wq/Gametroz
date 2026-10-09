import { AppWindow, Gamepad2, Home, Wrench } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Apps", href: "/apps", icon: AppWindow },
];

export function NotFoundContent() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <EmptyState
        title="Page not found"
        description="This page does not exist or has moved. Try one of these instead:"
        className="w-full max-w-lg"
        action={
          <nav aria-label="Suggested pages" className="mt-2">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {links.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex flex-col items-center gap-1 rounded-xl bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        }
      />
    </main>
  );
}
