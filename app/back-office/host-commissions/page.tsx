"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
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
        // Show all hosts, not just unpaid ones (since we use real Firestore data)
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
    )
      return;

    setActionLoading(hostId);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await recordCommissionPayment(db, hostId, amount, "bank_transfer");

      setCommissions(
        commissions.map((c) =>
          c.hostId === hostId
            ? {
                ...c,
                totalLocarsCommission: 0,
                totalHostEarnings: 0,
                totalRevenue: 0,
              }
            : c,
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Commissions des Loueurs
          </h1>
          <p className="text-muted">Gérez les commissions impayées</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-border animate-pulse h-24"
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
          <CurrencyDollarIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-ink">Commissions</h1>
        </div>
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const totalLocarsCommission = commissions.reduce(
    (acc, c) => acc + c.totalLocarsCommission,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CurrencyDollarIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-ink">
            Commissions des Loueurs
          </h1>
        </div>
        <p className="text-muted">
          Gérez et suivez les commissions (données en temps réel de Firestore)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 border border-green-200">
          <p className="text-xs text-green-600 uppercase tracking-wide mb-1">
            Commission Locars
          </p>
          <p className="text-3xl font-bold text-ink">
            {totalLocarsCommission.toLocaleString("fr-FR")}{" "}
            <span className="text-lg">FCFA</span>
          </p>
          <p className="text-xs text-green-600 mt-2">
            {commissions.length} loueurs
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200">
          <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
            Gains des Loueurs
          </p>
          <p className="text-3xl font-bold text-ink">
            {commissions
              .reduce((acc, c) => acc + c.totalHostEarnings, 0)
              .toLocaleString("fr-FR")}{" "}
            <span className="text-lg">FCFA</span>
          </p>
          <p className="text-xs text-blue-600 mt-2">Revenu distribué</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200">
          <p className="text-xs text-purple-600 uppercase tracking-wide mb-1">
            Total Transactions
          </p>
          <p className="text-3xl font-bold text-ink">
            {commissions.reduce((acc, c) => acc + c.transactionCount, 0)}
          </p>
          <p className="text-xs text-purple-600 mt-2">
            {commissions.reduce((acc, c) => acc + c.completedCount, 0)}{" "}
            complétées
          </p>
        </div>
      </div>

      {/* Empty State */}
      {commissions.length === 0 && (
        <div className="bg-white rounded-3xl p-12 border border-border text-center">
          <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-ink mb-2">
            Toutes les commissions sont à jour !
          </p>
          <p className="text-muted">Aucune commission impayée</p>
        </div>
      )}

      {/* Commissions List */}
      {commissions.length > 0 && (
        <div className="space-y-4">
          {commissions.map((commission) => (
            <div
              key={commission.hostId}
              className="bg-white rounded-3xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex-1">
                  <h3 className="font-semibold text-ink text-lg mb-1">
                    {commission.hostName}
                  </h3>
                  <p className="text-sm text-muted flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    {commission.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">
                    Commission Locars
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {commission.totalLocarsCommission.toLocaleString("fr-FR")}{" "}
                    <span className="text-lg">FCFA</span>
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-4 mb-6">
                <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                  <p className="text-xs text-green-600 font-semibold mb-1">
                    Commission Locars
                  </p>
                  <p className="text-lg font-bold text-ink">
                    {commission.totalLocarsCommission.toLocaleString("fr-FR")}{" "}
                    FCFA
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">
                    Gains du Loueur
                  </p>
                  <p className="text-lg font-bold text-ink">
                    {commission.totalHostEarnings.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
                  <p className="text-xs text-yellow-600 font-semibold mb-1">
                    Transactions
                  </p>
                  <p className="text-lg font-bold text-ink">
                    {commission.completedCount}/{commission.transactionCount}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">
                    Revenu Total
                  </p>
                  <p className="text-lg font-bold text-ink">
                    {commission.totalRevenue.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              </div>

              {/* Transactions Table */}
              {commission.transactions.length > 0 && (
                <div className="mb-6 pb-6 border-b border-border">
                  <h4 className="font-semibold text-ink mb-3">
                    Transactions ({commission.transactions.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted">
                          <th className="text-left py-2">Commande</th>
                          <th className="text-right py-2">Commission Locars</th>
                          <th className="text-right py-2">Gains Loueur</th>
                          <th className="text-right py-2">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commission.transactions.slice(0, 3).map((trx, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-border hover:bg-blue-50"
                          >
                            <td className="py-2 font-medium text-ink">
                              {trx.orderId || trx.id}
                            </td>
                            <td className="py-2 text-right font-semibold text-green-600">
                              {trx.locarsCommission.toLocaleString("fr-FR")}{" "}
                              FCFA
                            </td>
                            <td className="py-2 text-right font-semibold text-blue-600">
                              {trx.hostEarnings.toLocaleString("fr-FR")} FCFA
                            </td>
                            <td className="py-2 text-right">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  trx.status?.toLowerCase() === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {trx.status?.toLowerCase() === "completed"
                                  ? "Complétée"
                                  : "En cours"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {commission.transactions.length > 3 && (
                      <p className="text-xs text-muted mt-2">
                        +{commission.transactions.length - 3} autres
                        transactions
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleMarkAsPaid(
                      commission.hostId,
                      commission.totalLocarsCommission,
                    )
                  }
                  disabled={actionLoading === commission.hostId}
                  className="flex-1 px-4 py-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">
                    Enregistrer le paiement
                  </span>
                  <span className="sm:hidden">Paiement</span>
                </button>
                <button
                  disabled={actionLoading === commission.hostId}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition disabled:opacity-50 font-medium"
                >
                  Contacter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <CurrencyEuroIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Comment fonctionnent les commissions ?
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Les commissions sont calculées à <strong>5%</strong> du prix de
              chaque réservation complétée. Le loueur reçoit 95% de son revenu.
              Vous pouvez suivre les paiements effectués et les commissions
              impayées pour chaque propriétaire de véhicule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
