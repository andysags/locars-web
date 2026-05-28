"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 font-sans backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-0 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center ml-0">
            <Image src="/locars-logo.png" alt="Locars" width={280} height={74} className="h-14 w-auto object-contain mix-blend-screen" />
          </Link>
        </div>

        <nav className="hidden items-center gap-4 md:flex">
          <Link href="/" className="text-sm text-gray-300 hover:text-white">Accueil</Link>
          <a href="/#how-it-works" className="text-sm text-gray-300 hover:text-white">Comment ça marche</a>
          <a href="/#why-us" className="text-sm text-gray-300 hover:text-white">Pourquoi nous</a>
          <Link href="/become-host" className="text-sm text-gray-300 hover:text-white">Devenir loueur</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Link href="/download" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white">Télécharger l'app</Link>
          </div>

          <button
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center md:hidden p-2 rounded-md text-slate-200 hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute left-4 right-4 top-20 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl p-4 z-50">
          <div className="flex flex-col gap-3">
            <Link href="/" onClick={closeMenu} className="px-3 py-2 rounded hover:bg-white/5">Accueil</Link>
            <a href="/#how-it-works" onClick={closeMenu} className="px-3 py-2 rounded hover:bg-white/5">Comment ça marche</a>
            <a href="/#why-us" onClick={closeMenu} className="px-3 py-2 rounded hover:bg-white/5">Pourquoi nous</a>
            <Link href="/become-host" onClick={closeMenu} className="px-3 py-2 rounded hover:bg-white/5">Devenir loueur</Link>
            <Link href="/download" onClick={closeMenu} className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white">Télécharger l'app</Link>
          </div>
        </div>
      )}
    </header>
  );
}
