"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  UserIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getReservation, updateReservationStatus } from "@/lib/firebase-utils";

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
  carImage?: string;
  renterName: string;
  renterEmail: string;
  renterPhone?: string;
  hostName: string;
  hostEmail?: string;
  startDate: any;
  endDate: any;
  totalPrice: number;
  status: string;
  notes?: string;
  createdAt: any;
};

export default function ReservationDetailsPage() {
  const params = useParams();
  const reservationId = params.reservationId as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const data = await getReservation(db, reservationId);
        if (data) {
          setReservation(data);
        } else {
          setError("Réservation non trouvée");
        }
      } catch (err) {
        console.error("Error fetching reservation:", err);
        setError("Erreur lors du chargement de la réservation");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!reservation) return;

    if (!confirm(`Changer le statut à "${newStatus}" ?`)) return;

    setActionLoading(true);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateReservationStatus(db, reservation.id, newStatus);
      setReservation({ ...reservation, status: newStatus });
      alert("Statut mis à jour avec succès !");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "-";
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          href="/back-office/reservations"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Retour aux réservations
        </Link>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <p className="text-slate-300">Chargement de la réservation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          href="/back-office/reservations"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Retour aux réservations
        </Link>
        <div className="rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  if (!reservation) return null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/back-office/reservations"
        className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Retour aux réservations
      </Link>

      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">
          {reservation.carBrand} {reservation.carModel}
        </h1>
        <p className="text-slate-300">Réservation ID: {reservation.id}</p>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation Details Card */}
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-bold text-white">
              Détails de la réservation
            </h2>

            <div className="space-y-4">
              {/* Dates */}
              <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                <CalendarDaysIcon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="mb-1 text-sm font-semibold text-slate-300">
                    Période
                  </p>
                  <p className="font-medium text-white">
                    {formatDate(reservation.startDate)} →{" "}
                    {formatDate(reservation.endDate)}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                <CurrencyEuroIcon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="mb-1 text-sm font-semibold text-slate-300">
                    Prix total
                  </p>
                  <p className="text-2xl font-bold text-white">
                    €{reservation.totalPrice}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {reservation.notes && (
                <div className="pb-4 border-b border-white/10">
                  <p className="mb-2 text-sm font-semibold text-slate-300">Notes</p>
                  <p className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                    {reservation.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Renter Info Card */}
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-bold text-white">
              Informations du locataire
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <UserIcon className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-300">Nom</p>
                  <p className="font-semibold text-white">
                    {reservation.renterName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <EnvelopeIcon className="h-5 w-5 text-accent flex-shrink-0" />
                <a
                  href={`mailto:${reservation.renterEmail}`}
                  className="text-accent hover:underline"
                >
                  {reservation.renterEmail}
                </a>
              </div>

              {reservation.renterPhone && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <PhoneIcon className="h-5 w-5 text-accent flex-shrink-0" />
                  <a
                    href={`tel:${reservation.renterPhone}`}
                    className="text-accent hover:underline"
                  >
                    {reservation.renterPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Host Info Card */}
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-bold text-white">
              Informations du propriétaire
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <MapPinIcon className="h-5 w-5 text-sky-300 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-300">Agence/Particulier</p>
                  <p className="font-semibold text-white">
                    {reservation.hostName}
                  </p>
                </div>
              </div>

              {reservation.hostEmail && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <EnvelopeIcon className="h-5 w-5 text-sky-300 flex-shrink-0" />
                  <a
                    href={`mailto:${reservation.hostEmail}`}
                    className="text-sky-300 hover:underline"
                  >
                    {reservation.hostEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-bold text-white">Statut</h2>
            <div className="mb-4">
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  reservation.status,
                )}`}
              >
                {getStatusLabel(reservation.status)}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleStatusChange("pending")}
                disabled={actionLoading}
                className="w-full rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/15 disabled:opacity-50"
              >
                Mettre en attente
              </button>
              <button
                onClick={() => handleStatusChange("confirmed")}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/15 disabled:opacity-50"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Confirmer
              </button>
              <button
                onClick={() => handleStatusChange("completed")}
                disabled={actionLoading}
                className="w-full rounded-xl border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/15 disabled:opacity-50"
              >
                Marquer comme complétée
              </button>
              <button
                onClick={() => handleStatusChange("cancelled")}
                disabled={actionLoading}
                className="w-full rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="rounded-[1.75rem] border border-sky-400/15 bg-sky-500/10 p-6 backdrop-blur-xl">
            <div className="flex items-start gap-3 mb-3">
              <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0 text-sky-300" />
              <h3 className="font-semibold text-white">Information</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Vous pouvez gérer le statut de cette réservation. Contactez le
              locataire ou le propriétaire en cas de problème.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
