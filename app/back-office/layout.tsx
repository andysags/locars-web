import Link from "next/link";
import Image from "next/image";
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CogIcon,
  DocumentTextIcon,
  StarIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans text-white"
      style={{
        ["--locars-text-primary" as any]: "#f8fafc",
        ["--locars-text-secondary" as any]: "#cbd5e1",
        ["--locars-text-tertiary" as any]: "#94a3b8",
      }}
    >
      <aside className="w-64 border-r border-white/10 bg-slate-950/95 shadow-2xl shadow-black/20 flex flex-col backdrop-blur-xl">
        <div className="border-b border-white/10 p-6">
          <Image
            src="/locars-logo.png"
            alt="Locars Logo"
            width={140}
            height={56}
            className="h-14 w-auto object-contain mix-blend-screen"
          />
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/back-office"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <HomeIcon className="h-5 w-5" /> Dashboard
          </Link>
          <Link
            href="/back-office/users"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <UsersIcon className="h-5 w-5" /> Utilisateurs
          </Link>
          
          <Link
            href="/back-office/contact-requests"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <DocumentTextIcon className="h-5 w-5" /> Contacts
          </Link>
          <Link
            href="/back-office/delete-requests"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <DocumentTextIcon className="h-5 w-5" /> Suppressions
          </Link>
          <Link
            href="/back-office/web-requests"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <DocumentTextIcon className="h-5 w-5" /> Demandes d'Inscription
          </Link>
          <Link
            href="/back-office/cars"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <TruckIcon className="h-5 w-5" /> Véhicules
          </Link>
          <Link
            href="/back-office/reviews"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <StarIcon className="h-5 w-5" /> Revues & Évaluations
          </Link>
          <Link
            href="/back-office/reservations"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <CalendarDaysIcon className="h-5 w-5" /> Réservations
          </Link>
          <Link
            href="/back-office/analytics"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChartPieIcon className="h-5 w-5" /> Rentabilité
          </Link>
          <Link
            href="/back-office/host-commissions"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <CurrencyDollarIcon className="h-5 w-5" /> Commissions
          </Link>
          <Link
            href="/back-office/settings"
            className="flex items-center gap-3 rounded-xl p-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <CogIcon className="h-5 w-5" /> Paramètres
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
