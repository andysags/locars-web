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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">
          Demandes de devenir loueur
        </h1>
        <p className="text-muted">Gérez les nouvelles demandes d'inscription</p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white p-8 rounded-3xl border border-border text-center">
          <p className="text-muted">Chargement des demandes...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-red-700">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-border text-center">
          <p className="text-muted">Aucune demande en attente de validation.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-blue-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-ink">
                      {getDisplayName(request)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-muted">
                      <EnvelopeIcon className="h-4 w-4" />
                      {request.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {request.hostType === "particulier"
                        ? "Particulier"
                        : "Agence"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {request.createdAt
                      ?.toDate?.()
                      ?.toLocaleDateString("fr-FR") || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id, request.email)}
                        disabled={actionLoading === request.id}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                        title="Approuver"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        <span className="text-xs font-medium">Approuver</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading === request.id}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
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
