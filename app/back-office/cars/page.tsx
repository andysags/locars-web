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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">
          Gestion des véhicules
        </h1>
        <p className="text-muted">
          Validez et gérez les véhicules listés sur la plateforme
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white rounded-3xl p-1 border border-border">
        {(["all", "pending", "approved"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-2xl font-medium transition ${
              filter === status
                ? "bg-accent text-white"
                : "text-muted hover:text-ink"
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
        <div className="bg-white p-8 rounded-3xl border border-border text-center">
          <p className="text-muted">Chargement des véhicules...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-red-700">
          {error}
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-border text-center">
          <TruckIcon className="h-12 w-12 text-muted mx-auto mb-4 opacity-50" />
          <p className="text-muted">Aucun véhicule trouvé avec ce filtre.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-blue-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Marque & Modèle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Transmission
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Carburant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Évaluation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCars.map((car) => (
                <tr
                  key={car.id}
                  className="hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/back-office/cars/${car.id}`}
                      className="flex items-center gap-2 group-hover:text-accent transition"
                    >
                      <div>
                        <div className="font-medium text-ink">{car.brand}</div>
                        <div className="text-sm text-muted">{car.model}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {car.transmission || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {car.fuelType || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1">
                      <SparklesIcon className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-ink">
                        {car.rating?.toFixed(1) || "-"}
                      </span>
                      <span className="text-muted">({car.reviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        car.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {car.isApproved ? "Approuvé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        href={`/back-office/cars/${car.id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-accent hover:bg-blue-100 transition"
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">Détails</span>
                      </Link>
                      {!car.isApproved && (
                        <>
                          <button
                            onClick={() => handleApprove(car.id)}
                            disabled={actionLoading === car.id}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                            <span className="text-xs font-medium">
                              Approuver
                            </span>
                          </button>
                          <button
                            onClick={() => handleReject(car.id)}
                            disabled={actionLoading === car.id}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
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
