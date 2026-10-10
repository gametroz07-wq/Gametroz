import { notFound } from "next/navigation";

// Unknown URLs: without a matching page Next renders the global fallback outside the locale
// layout. Throwing here keeps the 404 inside it (document shell, fonts, theme) and returns 404.
export default function UnknownPage() {
  notFound();
}
