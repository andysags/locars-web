import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/app/components/SiteChrome";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Locars | Location de vehicules",
  description:
    "Louez ou mettez en location des vehicules rapidement avec Locars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${poppins.variable} ${playfair.variable} min-h-screen antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
