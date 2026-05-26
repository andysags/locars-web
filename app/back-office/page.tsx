"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  UsersIcon,
  TruckIcon,
  SparklesIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { getDashboardStats } from "@/lib/firebase-utils";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

interface DashboardStats {
  pendingAccounts: number;
  pendingVehicles: number;
  activeRenters: number;
  siteRequests: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingAccounts: 0,
    pendingVehicles: 0,
    activeRenters: 0,
    siteRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const dashboardStats = await getDashboardStats(db);
        setStats(dashboardStats);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Comptes en attente",
      value: stats.pendingAccounts,
      icon: UsersIcon,
      color: "text-sky-300",
      bgColor: "bg-sky-500/15",
    },
    {
      label: "Véhicules en attente",
      value: stats.pendingVehicles,
      icon: TruckIcon,
      color: "text-amber-300",
      bgColor: "bg-amber-500/15",
    },
    {
      label: "Loueurs Actifs",
      value: stats.activeRenters,
      icon: SparklesIcon,
      color: "text-emerald-300",
      bgColor: "bg-emerald-500/15",
    },
    {
      label: "Demandes par le Site",
      value: stats.siteRequests,
      icon: EnvelopeIcon,
      color: "text-violet-300",
      bgColor: "bg-violet-500/15",
    },
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div>
        <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-300">
          Espace admin
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 sm:text-4xl">
          Tableau de bord
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Bienvenue dans l'administration Locars
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-12"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 text-red-200 backdrop-blur-xl">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/7"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium tracking-wide text-slate-300 uppercase">
                    {card.label}
                  </h3>
                  <div className={`${card.bgColor} p-3 rounded-2xl ring-1 ring-white/10`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
                <p className="text-4xl font-semibold tracking-tight text-white">{card.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/15 via-blue-500/10 to-indigo-500/10 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.20),transparent_32%)]" />
        <div className="flex items-start gap-4">
          <div className="relative z-10 bg-white/10 p-3 rounded-2xl ring-1 ring-white/15">
            <SparklesIcon className="h-6 w-6 text-sky-200" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-white mb-2 sm:text-2xl">
              Bienvenue, Administrateur
            </h2>
            <p className="max-w-4xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Utilisez les menus sur la gauche pour valider les nouveaux comptes
              utilisateurs et l'ajout de nouveaux véhicules sur la plateforme
              Locars. Les demandes en attente apparaissent dans les statistiques
              ci-dessus.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/back-office/users"
          className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
        >
          <UsersIcon className="h-8 w-8 text-sky-300 mb-4 transition-transform group-hover:scale-110" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            Gérer les utilisateurs
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Approuver ou rejeter les demandes de devenir loueur
          </p>
        </a>

        <a
          href="/back-office/cars"
          className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
        >
          <TruckIcon className="h-8 w-8 text-amber-300 mb-4 transition-transform group-hover:scale-110" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            Gérer les véhicules
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Approuver ou rejeter les ajouts de véhicules
          </p>
        </a>
      </div>
    </div>
  );
}
