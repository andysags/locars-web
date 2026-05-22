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
    <div className="flex h-screen bg-blue-50">
      <aside className="w-64 bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-border">
          <Image
            src="/locars-logo.png"
            alt="Locars Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/back-office"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <HomeIcon className="h-5 w-5" /> Dashboard
          </Link>
          <Link
            href="/back-office/users"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <UsersIcon className="h-5 w-5" /> Utilisateurs
          </Link>
          
          <Link
            href="/back-office/contact-requests"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5" /> Contacts
          </Link>
          <Link
            href="/back-office/delete-requests"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5" /> Suppressions
          </Link>
          <Link
            href="/back-office/web-requests"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5" /> Demandes d'Inscription
          </Link>
          <Link
            href="/back-office/cars"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <TruckIcon className="h-5 w-5" /> Véhicules
          </Link>
          <Link
            href="/back-office/reviews"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <StarIcon className="h-5 w-5" /> Revues & Évaluations
          </Link>
          <Link
            href="/back-office/reservations"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <CalendarDaysIcon className="h-5 w-5" /> Réservations
          </Link>
          <Link
            href="/back-office/analytics"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <ChartPieIcon className="h-5 w-5" /> Rentabilité
          </Link>
          <Link
            href="/back-office/host-commissions"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <CurrencyDollarIcon className="h-5 w-5" /> Commissions
          </Link>
          <Link
            href="/back-office/settings"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-ink hover:text-accent transition-colors"
          >
            <CogIcon className="h-5 w-5" /> Paramètres
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-blue-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
