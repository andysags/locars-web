"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const shouldShowChrome = (pathname: string) => {
  return !pathname.startsWith("/back-office") && !pathname.startsWith("/auth");
};

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showChrome = shouldShowChrome(pathname);

  if (!showChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-white">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
