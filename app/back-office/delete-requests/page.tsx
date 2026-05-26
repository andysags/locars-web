"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DeleteRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "delete_requests"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    } catch (error) {
      console.error("Error fetching delete requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (id: string, action: "REPLIED" | "PROCESSED") => {
    try {
      const ref = doc(db, "delete_requests", id);
      await updateDoc(ref, { status: action });
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: action } : r));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold text-white">Demandes de Suppression de Compte</h1>
      {loading ? (
        <p className="text-slate-300">Chargement...</p>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-300">Auteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-300">Contact & Pièce</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-300">Raison</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-300">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-300">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">{req.name}</div>
                    <div className="text-sm text-slate-300">{req.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="mb-1 text-white">{req.phone}</div>
                    {req.documentUrl ? (
                      <a href={req.documentUrl} target="_blank" rel="noopener noreferrer" className="text-sky-200 text-sm hover:underline">
                        Voir la pièce d'identité
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400">Aucun doc</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-3 text-sm text-slate-200">{req.reason || "Aucune raison fournie"}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${req.status === 'PROCESSED' ? 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20' : req.status === 'REPLIED' ? 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/20' : 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20'}`}>
                      {req.status === 'PROCESSED' ? 'Supprimé' : req.status === 'REPLIED' ? 'Répondu' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {req.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleReply(req.id, "REPLIED")} className="text-sky-200 hover:text-white">
                          Répondu
                        </button>
                        <span className="text-slate-500">|</span>
                        <button onClick={() => handleReply(req.id, "PROCESSED")} className="text-red-200 hover:text-white">
                          Supprimer
                        </button>
                      </>
                    )}
                    {req.status === 'REPLIED' && (
                      <button onClick={() => handleReply(req.id, "PROCESSED")} className="text-red-200 hover:text-white">
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-slate-300">Aucune demande de suppression.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
