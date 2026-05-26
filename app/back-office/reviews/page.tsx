"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  StarIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import {
  getReviews,
  deleteReview,
  updateReview,
  sendReviewWarning,
} from "@/lib/firebase-utils";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

type Review = {
  id: string;
  carId: string;
  carBrand?: string;
  carModel?: string;
  renterName: string;
  renterEmail?: string;
  hostId?: string;
  hostName?: string;
  rating: number;
  comment: string;
  createdAt: any;
  isDeleted?: boolean;
  hasWarning?: boolean;
  warningDate?: any;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const data = await getReviews(db);
        setReviews(data.filter((r: any) => !r.isDeleted) as Review[]);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Erreur lors du chargement des revues");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette revue ?")) return;

    setActionLoading(id);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await deleteReview(db, id);
      setReviews(reviews.filter((r) => r.id !== id));
      alert("Revue supprimée avec succès !");
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendWarning = async (id: string, review: Review) => {
    const reason = prompt("Raison de l'avertissement:");
    if (!reason) return;

    setActionLoading(id);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await sendReviewWarning(
        db,
        id,
        review.renterName,
        "", // email could be fetched from user data if needed
        reason,
      );
      setReviews(
        reviews.map((r) => (r.id === id ? { ...r, hasWarning: true } : r)),
      );
      alert("Avertissement envoyé avec succès !");
    } catch (err) {
      console.error("Error sending warning:", err);
      alert("Erreur lors de l'envoi de l'avertissement");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "-";
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 font-semibold text-white">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <StarIcon className="h-8 w-8 text-sky-300" />
          <h1 className="text-3xl font-bold text-white">Revues & Évaluations</h1>
        </div>
        <p className="text-slate-300">
          Gérez les revues laissées par les clients après leur location
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0 text-red-300" />
          <p className="text-red-100">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
          <StarIcon className="mx-auto mb-4 h-12 w-12 text-sky-300" />
          <p className="mb-2 text-lg font-semibold text-white">
            Aucune revue disponible
          </p>
          <p className="text-slate-300">Les revues apparaîtront ici</p>
        </div>
      )}

      {/* Reviews List */}
      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-6 gap-4 border-b border-white/10 bg-white/5 p-6 text-sm font-semibold text-slate-300">
              <div>Message</div>
              <div className="text-center">Note</div>
              <div>De (Client)</div>
              <div>Pour (Véhicule)</div>
              <div>Date</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/10">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="space-y-3 p-6 transition-colors hover:bg-white/5 lg:space-y-0"
                >
                  {/* Mobile/Responsive View */}
                  <div className="lg:hidden space-y-4">
                    {/* Message */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                        Message
                      </p>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-sm leading-relaxed text-white">
                          {review.comment}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                          Note
                        </p>
                        <div>{renderStars(review.rating)}</div>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                          Date
                        </p>
                        <p className="text-sm font-medium text-white">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* From/For */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                          De (Client)
                        </p>
                        <p className="text-sm font-medium text-white">
                          {review.renterName}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                          Pour (Véhicule)
                        </p>
                        <p className="text-sm font-medium text-white">
                          {review.carBrand} {review.carModel}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleSendWarning(review.id, review)}
                        disabled={
                          actionLoading === review.id || review.hasWarning
                        }
                        title={
                          review.hasWarning ? "Avertissement déjà envoyé" : ""
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500/15 px-3 py-2 text-sm font-medium text-yellow-200 ring-1 ring-yellow-400/20 transition hover:bg-yellow-500/20 disabled:opacity-50"
                      >
                        <BellAlertIcon className="h-4 w-4" />
                        {review.hasWarning ? "Averti" : "Avertir"}
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={actionLoading === review.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-sm font-medium text-red-200 ring-1 ring-red-400/20 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:grid grid-cols-6 gap-4 items-start">
                    {/* Message */}
                    <div>
                      <div className="max-h-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs leading-relaxed text-white line-clamp-3">
                          {review.comment}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="text-center">
                      <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm font-bold text-white">
                        {review.rating}/5
                      </p>
                    </div>

                    {/* From (Renter) */}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {review.renterName}
                      </p>
                      {review.renterEmail && (
                        <p className="truncate text-xs text-slate-300">
                          {review.renterEmail}
                        </p>
                      )}
                    </div>

                    {/* For (Vehicle/Host) */}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {review.carBrand} {review.carModel}
                      </p>
                      {review.hostName && (
                        <p className="text-xs text-slate-300">{review.hostName}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {formatDate(review.createdAt)}
                      </p>
                      {review.hasWarning && (
                        <p className="mt-1 text-xs font-semibold text-yellow-300">
                          ⚠ Averti
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleSendWarning(review.id, review)}
                        disabled={
                          actionLoading === review.id || review.hasWarning
                        }
                        title={
                          review.hasWarning ? "Avertissement déjà envoyé" : ""
                        }
                        className="rounded-lg bg-yellow-500/15 p-2 text-yellow-200 ring-1 ring-yellow-400/20 transition hover:bg-yellow-500/20 disabled:opacity-50"
                      >
                        <BellAlertIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={actionLoading === review.id}
                        className="rounded-lg bg-red-500/15 p-2 text-red-200 ring-1 ring-red-400/20 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && reviews.length > 0 && (
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
          <div className="rounded-[1.75rem] border border-sky-400/15 bg-sky-500/10 p-6 backdrop-blur-xl">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
              Total des revues
            </p>
            <p className="text-3xl font-bold text-white">{reviews.length}</p>
          </div>
          <div className="rounded-[1.75rem] border border-amber-400/15 bg-amber-500/10 p-6 backdrop-blur-xl">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
              Moyenne
            </p>
            <p className="text-3xl font-bold text-white">
              {(
                reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              ).toFixed(1)}
              /5
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-emerald-400/15 bg-emerald-500/10 p-6 backdrop-blur-xl">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
              5 étoiles
            </p>
            <p className="text-3xl font-bold text-white">
              {reviews.filter((r) => r.rating === 5).length}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-orange-400/15 bg-orange-500/10 p-6 backdrop-blur-xl">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
              1-4 étoiles
            </p>
            <p className="text-3xl font-bold text-white">
              {reviews.filter((r) => r.rating < 5).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
