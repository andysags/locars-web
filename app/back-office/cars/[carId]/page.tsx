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
      await updateDoc(doc(db, "cars", car.id), {
        isApproved: true,
      });
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
      await updateDoc(doc(db, "cars", car.id), {
        isApproved: false,
      });
      setCar({ ...car, isApproved: false });
    } catch (err) {
      console.error("Error rejecting car:", err);
      setError("Erreur lors du rejet");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          href="/back-office/cars"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Retour aux véhicules
        </Link>
        <div className="bg-white p-8 rounded-3xl border border-border text-center">
          <p className="text-muted">Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          href="/back-office/cars"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Retour aux véhicules
        </Link>
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/back-office/cars"
        className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Retour aux véhicules
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">
          {car.brand} {car.model}
        </h1>
        <p className="text-muted">
          Détails et gestion du véhicule ID: {car.id}
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-4">
              Informations générales
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-muted mb-1">Marque</p>
                <p className="text-ink">{car.brand}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted mb-1">Modèle</p>
                <p className="text-ink">{car.model}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted mb-1">Année</p>
                <p className="text-ink">{car.year || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted mb-1">
                  Plaque d'immatriculation
                </p>
                <p className="text-ink">{car.licensePlate || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted mb-1">
                  Kilométrage
                </p>
                <p className="text-ink">{car.mileage || "N/A"} km</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted mb-1">
                  Localisation
                </p>
                <p className="text-ink">{car.location || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Specs Card */}
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-4">Spécifications</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted">Passagers</p>
                  <p className="font-medium text-ink">{car.seats || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BoltIcon className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted">Transmission</p>
                  <p className="font-medium text-ink">
                    {car.transmission || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TruckIcon className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted">Carburant</p>
                  <p className="font-medium text-ink">{car.fuelType || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="bg-white rounded-3xl p-6 border border-border">
              <h2 className="text-xl font-bold text-ink mb-4">Description</h2>
              <p className="text-muted leading-relaxed">{car.description}</p>
            </div>
          )}

          {/* Options */}
          {car.options && car.options.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-border">
              <h2 className="text-xl font-bold text-ink mb-4">Options</h2>
              <div className="space-y-2">
                {car.options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="text-ink">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating Card */}
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-4">Évaluation</h2>
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="h-5 w-5 text-yellow-500" />
              <span className="text-3xl font-bold text-ink">
                {car.rating?.toFixed(1) || "N/A"}
              </span>
            </div>
            <p className="text-sm text-muted">{car.reviews || 0} avis</p>
          </div>

          {/* Price Card */}
          {car.pricePerDay && (
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-ink mb-4">Prix</h2>
              <p className="text-4xl font-bold text-accent mb-1">
                €{car.pricePerDay}
              </p>
              <p className="text-sm text-muted">par jour</p>
            </div>
          )}

          {/* Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-4">Statut</h2>
            <div className="mb-4">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  car.isApproved
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {car.isApproved ? "Approuvé" : "En attente"}
              </span>
            </div>
            <div className="space-y-2">
              {!car.isApproved ? (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50 font-medium"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Approuver
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 font-medium"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Rejeter
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-600">
                  <CheckCircleIcon className="h-5 w-5" />
                  Approuvé
                </div>
              )}
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-3xl p-6 border border-border">
            <h2 className="text-xl font-bold text-ink mb-4">Propriétaire</h2>
            <p className="text-sm text-muted break-all">{car.ownerId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
