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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Demandes de Suppression de Compte</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact & Pièce</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raison</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{req.name}</div>
                    <div className="text-gray-500 text-sm">{req.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 mb-1">{req.phone}</div>
                    {req.documentUrl ? (
                      <a href={req.documentUrl} target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline">
                        Voir la pièce d'identité
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">Aucun doc</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 line-clamp-3">{req.reason || "Aucune raison fournie"}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${req.status === 'PROCESSED' ? 'bg-green-100 text-green-800' : req.status === 'REPLIED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {req.status === 'PROCESSED' ? 'Supprimé' : req.status === 'REPLIED' ? 'Répondu' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {req.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleReply(req.id, "REPLIED")} className="text-indigo-600 hover:text-indigo-900">
                          Répondu
                        </button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleReply(req.id, "PROCESSED")} className="text-red-600 hover:text-red-900">
                          Supprimer
                        </button>
                      </>
                    )}
                    {req.status === 'REPLIED' && (
                      <button onClick={() => handleReply(req.id, "PROCESSED")} className="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Aucune demande de suppression.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
