import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 font-sans backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/locars-logo.png" alt="Locars" width={280} height={74} className="h-14 w-auto object-contain mix-blend-screen" />
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <Link href="/" className="text-sm text-gray-300 hover:text-white">Accueil</Link>
          <a href="/#how-it-works" className="text-sm text-gray-300 hover:text-white">Comment ça marche</a>
          <a href="/#why-us" className="text-sm text-gray-300 hover:text-white">Pourquoi nous</a>
          <Link href="/become-host" className="text-sm text-gray-300 hover:text-white">Devenir loueur</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/become-host" className="text-sm text-gray-300 hover:text-white md:hidden">Devenir loueur</Link>
          <Link href="/download" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white">Télécharger l'app</Link>
        </div>
      </div>
    </header>
  );
}
