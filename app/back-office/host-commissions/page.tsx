"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";
import {
  getHostCommissions,
  recordCommissionPayment,
} from "@/lib/firebase-utils";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

type HostCommission = {
  hostId: string;
  hostName: string;
  email: string;
  totalLocarsCommission: number;
  totalHostEarnings: number;
  totalRevenue: number;
  transactionCount: number;
  completedCount: number;
  pendingCount: number;
  transactions: any[];
  currency: string;
};

export default function HostCommissionsPage() {
  const [commissions, setCommissions] = useState<HostCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const data = await getHostCommissions(db);
        setCommissions(data);
      } catch (err) {
        console.error("Error fetching commissions:", err);
        setError("Erreur lors du chargement des commissions");
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  const handleMarkAsPaid = async (hostId: string, amount: number) => {
    if (
      !confirm(
        `Confirmer le paiement de ${amount.toLocaleString("fr-FR")} FCFA pour ce loueur ?`,
      )
    ) {
      return;
    }

    setActionLoading(hostId);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await recordCommissionPayment(db, hostId, amount, "bank_transfer");

      setCommissions(
        commissions.map((commission) =>
          commission.hostId === hostId
            ? {
                ...commission,
                totalLocarsCommission: 0,
                totalHostEarnings: 0,
                totalRevenue: 0,
              }
            : commission,
        ),
      );
      alert("Paiement enregistré avec succès !");
    } catch (err) {
      console.error("Error recording payment:", err);
      alert("Erreur lors de l'enregistrement du paiement");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-white">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Commissions des Loueurs
          </h1>
          <p className="text-slate-300">Gérez les commissions impayées</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-2 flex items-center gap-3">
          <CurrencyDollarIcon className="h-8 w-8 text-sky-300" />
          <h1 className="text-3xl font-bold text-white">Commissions</h1>
        </div>
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-300" />
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  const totalLocarsCommission = commissions.reduce(
    (acc, commission) => acc + commission.totalLocarsCommission,
    0,
  );

  return (
    <div className="space-y-6 text-white">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <CurrencyDollarIcon className="h-8 w-8 text-sky-300" />
          <h1 className="text-3xl font-bold text-white">
            Commissions des Loueurs
          </h1>
        </div>
        <p className="text-slate-300">
          Gérez et suivez les commissions (données en temps réel de Firestore)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.75rem] border border-emerald-400/15 bg-emerald-500/10 p-6 backdrop-blur-xl">
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
            Commission Locars
          </p>
          <p className="text-3xl font-bold text-white">
            {totalLocarsCommission.toLocaleString("fr-FR")} <span className="text-lg">FCFA</span>
          </p>
          <p className="mt-2 text-xs text-slate-300">
            {commissions.length} loueurs
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-sky-400/15 bg-sky-500/10 p-6 backdrop-blur-xl">
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
            Gains des Loueurs
          </p>
          <p className="text-3xl font-bold text-white">
            {commissions
              .reduce((acc, commission) => acc + commission.totalHostEarnings, 0)
              .toLocaleString("fr-FR")} <span className="text-lg">FCFA</span>
          </p>
          <p className="mt-2 text-xs text-slate-300">Revenu distribué</p>
        </div>

        <div className="rounded-[1.75rem] border border-violet-400/15 bg-violet-500/10 p-6 backdrop-blur-xl">
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
            Total Transactions
          </p>
          <p className="text-3xl font-bold text-white">
            {commissions.reduce((acc, commission) => acc + commission.transactionCount, 0)}
          </p>
          <p className="mt-2 text-xs text-slate-300">
            {commissions.reduce((acc, commission) => acc + commission.completedCount, 0)} complétées
          </p>
        </div>
      </div>

      {commissions.length === 0 && (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
          <CheckCircleIcon className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
          <p className="mb-2 text-lg font-semibold text-white">
            Toutes les commissions sont à jour !
          </p>
          <p className="text-slate-300">Aucune commission impayée</p>
        </div>
      )}

      {commissions.length > 0 && (
        <div className="space-y-4">
          {commissions.map((commission) => (
            <div
              key={commission.hostId}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
            >
              <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    {commission.hostName}
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-slate-300">
                    <EnvelopeIcon className="h-4 w-4" />
                    {commission.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
                    Commission Locars
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {commission.totalLocarsCommission.toLocaleString("fr-FR")} <span className="text-lg">FCFA</span>
                  </p>
                </div>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4">
                  <p className="mb-1 text-xs font-semibold text-slate-300">
                    Commission Locars
                  </p>
                  <p className="text-lg font-bold text-white">
                    {commission.totalLocarsCommission.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-400/15 bg-sky-500/10 p-4">
                  <p className="mb-1 text-xs font-semibold text-slate-300">
                    Gains du Loueur
                  </p>
                  <p className="text-lg font-bold text-white">
                    {commission.totalHostEarnings.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-400/15 bg-amber-500/10 p-4">
                  <p className="mb-1 text-xs font-semibold text-slate-300">
                    Transactions
                  </p>
                  <p className="text-lg font-bold text-white">
                    {commission.completedCount}/{commission.transactionCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-violet-400/15 bg-violet-500/10 p-4">
                  <p className="mb-1 text-xs font-semibold text-slate-300">
                    Revenu Total
                  </p>
                  <p className="text-lg font-bold text-white">
                    {commission.totalRevenue.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              </div>

              {commission.transactions.length > 0 && (
                <div className="mb-6 border-b border-white/10 pb-6">
                  <h4 className="mb-3 font-semibold text-white">
                    Transactions ({commission.transactions.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-300">
                          <th className="py-2 text-left">Commande</th>
                          <th className="py-2 text-right">Commission Locars</th>
                          <th className="py-2 text-right">Gains Loueur</th>
                          <th className="py-2 text-right">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commission.transactions.slice(0, 3).map((transaction, index) => (
                          <tr
                            key={index}
                            className="border-b border-white/10 hover:bg-white/5"
                          >
                            <td className="py-2 font-medium text-white">
                              {transaction.orderId || transaction.id}
                            </td>
                            <td className="py-2 text-right font-semibold text-emerald-300">
                              {transaction.locarsCommission.toLocaleString("fr-FR")} FCFA
                            </td>
                            <td className="py-2 text-right font-semibold text-sky-300">
                              {transaction.hostEarnings.toLocaleString("fr-FR")} FCFA
                            </td>
                            <td className="py-2 text-right">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  transaction.status?.toLowerCase() === "completed"
                                    ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20"
                                    : "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20"
                                }`}
                              >
                                {transaction.status?.toLowerCase() === "completed"
                                  ? "Complétée"
                                  : "En cours"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {commission.transactions.length > 3 && (
                      <p className="mt-2 text-xs text-slate-300">
                        +{commission.transactions.length - 3} autres transactions
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleMarkAsPaid(
                      commission.hostId,
                      commission.totalLocarsCommission,
                    )
                  }
                  disabled={actionLoading === commission.hostId}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-3 font-medium text-emerald-200 ring-1 ring-emerald-400/20 transition hover:bg-emerald-500/20 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Enregistrer le paiement</span>
                  <span className="sm:hidden">Paiement</span>
                </button>
                <button
                  disabled={actionLoading === commission.hostId}
                  className="flex-1 rounded-xl bg-sky-500/15 px-4 py-3 font-medium text-sky-200 ring-1 ring-sky-400/20 transition hover:bg-sky-500/20 disabled:opacity-50"
                >
                  Contacter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <CurrencyEuroIcon className="mt-1 h-6 w-6 flex-shrink-0 text-sky-300" />
          <div>
            <h3 className="mb-2 font-semibold text-white">
              Comment fonctionnent les commissions ?
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              Les commissions sont calculées à <strong>5%</strong> du prix de chaque réservation complétée. Le loueur reçoit 95% de son revenu. Vous pouvez suivre les paiements effectués et les commissions impayées pour chaque propriétaire de véhicule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
