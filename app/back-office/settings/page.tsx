"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
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

export default function SettingsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
        console.error("Error fetching stats:", err);
        setError("Erreur lors du chargement des paramètres");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CogIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        </div>
        <p className="text-slate-300">
          Gestion des paramètres et configuration de l'application
        </p>
      </div>

      {error && (
        <div className="rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-300" />
            <p className="font-medium text-red-100">{error}</p>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
          <CheckCircleIcon className="h-6 w-6 text-emerald-300" />
          État du Système
        </h2>

        {loading ? (
          <div className="space-y-4">
            <div className="h-16 rounded-2xl bg-white/10 animate-pulse"></div>
            <div className="h-16 rounded-2xl bg-white/10 animate-pulse"></div>
            <div className="h-16 rounded-2xl bg-white/10 animate-pulse"></div>
            <div className="h-16 rounded-2xl bg-white/10 animate-pulse"></div>
          </div>
        ) : stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pending Accounts */}
            <div className="rounded-2xl border border-sky-400/15 bg-sky-500/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
                Comptes en attente
              </p>
              <p className="text-3xl font-bold text-white">
                {stats.pendingAccounts}
              </p>
              <p className="mt-2 text-xs text-slate-300">Demandes d'hôtes</p>
            </div>

            {/* Pending Vehicles */}
            <div className="rounded-2xl border border-amber-400/15 bg-amber-500/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
                Véhicules en attente
              </p>
              <p className="text-3xl font-bold text-white">
                {stats.pendingVehicles}
              </p>
              <p className="mt-2 text-xs text-slate-300">À approuver</p>
            </div>

            {/* Active Renters */}
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
                Loueurs actifs
              </p>
              <p className="text-3xl font-bold text-white">
                {stats.activeRenters}
              </p>
              <p className="mt-2 text-xs text-slate-300">Utilisateurs approuvés</p>
            </div>

            {/* Site Requests */}
            <div className="rounded-2xl border border-violet-400/15 bg-violet-500/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
                Demandes site
              </p>
              <p className="text-3xl font-bold text-white">
                {stats.siteRequests}
              </p>
              <p className="mt-2 text-xs text-slate-300">Demandes de contact</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Application Info */}
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <h2 className="mb-6 text-xl font-bold text-white">
          Informations de l'Application
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 py-3">
            <p className="font-medium text-slate-300">Nom de l'application</p>
            <p className="font-medium text-white">Locars</p>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 py-3">
            <p className="font-medium text-slate-300">Version</p>
            <p className="font-medium text-white">1.0.0</p>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 py-3">
            <p className="font-medium text-slate-300">Base de données</p>
            <p className="font-medium text-white">Firestore (locars-b5310)</p>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 py-3">
            <p className="font-medium text-slate-300">Environnement</p>
            <p className="font-medium text-white">Production</p>
          </div>

          <div className="flex justify-between items-center py-3">
            <p className="font-medium text-slate-300">État du serveur</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              <p className="font-medium text-emerald-200">En ligne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Firebase Configuration */}
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <h2 className="mb-6 text-xl font-bold text-white">
          Configuration Firebase
        </h2>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
          <p>
            <span className="text-white">projectId:</span> locars-b5310
          </p>
          <p>
            <span className="text-white">authDomain:</span>{" "}
            locars-b5310.firebaseapp.com
          </p>
          <p>
            <span className="text-white">storageBucket:</span>{" "}
            locars-b5310.firebasestorage.app
          </p>
          <p>
            <span className="text-white">databaseURL:</span> Configurée
          </p>
        </div>

        <p className="mt-4 text-xs text-slate-300">
          ✓ Toutes les connexions Firebase sont actives
        </p>
      </div>
    </div>
  );
}
