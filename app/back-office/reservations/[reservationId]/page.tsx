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
        <div className="bg-white p-8 rounded-3xl border border-border text-center">
          <p className="text-muted">Chargement de la réservation...</p>
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
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl">
          <p className="text-red-700">{error}</p>
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
        <h1 className="text-3xl font-bold text-ink mb-2">
          {reservation.carBrand} {reservation.carModel}
        </h1>
        <p className="text-muted">Réservation ID: {reservation.id}</p>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-6">
              Détails de la réservation
            </h2>

            <div className="space-y-4">
              {/* Dates */}
              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <CalendarDaysIcon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted font-semibold mb-1">
                    Période
                  </p>
                  <p className="text-ink font-medium">
                    {formatDate(reservation.startDate)} →{" "}
                    {formatDate(reservation.endDate)}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <CurrencyEuroIcon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted font-semibold mb-1">
                    Prix total
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    €{reservation.totalPrice}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {reservation.notes && (
                <div className="pb-4 border-b border-border">
                  <p className="text-sm text-muted font-semibold mb-2">Notes</p>
                  <p className="text-ink bg-blue-50 p-3 rounded-2xl">
                    {reservation.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Renter Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-6">
              Informations du locataire
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <UserIcon className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted">Nom</p>
                  <p className="font-semibold text-ink">
                    {reservation.renterName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <EnvelopeIcon className="h-5 w-5 text-accent flex-shrink-0" />
                <a
                  href={`mailto:${reservation.renterEmail}`}
                  className="text-accent hover:underline"
                >
                  {reservation.renterEmail}
                </a>
              </div>

              {reservation.renterPhone && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
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
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-6">
              Informations du propriétaire
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-200">
                <MapPinIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted">Agence/Particulier</p>
                  <p className="font-semibold text-ink">
                    {reservation.hostName}
                  </p>
                </div>
              </div>

              {reservation.hostEmail && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-200">
                  <EnvelopeIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <a
                    href={`mailto:${reservation.hostEmail}`}
                    className="text-purple-600 hover:underline"
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
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-4">Statut</h2>
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
                className="w-full px-4 py-2 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition disabled:opacity-50 font-medium text-sm"
              >
                Mettre en attente
              </button>
              <button
                onClick={() => handleStatusChange("confirmed")}
                disabled={actionLoading}
                className="w-full px-4 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50 font-medium text-sm flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Confirmer
              </button>
              <button
                onClick={() => handleStatusChange("completed")}
                disabled={actionLoading}
                className="w-full px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition disabled:opacity-50 font-medium text-sm"
              >
                Marquer comme complétée
              </button>
              <button
                onClick={() => handleStatusChange("cancelled")}
                disabled={actionLoading}
                className="w-full px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 font-medium text-sm"
              >
                Annuler
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
            <div className="flex items-start gap-3 mb-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <h3 className="font-semibold text-blue-900">Information</h3>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Vous pouvez gérer le statut de cette réservation. Contactez le
              locataire ou le propriétaire en cas de problème.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
