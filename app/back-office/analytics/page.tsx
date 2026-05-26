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

type Tone = "sky" | "emerald" | "violet" | "amber";

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
      <div className="space-y-6 text-white">
        <div>
          <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-300">
            Finance
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Rentabilité
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Analyse financière en temps réel des transactions (en Francs CFA)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 text-white">
        <div className="flex items-center gap-3">
          <ChartPieIcon className="h-8 w-8 text-sky-300" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Rentabilité
            </h1>
            <p className="text-sm text-slate-300">Analyse financière et commissions</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-300" />
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const completionRate =
    analytics.totalTransactions > 0
      ? (analytics.completedTransactions / analytics.totalTransactions) * 100
      : 0;

  const monthlyRevenue = analytics.monthlyRevenue ?? [];
  const maxMonthlyTotal = Math.max(
    1,
    ...monthlyRevenue.map((item: any) => item.commission + item.hostEarnings),
  );

  const kpis: Array<{
    label: string;
    value: string;
    hint: string;
    icon: typeof CurrencyEuroIcon;
    tone: Tone;
  }> = [
    {
      label: "Revenu total",
      value: `${analytics.totalRevenue.toLocaleString("fr-FR")} FCFA`,
      hint: `${analytics.totalTransactions} transactions`,
      icon: CurrencyEuroIcon,
      tone: "sky",
    },
    {
      label: "Commission Locars",
      value: `${analytics.totalLocarsCommission.toLocaleString("fr-FR")} FCFA`,
      hint: "Profit de Locars",
      icon: ArrowTrendingUpIcon,
      tone: "emerald",
    },
    {
      label: "Valeur moyenne",
      value: `${analytics.averageOrderValue.toFixed(0)} FCFA`,
      hint: "Par transaction",
      icon: ShoppingCartIcon,
      tone: "violet",
    },
    {
      label: "Complétées",
      value: `${analytics.completedTransactions}`,
      hint: `${completionRate.toFixed(1)}% du total`,
      icon: CheckCircleIcon,
      tone: "amber",
    },
  ];

  const toneStyles: Record<Tone, { card: string; icon: string; accent: string }> = {
    sky: {
      card: "from-sky-500/18 via-sky-400/12 to-white/[0.04]",
      icon: "text-sky-200 bg-sky-500/15 ring-sky-400/20",
      accent: "text-sky-200",
    },
    emerald: {
      card: "from-emerald-500/18 via-emerald-400/12 to-white/[0.04]",
      icon: "text-emerald-200 bg-emerald-500/15 ring-emerald-400/20",
      accent: "text-emerald-200",
    },
    violet: {
      card: "from-violet-500/18 via-violet-400/12 to-white/[0.04]",
      icon: "text-violet-200 bg-violet-500/15 ring-violet-400/20",
      accent: "text-violet-200",
    },
    amber: {
      card: "from-amber-500/18 via-amber-400/12 to-white/[0.04]",
      icon: "text-amber-200 bg-amber-500/15 ring-amber-400/20",
      accent: "text-amber-200",
    },
  };

  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-300">
          Finance
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Rentabilité
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Analyse financière en temps réel des transactions (en Francs CFA)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const styles = toneStyles[kpi.tone];

          return (
            <article
              key={kpi.label}
              className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${styles.card} p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-2xl p-3 ring-1 ${styles.icon}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <ChartBarIcon className={`h-5 w-5 ${styles.accent}`} />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                {kpi.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {kpi.value}
              </p>
              <p className="mt-2 text-sm text-slate-300">{kpi.hint}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-300" />
            <h2 className="text-lg font-semibold text-white">En attente</h2>
          </div>
          <p className="text-4xl font-semibold tracking-tight text-white">
            {analytics.pendingTransactions}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Transactions en cours de traitement
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3">
            <ChartPieIcon className="h-6 w-6 text-emerald-300" />
            <h2 className="text-lg font-semibold text-white">Gains des Loueurs</h2>
          </div>
          <p className="text-4xl font-semibold tracking-tight text-white">
            {analytics.totalHostEarnings.toLocaleString("fr-FR")} FCFA
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Revenu distribué aux loueurs
          </p>
        </section>
      </div>

      {monthlyRevenue.length > 0 && (
        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Revenu Mensuel</h2>
              <p className="mt-1 text-sm text-slate-300">
                Commission Locars et gains des loueurs par mois
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Total global
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {analytics.totalRevenue.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {monthlyRevenue.map((item: any) => {
              const total = item.commission + item.hostEarnings;
              const commissionWidth = total > 0 ? (item.commission / total) * 100 : 0;
              const totalWidth = (total / maxMonthlyTotal) * 100;

              return (
                <div
                  key={item.month}
                  className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">{item.month}</p>
                      <p className="text-xs text-slate-400">Transaction mensuelle</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Total
                      </p>
                      <p className="mt-1 text-sm font-semibold text-sky-200">
                        {total.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-sky-400 transition-all"
                      style={{ width: `${commissionWidth}%` }}
                    />
                    <div
                      className="h-full bg-emerald-400 transition-all"
                      style={{ width: `${100 - commissionWidth}%` }}
                    />
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-white/20"
                      style={{ width: `${totalWidth}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                      Commission: {item.commission.toLocaleString("fr-FR")} FCFA
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      Loueurs: {item.hostEarnings.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <ArrowTrendingUpIcon className="mt-1 h-6 w-6 flex-shrink-0 text-sky-300" />
          <div>
            <h2 className="mb-2 text-lg font-semibold text-white">
              Comment fonctionne la commission ?
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Les données affichées sont mises à jour en temps réel depuis la collection
              <strong> host_transactions</strong> de Firestore. Chaque transaction enregistre
              la commission Locars et les gains des loueurs. Les montants sont affichés en
              Francs CFA (FCFA).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}