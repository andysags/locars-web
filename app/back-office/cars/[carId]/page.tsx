"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  SparklesIcon,
  BoltIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

interface CarDetails {
  id: string;
  brand: string;
  model: string;
  year?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  pricePerDay?: number;
  rating?: number;
  reviews?: number;
  ownerId: string;
  isApproved?: boolean;
  description?: string;
  imageUrls?: string[];
  options?: string[];
  licensePlate?: string;
  mileage?: number;
  location?: string;
  createdAt?: any;
}

export default function CarDetailsPage() {
  const params = useParams();
  const carId = params.carId as string;

  const [car, setCar] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const carDoc = await getDoc(doc(db, "cars", carId));

        if (carDoc.exists()) {
          setCar({ id: carDoc.id, ...carDoc.data() } as CarDetails);
        } else {
          setError("Véhicule non trouvé");
        }
      } catch (err) {
        console.error("Error fetching car:", err);
        setError("Erreur lors du chargement du véhicule");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const handleApprove = async () => {
    if (!car) return;
    setActionLoading(true);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateDoc(doc(db, "cars", car.id), { isApproved: true });
      setCar({ ...car, isApproved: true });
    } catch (err) {
      console.error("Error approving car:", err);
      setError("Erreur lors de l'approbation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!car) return;
    setActionLoading(true);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateDoc(doc(db, "cars", car.id), { isApproved: false });
      setCar({ ...car, isApproved: false });
    } catch (err) {
      console.error("Error rejecting car:", err);
      setError("Erreur lors du rejet");
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (value?: number) => {
    if (typeof value !== "number") return "N/A";
    return `${value.toLocaleString("fr-FR")} FCFA`;
  };

  const statusLabel = car?.isApproved ? "Approuvé" : "En attente";
  const statusClass = car?.isApproved
    ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20"
    : "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20";

  if (loading) {
    return (
      <div className="space-y-6 text-white">
        <Link
          href="/back-office/cars"
          className="inline-flex items-center gap-2 text-sky-300 transition hover:text-sky-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Retour aux véhicules
        </Link>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <p className="text-slate-300">Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 text-white">
        <Link
          href="/back-office/cars"
          className="inline-flex items-center gap-2 text-sky-300 transition hover:text-sky-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Retour aux véhicules
        </Link>
        <div className="rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="space-y-6 text-white">
      <Link
        href="/back-office/cars"
        className="inline-flex items-center gap-2 text-sky-300 transition hover:text-sky-200"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Retour aux véhicules
      </Link>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.03] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_30%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-300">
              Véhicule
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {car.brand} {car.model}
            </h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Détails et gestion du véhicule ID: {car.id}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}>
              {statusLabel}
            </span>
            {typeof car.pricePerDay === "number" && (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sky-200">
                {formatPrice(car.pricePerDay)} / jour
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Informations générales
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Marque", car.brand],
                ["Modèle", car.model],
                ["Année", car.year || "N/A"],
                ["Plaque d'immatriculation", car.licensePlate || "N/A"],
                ["Kilométrage", car.mileage ? `${car.mileage} km` : "N/A"],
                ["Localisation", car.location || "N/A"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-semibold text-white">Spécifications</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: UserIcon, label: "Passagers", value: car.seats || "-" },
                { icon: BoltIcon, label: "Transmission", value: car.transmission || "-" },
                { icon: TruckIcon, label: "Carburant", value: car.fuelType || "-" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-sky-300" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {car.description && (
            <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <h2 className="mb-5 text-xl font-semibold text-white">Description</h2>
              <p className="whitespace-pre-line leading-relaxed text-slate-300">
                {car.description}
              </p>
            </section>
          )}

          {car.options && car.options.length > 0 && (
            <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <h2 className="mb-5 text-xl font-semibold text-white">Options</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {car.options.map((option, index) => (
                  <div
                    key={`${option}-${index}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-emerald-300" />
                    <span className="text-sm text-slate-200">{option}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-semibold text-white">Évaluation</h2>
            <div className="flex items-end gap-3">
              <SparklesIcon className="mb-1 h-6 w-6 text-amber-300" />
              <span className="text-4xl font-semibold tracking-tight text-white">
                {car.rating?.toFixed(1) || "N/A"}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{car.reviews || 0} avis</p>
          </section>

          {car.pricePerDay && (
            <section className="rounded-[1.75rem] border border-sky-400/15 bg-gradient-to-br from-sky-500/15 via-sky-400/10 to-emerald-500/10 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <h2 className="mb-5 text-xl font-semibold text-white">Prix</h2>
              <p className="text-4xl font-semibold tracking-tight text-white">
                {formatPrice(car.pricePerDay)}
              </p>
              <p className="mt-2 text-sm text-slate-300">par jour</p>
            </section>
          )}

          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-semibold text-white">Statut</h2>
            <div className="mb-4">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}>
                {statusLabel}
              </span>
            </div>

            <div className="space-y-3">
              {!car.isApproved ? (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/15 px-4 py-3 font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Approuver
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 font-medium text-red-200 transition hover:bg-red-500/15 disabled:opacity-50"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Rejeter
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/15 px-4 py-3 text-emerald-200">
                  <CheckCircleIcon className="h-5 w-5" />
                  Approuvé
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-semibold text-white">Propriétaire</h2>
            <p className="break-all text-sm leading-relaxed text-slate-300">
              {car.ownerId}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}