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
        return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20";
      case "pending":
        return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20";
      case "completed":
        return "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/20";
      case "cancelled":
        return "bg-red-500/15 text-red-200 ring-1 ring-red-400/20";
      default:
        return "bg-white/10 text-slate-200 ring-1 ring-white/10";
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
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CalendarDaysIcon className="h-8 w-8 text-sky-300" />
          <h1 className="text-3xl font-bold text-white">Réservations</h1>
        </div>
        <p className="text-slate-300">Consultez et gérez toutes les réservations</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0 text-red-300" />
          <p className="text-red-100">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex w-fit flex-wrap gap-2 rounded-[1.5rem] border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filter === "all"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          Toutes ({reservations.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filter === "pending"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
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
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
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
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
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
              className="h-24 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReservations.length === 0 && (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
          <CalendarDaysIcon className="mx-auto mb-4 h-12 w-12 text-sky-300" />
          <p className="mb-2 text-lg font-semibold text-white">
            {filter === "all"
              ? "Aucune réservation"
              : `Aucune réservation ${filter === "pending" ? "en attente" : filter === "confirmed" ? "confirmée" : "complétée"}`}
          </p>
          <p className="text-slate-300">
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
              <div className="cursor-pointer rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/8 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
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
                      <div className="flex items-center gap-2 text-slate-300">
                        <UserIcon className="h-4 w-4" />
                        {reservation.renterName}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <CalendarDaysIcon className="h-4 w-4" />
                        {formatDate(reservation.startDate)} →{" "}
                        {formatDate(reservation.endDate)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPinIcon className="h-4 w-4" />
                        {reservation.hostName}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between gap-4 w-full sm:w-auto sm:flex-col sm:items-end">
                    <div className="text-right">
                      <p className="mb-1 text-xs text-slate-300">Total</p>
                      <p className="text-2xl font-bold text-white">
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
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
          <div className="rounded-[1.75rem] border border-sky-400/15 bg-sky-500/10 p-6 backdrop-blur-xl">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
              Total des réservations
            </p>
            <p className="text-3xl font-bold text-white">
              {reservations.length}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-amber-400/15 bg-amber-500/10 p-6 backdrop-blur-xl">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
              En attente
            </p>
            <p className="text-3xl font-bold text-white">
              {
                reservations.filter(
                  (r) => r.status?.toLowerCase() === "pending",
                ).length
              }
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-emerald-400/15 bg-emerald-500/10 p-6 backdrop-blur-xl">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
              Confirmées
            </p>
            <p className="text-3xl font-bold text-white">
              {
                reservations.filter(
                  (r) => r.status?.toLowerCase() === "confirmed",
                ).length
              }
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-violet-400/15 bg-violet-500/10 p-6 backdrop-blur-xl">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-300">
              Revenu Total
            </p>
            <p className="text-3xl font-bold text-white">
              €{reservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
