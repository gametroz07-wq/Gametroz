import { SearchDialog } from "@/components/search/search-dialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Container } from "./container";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center gap-6">
        <Logo />
        <MainNav className="hidden md:block" />

        {/* Desktop actions */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <SearchDialog variant="bar" enableShortcut />
          <ThemeToggle />
        </div>

        {/* Mobile actions: Logo | Search | Menu */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <SearchDialog variant="icon" />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
