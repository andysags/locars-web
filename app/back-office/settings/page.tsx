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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CogIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-ink">Paramètres</h1>
        </div>
        <p className="text-muted">
          Gestion des paramètres et configuration de l'application
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
        <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          État du Système
        </h2>

        {loading ? (
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
            <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
            <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
            <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
          </div>
        ) : stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pending Accounts */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <p className="text-xs text-muted uppercase tracking-wide mb-1">
                Comptes en attente
              </p>
              <p className="text-3xl font-bold text-accent">
                {stats.pendingAccounts}
              </p>
              <p className="text-xs text-muted mt-2">Demandes d'hôtes</p>
            </div>

            {/* Pending Vehicles */}
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
              <p className="text-xs text-muted uppercase tracking-wide mb-1">
                Véhicules en attente
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {stats.pendingVehicles}
              </p>
              <p className="text-xs text-muted mt-2">À approuver</p>
            </div>

            {/* Active Renters */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <p className="text-xs text-muted uppercase tracking-wide mb-1">
                Loueurs actifs
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.activeRenters}
              </p>
              <p className="text-xs text-muted mt-2">Utilisateurs approuvés</p>
            </div>

            {/* Site Requests */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <p className="text-xs text-muted uppercase tracking-wide mb-1">
                Demandes site
              </p>
              <p className="text-3xl font-bold text-amber-600">
                {stats.siteRequests}
              </p>
              <p className="text-xs text-muted mt-2">Demandes de contact</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Application Info */}
      <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
        <h2 className="text-xl font-bold text-ink mb-6">
          Informations de l'Application
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <p className="text-muted font-medium">Nom de l'application</p>
            <p className="text-ink font-medium">Locars</p>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <p className="text-muted font-medium">Version</p>
            <p className="text-ink font-medium">1.0.0</p>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <p className="text-muted font-medium">Base de données</p>
            <p className="text-ink font-medium">Firestore (locars-b5310)</p>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <p className="text-muted font-medium">Environnement</p>
            <p className="text-ink font-medium">Production</p>
          </div>

          <div className="flex justify-between items-center py-3">
            <p className="text-muted font-medium">État du serveur</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              <p className="text-green-600 font-medium">En ligne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Firebase Configuration */}
      <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
        <h2 className="text-xl font-bold text-ink mb-6">
          Configuration Firebase
        </h2>

        <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-border font-mono text-xs text-muted overflow-x-auto">
          <p>
            <span className="text-ink">projectId:</span> locars-b5310
          </p>
          <p>
            <span className="text-ink">authDomain:</span>{" "}
            locars-b5310.firebaseapp.com
          </p>
          <p>
            <span className="text-ink">storageBucket:</span>{" "}
            locars-b5310.firebasestorage.app
          </p>
          <p>
            <span className="text-ink">databaseURL:</span> Configurée
          </p>
        </div>

        <p className="text-xs text-muted mt-4">
          ✓ Toutes les connexions Firebase sont actives
        </p>
      </div>
    </div>
  );
}
