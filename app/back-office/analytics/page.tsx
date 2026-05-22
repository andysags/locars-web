"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartPieIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { getRevenueAnalytics } from "@/lib/firebase-utils";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const data = await getRevenueAnalytics(db);
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Rentabilité</h1>
          <p className="text-muted">Analyse financière et commissions</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-border animate-pulse h-32"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <ChartPieIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-ink">Rentabilité</h1>
        </div>
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ChartPieIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-ink">Rentabilité</h1>
        </div>
        <p className="text-muted">
          Analyse financière en temps réel des transactions (en Francs CFA)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <CurrencyEuroIcon className="h-8 w-8 text-blue-600" />
            <ChartBarIcon className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
            Revenu Total
          </p>
          <p className="text-3xl font-bold text-ink">
            {analytics.totalRevenue.toLocaleString("fr-FR")}{" "}
            <span className="text-lg">FCFA</span>
          </p>
          <p className="text-xs text-blue-600 mt-2">
            {analytics.totalTransactions} transactions
          </p>
        </div>

        {/* Commission (Locars) */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            <ChartPieIcon className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-xs text-green-600 uppercase tracking-wide mb-1">
            Commission Locars
          </p>
          <p className="text-3xl font-bold text-ink">
            {analytics.totalLocarsCommission.toLocaleString("fr-FR")}{" "}
            <span className="text-lg">FCFA</span>
          </p>
          <p className="text-xs text-green-600 mt-2">Profit de Locars</p>
        </div>

        {/* Average Order Value */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <ShoppingCartIcon className="h-8 w-8 text-purple-600" />
            <ChartBarIcon className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-xs text-purple-600 uppercase tracking-wide mb-1">
            Valeur Moyenne
          </p>
          <p className="text-3xl font-bold text-ink">
            {analytics.averageOrderValue.toFixed(0)}{" "}
            <span className="text-lg">FCFA</span>
          </p>
          <p className="text-xs text-purple-600 mt-2">Par transaction</p>
        </div>

        {/* Completed Transactions */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <CheckCircleIcon className="h-8 w-8 text-orange-600" />
            <ChartBarIcon className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-xs text-orange-600 uppercase tracking-wide mb-1">
            Complétées
          </p>
          <p className="text-3xl font-bold text-ink">
            {analytics.completedTransactions}
          </p>
          <p className="text-xs text-orange-600 mt-2">
            {analytics.totalTransactions > 0
              ? (
                  (analytics.completedTransactions /
                    analytics.totalTransactions) *
                  100
                ).toFixed(1)
              : 0}
            % du total
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Pending */}
        <div className="bg-white rounded-3xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            <h3 className="font-semibold text-ink">En attente</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600 mb-2">
            {analytics.pendingTransactions}
          </p>
          <p className="text-sm text-muted">
            Transactions en cours de traitement
          </p>
        </div>

        {/* Host Earnings */}
        <div className="bg-white rounded-3xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <ChartPieIcon className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-ink">Gains des Loueurs</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">
            {analytics.totalHostEarnings.toLocaleString("fr-FR")}{" "}
            <span className="text-lg">FCFA</span>
          </p>
          <p className="text-sm text-muted">Revenu distribué aux loueurs</p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {analytics.monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-border">
          <h2 className="text-xl font-bold text-ink mb-6">
            Revenu Mensuel (en FCFA)
          </h2>

          <div className="space-y-6">
            {analytics.monthlyRevenue.map((item: any, idx: number) => {
              const maxRevenue = Math.max(
                ...analytics.monthlyRevenue.map(
                  (m: any) => m.commission + m.hostEarnings,
                ),
              );
              const percentageTotal =
                ((item.commission + item.hostEarnings) / maxRevenue) * 100;
              const percentageCommission =
                maxRevenue > 0
                  ? (item.commission / (item.commission + item.hostEarnings)) *
                    100
                  : 0;

              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-ink">
                      {item.month}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-muted mb-1">Total</p>
                      <span className="text-sm font-bold text-accent">
                        {(item.commission + item.hostEarnings).toLocaleString(
                          "fr-FR",
                        )}{" "}
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Combined bar */}
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-accent h-full transition-all"
                      style={{ width: `${percentageCommission}%` }}
                      title={`Commission: ${item.commission.toLocaleString("fr-FR")} FCFA`}
                    ></div>
                    <div
                      className="bg-green-500 h-full transition-all"
                      style={{ width: `${100 - percentageCommission}%` }}
                      title={`Host Earnings: ${item.hostEarnings.toLocaleString("fr-FR")} FCFA`}
                    ></div>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="text-muted">
                        Commission: {item.commission.toLocaleString("fr-FR")}{" "}
                        FCFA
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-muted">
                        Loueurs: {item.hostEarnings.toLocaleString("fr-FR")}{" "}
                        FCFA
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Info */}
      <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Comment fonctionne la commission ?
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Les données affichées sont mises à jour en temps réel depuis la
              collection
              <strong> host_transactions</strong> de Firestore. Chaque
              transaction enregistre la commission Locars et les gains des
              loueurs. Les montants sont affichés en Francs CFA (FCFA).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
