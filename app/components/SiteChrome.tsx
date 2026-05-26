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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
