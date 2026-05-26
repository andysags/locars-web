"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    } catch (error) {
      console.error("Error fetching contact requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (id: string) => {
    try {
      const ref = doc(db, "contact_messages", id);
      await updateDoc(ref, { status: "REPLIED" });
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: "REPLIED" } : r));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold text-white">Demandes de Contact</h1>
      {loading ? (
        <p className="text-slate-300">Chargement...</p>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-300">Auteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-300">Message</th>
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
                  <td className="px-6 py-4">
                    <p className="line-clamp-3 text-sm text-slate-200">{req.message}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${req.status === 'REPLIED' ? 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20' : 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20'}`}>
                      {req.status === 'REPLIED' ? 'Répondu' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {req.status === 'PENDING' && (
                      <button onClick={() => handleReply(req.id)} className="text-sky-200 hover:text-white">
                        Marquer comme répondu
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-slate-300">Aucune demande de contact.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
