"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  DocumentTextIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
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
  reason?: string;
  createdAt: any;
};

export default function RegistrationRequestsPage() {
  const [requests, setRequests] = useState<HostRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const allRequests = await getHostRequests(db);
        setRequests(allRequests as HostRequest[]);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Erreur lors du chargement des demandes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    if (!confirm("Voulez-vous approuver cette demande d'inscription ?")) return;

    setActionLoading(requestId);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateHostRequestStatus(db, requestId, "APPROVED");
      setRequests(
        requests.map((req) =>
          req.id === requestId ? { ...req, status: "APPROVED" } : req,
        ),
      );
      alert("Demande approuvée avec succès !");
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Erreur lors de l'approbation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt("Raison du rejet:");
    if (!reason || reason.trim() === "") return;

    setActionLoading(requestId);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateHostRequestStatus(db, requestId, "REJECTED", reason);
      setRequests(
        requests.map((req) =>
          req.id === requestId ? { ...req, status: "REJECTED", reason } : req,
        ),
      );
      alert("Demande rejetée avec succès !");
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Erreur lors du rejet");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = requests.filter((req) => req.status === "PENDING");
  const approvedRequests = requests.filter((req) => req.status === "APPROVED");
  const rejectedRequests = requests.filter((req) => req.status === "REJECTED");

  const formatDate = (date: any) => {
    if (!date) return "-";
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const getDisplayName = (req: HostRequest) => {
    if (req.hostType === "agence") {
      return req.agencyName || req.email;
    }
    return `${req.firstName || ""} ${req.lastName || ""}`.trim() || req.email;
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <DocumentTextIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-white">
            Demandes d'Inscription
          </h1>
        </div>
        <p className="text-slate-300">
          Gérez les demandes d'inscription pour créer des comptes Particulier et
          Agence
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0 text-red-300" />
          <p className="text-red-100">{error}</p>
        </div>
      )}

      {/* Pending Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            En attente d'approbation ({pendingRequests.length})
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <CheckCircleIcon className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
            <p className="mb-2 text-lg font-semibold text-white">
              Aucune demande en attente
            </p>
            <p className="text-slate-300">Toutes les demandes ont été traitées !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">
                        {getDisplayName(request)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.hostType === "agence"
                            ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20"
                            : "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/20"
                        }`}
                      >
                        {request.hostType === "agence"
                          ? "Agence"
                          : "Particulier"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                      <div className="flex items-center gap-1">
                        <EnvelopeIcon className="h-4 w-4" />
                        <a
                          href={`mailto:${request.email}`}
                          className="hover:text-white"
                        >
                          {request.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDaysIcon className="h-4 w-4" />
                        {formatDate(request.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={actionLoading === request.id}
                        className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2 font-medium text-emerald-200 ring-1 ring-emerald-400/20 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="hidden sm:inline text-sm">
                        Approuver
                      </span>
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={actionLoading === request.id}
                        className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2 font-medium text-red-200 ring-1 ring-red-400/20 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <XCircleIcon className="h-5 w-5" />
                      <span className="hidden sm:inline text-sm">Rejeter</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Requests Section */}
      {approvedRequests.length > 0 && (
        <div className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-xl font-bold text-white">
            Approuvées ({approvedRequests.length})
          </h2>
          <div className="space-y-3">
            {approvedRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-[1.75rem] border border-emerald-400/15 bg-emerald-500/10 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white">
                        {getDisplayName(request)}
                      </h3>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/20">
                        {request.hostType === "agence"
                          ? "Agence"
                          : "Particulier"}
                      </span>
                    </div>
                    <p className="text-sm text-emerald-100">{request.email}</p>
                  </div>
                  <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Requests Section */}
      {rejectedRequests.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-xl font-bold text-white">
            Rejetées ({rejectedRequests.length})
          </h2>
          <div className="space-y-3">
            {rejectedRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-[1.75rem] border border-red-400/15 bg-red-500/10 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">
                        {getDisplayName(request)}
                      </h3>
                      <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-200 ring-1 ring-red-400/20">
                        {request.hostType === "agence"
                          ? "Agence"
                          : "Particulier"}
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-red-100">{request.email}</p>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-200">
                        Raison du rejet
                      </p>
                      <p className="text-sm text-red-100">{request.reason}</p>
                    </div>
                  </div>
                  <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
