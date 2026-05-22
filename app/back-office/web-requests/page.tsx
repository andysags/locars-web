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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <DocumentTextIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-ink">
            Demandes d'Inscription
          </h1>
        </div>
        <p className="text-muted">
          Gérez les demandes d'inscription pour créer des comptes Particulier et
          Agence
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Pending Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">
            En attente d'approbation ({pendingRequests.length})
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-border animate-pulse h-20"
              ></div>
            ))}
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-border text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-200 mx-auto mb-4" />
            <p className="text-lg font-semibold text-ink mb-2">
              Aucune demande en attente
            </p>
            <p className="text-muted">Toutes les demandes ont été traitées !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-3xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-ink">
                        {getDisplayName(request)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.hostType === "agence"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {request.hostType === "agence"
                          ? "Agence"
                          : "Particulier"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted">
                      <div className="flex items-center gap-1">
                        <EnvelopeIcon className="h-4 w-4" />
                        <a
                          href={`mailto:${request.email}`}
                          className="hover:text-accent"
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
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50 font-medium"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="hidden sm:inline text-sm">
                        Approuver
                      </span>
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={actionLoading === request.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 font-medium"
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
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-xl font-bold text-ink">
            Approuvées ({approvedRequests.length})
          </h2>
          <div className="space-y-3">
            {approvedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-green-50 rounded-3xl border border-green-200 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-ink">
                        {getDisplayName(request)}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {request.hostType === "agence"
                          ? "Agence"
                          : "Particulier"}
                      </span>
                    </div>
                    <p className="text-sm text-green-700">{request.email}</p>
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
          <h2 className="text-xl font-bold text-ink">
            Rejetées ({rejectedRequests.length})
          </h2>
          <div className="space-y-3">
            {rejectedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-red-50 rounded-3xl border border-red-200 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-ink">
                        {getDisplayName(request)}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {request.hostType === "agence"
                          ? "Agence"
                          : "Particulier"}
                      </span>
                    </div>
                    <p className="text-sm text-red-600 mb-3">{request.email}</p>
                    <div className="bg-white rounded-2xl p-3 border border-red-100">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
                        Raison du rejet
                      </p>
                      <p className="text-sm text-red-700">{request.reason}</p>
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
