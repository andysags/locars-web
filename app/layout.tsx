import type { Metadata } from "next";
import { Instrument_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/app/components/SiteChrome";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Votre voiture en 3 clics",
  description:
    "Louez ou mettez en location des vehicules rapidement avec Locars.",
  icons: {
    icon: "/locars-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${instrumentSans.variable} ${playfair.variable} min-h-screen antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
