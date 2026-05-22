"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  CalendarDaysIcon,
  ArrowRightIcon,
  MapPinIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { getReservations } from "@/lib/firebase-utils";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

type Reservation = {
  id: string;
  carId: string;
  carBrand?: string;
  carModel?: string;
  renterName: string;
  renterEmail: string;
  hostName: string;
  startDate: any;
  endDate: any;
  totalPrice: number;
  status: string;
  createdAt: any;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "completed"
  >("all");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const data = await getReservations(db);
        setReservations(data as Reservation[]);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Erreur lors du chargement des réservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Confirmée";
      case "pending":
        return "En attente";
      case "completed":
        return "Complétée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const filteredReservations = reservations.filter((res) => {
    if (filter === "all") return true;
    return res.status?.toLowerCase() === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CalendarDaysIcon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-ink">Réservations</h1>
        </div>
        <p className="text-muted">Consultez et gérez toutes les réservations</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-2 border border-border w-fit flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filter === "all"
              ? "bg-blue-50 text-accent"
              : "text-muted hover:bg-gray-50"
          }`}
        >
          Toutes ({reservations.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filter === "pending"
              ? "bg-blue-50 text-accent"
              : "text-muted hover:bg-gray-50"
          }`}
        >
          En attente (
          {
            reservations.filter((r) => r.status?.toLowerCase() === "pending")
              .length
          }
          )
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filter === "confirmed"
              ? "bg-blue-50 text-accent"
              : "text-muted hover:bg-gray-50"
          }`}
        >
          Confirmées (
          {
            reservations.filter((r) => r.status?.toLowerCase() === "confirmed")
              .length
          }
          )
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filter === "completed"
              ? "bg-blue-50 text-accent"
              : "text-muted hover:bg-gray-50"
          }`}
        >
          Complétées (
          {
            reservations.filter((r) => r.status?.toLowerCase() === "completed")
              .length
          }
          )
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-border animate-pulse h-24"
            ></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReservations.length === 0 && (
        <div className="bg-white rounded-3xl p-12 border border-border text-center">
          <CalendarDaysIcon className="h-12 w-12 text-blue-200 mx-auto mb-4" />
          <p className="text-lg font-semibold text-ink mb-2">
            {filter === "all"
              ? "Aucune réservation"
              : `Aucune réservation ${filter === "pending" ? "en attente" : filter === "confirmed" ? "confirmée" : "complétée"}`}
          </p>
          <p className="text-muted">
            {filter === "all"
              ? "Les réservations apparaîtront ici"
              : "Essayez un autre filtre"}
          </p>
        </div>
      )}

      {/* Reservations List */}
      {!loading && filteredReservations.length > 0 && (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <Link
              key={reservation.id}
              href={`/back-office/reservations/${reservation.id}`}
              className="block"
            >
              <div className="bg-white rounded-3xl border border-border p-6 hover:shadow-md transition-all hover:border-accent cursor-pointer">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-ink text-lg">
                        {reservation.carBrand} {reservation.carModel}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}
                      >
                        {getStatusLabel(reservation.status)}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 text-sm">
                      <div className="flex items-center gap-2 text-muted">
                        <UserIcon className="h-4 w-4" />
                        {reservation.renterName}
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <CalendarDaysIcon className="h-4 w-4" />
                        {formatDate(reservation.startDate)} →{" "}
                        {formatDate(reservation.endDate)}
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <MapPinIcon className="h-4 w-4" />
                        {reservation.hostName}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between gap-4 w-full sm:w-auto sm:flex-col sm:items-end">
                    <div className="text-right">
                      <p className="text-xs text-muted mb-1">Total</p>
                      <p className="text-2xl font-bold text-accent">
                        €{reservation.totalPrice}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && reservations.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-6 border-t border-border">
          <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Total des réservations
            </p>
            <p className="text-3xl font-bold text-accent">
              {reservations.length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-3xl p-6 border border-yellow-200">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              En attente
            </p>
            <p className="text-3xl font-bold text-yellow-600">
              {
                reservations.filter(
                  (r) => r.status?.toLowerCase() === "pending",
                ).length
              }
            </p>
          </div>
          <div className="bg-green-50 rounded-3xl p-6 border border-green-200">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Confirmées
            </p>
            <p className="text-3xl font-bold text-green-600">
              {
                reservations.filter(
                  (r) => r.status?.toLowerCase() === "confirmed",
                ).length
              }
            </p>
          </div>
          <div className="bg-blue-100 rounded-3xl p-6 border border-blue-300">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Revenu Total
            </p>
            <p className="text-3xl font-bold text-blue-600">
              €{reservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
