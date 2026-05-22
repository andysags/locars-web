"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  StarIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
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
        <span className="ml-1 font-semibold text-ink">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <StarIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-ink">Revues & Évaluations</h1>
        </div>
        <p className="text-muted">
          Gérez les revues laissées par les clients après leur location
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-border animate-pulse h-32"
            ></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && (
        <div className="bg-white rounded-3xl p-12 border border-border text-center">
          <StarIcon className="h-12 w-12 text-blue-200 mx-auto mb-4" />
          <p className="text-lg font-semibold text-ink mb-2">
            Aucune revue disponible
          </p>
          <p className="text-muted">Les revues apparaîtront ici</p>
        </div>
      )}

      {/* Reviews List */}
      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-6 gap-4 p-6 border-b border-border bg-gray-50 font-semibold text-ink text-sm">
              <div>Message</div>
              <div className="text-center">Note</div>
              <div>De (Client)</div>
              <div>Pour (Véhicule)</div>
              <div>Date</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 hover:bg-blue-50 transition-colors space-y-3 lg:space-y-0"
                >
                  {/* Mobile/Responsive View */}
                  <div className="lg:hidden space-y-4">
                    {/* Message */}
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">
                        Message
                      </p>
                      <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                        <p className="text-ink text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
                          Note
                        </p>
                        <div>{renderStars(review.rating)}</div>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
                          Date
                        </p>
                        <p className="text-sm text-ink font-medium">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* From/For */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
                          De (Client)
                        </p>
                        <p className="text-sm text-ink font-medium">
                          {review.renterName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
                          Pour (Véhicule)
                        </p>
                        <p className="text-sm text-ink font-medium">
                          {review.carBrand} {review.carModel}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-border">
                      <button
                        onClick={() => handleSendWarning(review.id, review)}
                        disabled={
                          actionLoading === review.id || review.hasWarning
                        }
                        title={
                          review.hasWarning ? "Avertissement déjà envoyé" : ""
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition disabled:opacity-50 font-medium text-sm"
                      >
                        <BellAlertIcon className="h-4 w-4" />
                        {review.hasWarning ? "Averti" : "Avertir"}
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={actionLoading === review.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 font-medium text-sm"
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
                      <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 max-h-20 overflow-hidden">
                        <p className="text-ink text-xs leading-relaxed line-clamp-3">
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
                      <p className="text-sm font-bold text-ink mt-1">
                        {review.rating}/5
                      </p>
                    </div>

                    {/* From (Renter) */}
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {review.renterName}
                      </p>
                      {review.renterEmail && (
                        <p className="text-xs text-muted truncate">
                          {review.renterEmail}
                        </p>
                      )}
                    </div>

                    {/* For (Vehicle/Host) */}
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {review.carBrand} {review.carModel}
                      </p>
                      {review.hostName && (
                        <p className="text-xs text-muted">{review.hostName}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm text-ink font-medium">
                        {formatDate(review.createdAt)}
                      </p>
                      {review.hasWarning && (
                        <p className="text-xs text-yellow-600 font-semibold mt-1">
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
                        className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition disabled:opacity-50"
                      >
                        <BellAlertIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={actionLoading === review.id}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-6 border-t border-border">
          <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Total des revues
            </p>
            <p className="text-3xl font-bold text-accent">{reviews.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-3xl p-6 border border-yellow-200">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Moyenne
            </p>
            <p className="text-3xl font-bold text-yellow-600">
              {(
                reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              ).toFixed(1)}
              /5
            </p>
          </div>
          <div className="bg-green-50 rounded-3xl p-6 border border-green-200">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              5 étoiles
            </p>
            <p className="text-3xl font-bold text-green-600">
              {reviews.filter((r) => r.rating === 5).length}
            </p>
          </div>
          <div className="bg-orange-50 rounded-3xl p-6 border border-orange-200">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              1-4 étoiles
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {reviews.filter((r) => r.rating < 5).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
