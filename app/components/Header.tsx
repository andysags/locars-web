import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-50 bg-slate-950/95 backdrop-blur-xl shadow-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/locars-logo.png" alt="Locars" width={280} height={74} className="h-14 w-auto object-contain mix-blend-screen" />
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-300 hover:text-white">Accueil</Link>
          <a href="#how-it-works" className="text-sm text-gray-300 hover:text-white">Comment ça marche</a>
          <a href="#why-us" className="text-sm text-gray-300 hover:text-white">Pourquoi nous</a>
          <Link href="/become-host" className="text-sm text-gray-300 hover:text-white">Devenir loueur</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/become-host" className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold">Devenir loueur</Link>
        </div>
      </div>
    </header>
  );
}
