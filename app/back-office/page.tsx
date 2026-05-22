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
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Véhicules en attente",
      value: stats.pendingVehicles,
      icon: TruckIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Loueurs Actifs",
      value: stats.activeRenters,
      icon: SparklesIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Demandes par le Site",
      value: stats.siteRequests,
      icon: EnvelopeIcon,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">Tableau de bord</h1>
        <p className="text-muted">Bienvenue dans l'administration Locars</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-sm border border-border animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted">
                    {card.label}
                  </h3>
                  <div className={`${card.bgColor} p-3 rounded-2xl`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
                <p className="text-4xl font-bold text-ink">{card.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-8 rounded-3xl shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-accent p-3 rounded-2xl">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink mb-2">
              Bienvenue, Administrateur
            </h2>
            <p className="text-muted leading-relaxed">
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
          className="bg-white border border-border p-6 rounded-3xl hover:shadow-md transition-shadow cursor-pointer group"
        >
          <UsersIcon className="h-8 w-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-ink mb-2">Gérer les utilisateurs</h3>
          <p className="text-muted text-sm">
            Approuver ou rejeter les demandes de devenir loueur
          </p>
        </a>

        <a
          href="/back-office/cars"
          className="bg-white border border-border p-6 rounded-3xl hover:shadow-md transition-shadow cursor-pointer group"
        >
          <TruckIcon className="h-8 w-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-ink mb-2">Gérer les véhicules</h3>
          <p className="text-muted text-sm">
            Approuver ou rejeter les ajouts de véhicules
          </p>
        </a>
      </div>
    </div>
  );
}
