import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
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
      className={`${plusJakarta.variable} min-h-screen antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
