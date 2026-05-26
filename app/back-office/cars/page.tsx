"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  TruckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { getAllCars, updateCarStatus } from "@/lib/firebase-utils";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

type Car = {
  id: string;
  brand: string;
  model: string;
  transmission?: string;
  fuelType?: string;
  ownerId: string;
  isApproved?: boolean;
  rating?: number;
  reviews?: number;
  createdAt?: any;
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const allCars = await getAllCars(db);
        setCars(allCars as Car[]);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Erreur lors du chargement des véhicules");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleApprove = async (carId: string) => {
    if (!confirm("Voulez-vous approuver ce véhicule ?")) return;

    setActionLoading(carId);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateCarStatus(db, carId, true);
      setCars(
        cars.map((c) => (c.id === carId ? { ...c, isApproved: true } : c)),
      );
      alert("Véhicule approuvé avec succès !");
    } catch (err) {
      console.error("Error approving car:", err);
      alert("Erreur lors de l'approbation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (carId: string) => {
    if (!confirm("Voulez-vous rejeter ce véhicule ?")) return;

    setActionLoading(carId);
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await updateCarStatus(db, carId, false);
      setCars(cars.filter((c) => c.id !== carId));
      alert("Véhicule rejeté avec succès !");
    } catch (err) {
      console.error("Error rejecting car:", err);
      alert("Erreur lors du rejet");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCars = cars.filter((car) => {
    if (filter === "pending") return car.isApproved === false;
    if (filter === "approved") return car.isApproved === true;
    return true;
  });

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Gestion des véhicules
        </h1>
        <p className="text-slate-300">
          Validez et gérez les véhicules listés sur la plateforme
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex w-fit flex-wrap gap-2 rounded-[1.5rem] border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
        {(["all", "pending", "approved"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-2xl font-medium transition ${
              filter === status
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            {status === "all" && "Tous"}
            {status === "pending" && "En attente"}
            {status === "approved" && "Approuvés"}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <p className="text-slate-300">Chargement des véhicules...</p>
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-red-400/20 bg-red-500/10 p-6 text-red-200 backdrop-blur-xl">
          {error}
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <TruckIcon className="mx-auto mb-4 h-12 w-12 text-slate-400 opacity-50" />
          <p className="text-slate-300">Aucun véhicule trouvé avec ce filtre.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Marque & Modèle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Transmission
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Carburant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Évaluation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredCars.map((car) => (
                <tr
                  key={car.id}
                  className="group cursor-pointer transition-colors hover:bg-white/5"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/back-office/cars/${car.id}`}
                      className="flex items-center gap-2 transition group-hover:text-white"
                    >
                      <div>
                        <div className="font-medium text-white">{car.brand}</div>
                        <div className="text-sm text-slate-300">{car.model}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {car.transmission || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {car.fuelType || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1">
                      <SparklesIcon className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-white">
                        {car.rating?.toFixed(1) || "-"}
                      </span>
                      <span className="text-slate-300">({car.reviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        car.isApproved
                          ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20"
                          : "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20"
                      }`}
                    >
                      {car.isApproved ? "Approuvé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        href={`/back-office/cars/${car.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sky-200 ring-1 ring-white/10 transition hover:bg-white/10"
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">Détails</span>
                      </Link>
                      {!car.isApproved && (
                        <>
                          <button
                            onClick={() => handleApprove(car.id)}
                            disabled={actionLoading === car.id}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2 text-emerald-200 ring-1 ring-emerald-400/20 transition hover:bg-emerald-500/20 disabled:opacity-50"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="text-xs font-medium">
                              Approuver
                            </span>
                          </button>
                          <button
                            onClick={() => handleReject(car.id)}
                            disabled={actionLoading === car.id}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-red-200 ring-1 ring-red-400/20 transition hover:bg-red-500/20 disabled:opacity-50"
                          >
                            <XCircleIcon className="h-5 w-5" />
                            <span className="text-xs font-medium">Rejeter</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
