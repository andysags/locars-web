"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { getHostRequests, updateHostRequestStatus } from "@/lib/firebase-utils";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

type HostRequest = {
  id: string;
  userId: string;
  hostType: "particulier" | "agence";
  email: string;
  firstName?: string;
  lastName?: string;
  agencyName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: any;
};

export default function AdminUsers() {
  const [requests, setRequests] = useState<HostRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const pendingRequests = await getHostRequests(db, "PENDING");
        setRequests(pendingRequests as HostRequest[]);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Erreur lors du chargement des demandes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string, email: string) => {
    if (!confirm("Voulez-vous approuver cette demande ?")) return;

    setActionLoading(requestId);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateHostRequestStatus(db, requestId, "APPROVED");
      setRequests(requests.filter((r) => r.id !== requestId));
      alert("Demande approuvée avec succès !");
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Erreur lors de l'approbation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt("Raison du rejet (optionnel):");
    if (reason === null) return;

    setActionLoading(requestId);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateHostRequestStatus(
        db,
        requestId,
        "REJECTED",
        reason || "Demande rejetée",
      );
      setRequests(requests.filter((r) => r.id !== requestId));
      alert("Demande rejetée avec succès !");
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Erreur lors du rejet");
    } finally {
      setActionLoading(null);
    }
  };

  const getDisplayName = (request: HostRequest) => {
    if (request.hostType === "particulier") {
      return `${request.firstName || ""} ${request.lastName || ""}`.trim();
    }
    return request.agencyName || "";
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">
          Demandes de devenir loueur
        </h1>
        <p className="text-slate-300">Gérez les nouvelles demandes d'inscription</p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <p className="text-slate-300">Chargement des demandes...</p>
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 text-red-200 backdrop-blur-xl">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <p className="text-slate-300">Aucune demande en attente de validation.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="transition-colors hover:bg-white/5"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">
                      {getDisplayName(request)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-300">
                      <EnvelopeIcon className="h-4 w-4" />
                      {request.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-200 ring-1 ring-sky-400/20">
                      {request.hostType === "particulier"
                        ? "Particulier"
                        : "Agence"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {request.createdAt
                      ?.toDate?.()
                      ?.toLocaleDateString("fr-FR") || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id, request.email)}
                        disabled={actionLoading === request.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2 text-emerald-200 ring-1 ring-emerald-400/20 transition hover:bg-emerald-500/20 disabled:opacity-50"
                        title="Approuver"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        <span className="text-xs font-medium">Approuver</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading === request.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-red-200 ring-1 ring-red-400/20 transition hover:bg-red-500/20 disabled:opacity-50"
                        title="Rejeter"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        <span className="text-xs font-medium">Rejeter</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
