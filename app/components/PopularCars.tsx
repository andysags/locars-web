"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getPopularCars } from "@/lib/firebase-utils";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  PhoneIcon,
  BoltIcon,
  SparklesIcon,
  UserIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function PopularCars() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
          authDomain: "locars-b5310.firebaseapp.com",
          projectId: "locars-b5310",
          storageBucket: "locars-b5310.firebasestorage.app",
          messagingSenderId: "677998459360",
          appId: "1:677998459360:web:c7082792792b829b4a5385",
        };

        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const popularCars = await getPopularCars(firestore, 4);
        setCars(popularCars);
      } catch (err) {
        console.error("Error fetching popular cars:", err);
        setError("Erreur lors du chargement des voitures");
        // Fallback to empty array or static data
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Fallback static data if database is empty
  const defaultCars = [
    {
      id: "default-1",
      brand: "Jaguar",
      model: "XE L P250",
      rating: 4.8,
      reviews: 2436,
      seats: 4,
      transmission: "Auto",
      fuelType: "Essence",
      pricePerDay: 1800,
      options: ["Climatisation", "4 Portes"],
    },
    {
      id: "default-2",
      brand: "Audi",
      model: "R8",
      rating: 4.6,
      reviews: 1936,
      seats: 2,
      transmission: "Auto",
      fuelType: "Essence",
      pricePerDay: 2100,
      options: ["Climatisation", "2 Portes"],
    },
    {
      id: "default-3",
      brand: "BMW",
      model: "M3",
      rating: 4.5,
      reviews: 2038,
      seats: 4,
      transmission: "Auto",
      fuelType: "Essence",
      pricePerDay: 1600,
      options: ["Climatisation", "4 Portes"],
    },
    {
      id: "default-4",
      brand: "Lamborghini",
      model: "Huracan",
      rating: 4.3,
      reviews: 2238,
      seats: 2,
      transmission: "Auto",
      fuelType: "Essence",
      pricePerDay: 2300,
      options: ["Climatisation", "2 Portes"],
    },
  ];

  const displayCars = cars.length > 0 ? cars : defaultCars;

  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 mb-6">
            <span className="text-sm font-bold text-accent uppercase tracking-wide">
              OFFRES DE LOCATION POPULAIRES
            </span>
          </div>

          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Nos offres de location automobile les plus populaires
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted">Chargement des voitures...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {displayCars.map((car, index) => (
                <div
                  key={car.id || index}
                  className="flex flex-col rounded-3xl bg-white p-6 shadow-sm border border-border overflow-hidden"
                >
                  <div className="relative h-48 mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Image
                      src="/car.png"
                      alt={`${car.brand || "Car"} ${car.model || ""}`}
                      width={250}
                      height={180}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h3 className="font-black text-lg text-ink">
                    {car.brand} {car.model}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-ink">
                      {(car.rating || 4.5).toFixed(1)}
                    </span>
                    <span className="text-sm text-muted">
                      ({car.reviews || 0} avis)
                    </span>
                  </div>

                  {/* Main Specs */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted">Passagers</p>
                        <p className="text-sm font-bold text-ink">
                          {car.seats || 4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BoltIcon className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted">Trans.</p>
                        <p className="text-sm font-bold text-ink">
                          {car.transmission || "Auto"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted">Carburant</p>
                        <p className="text-sm font-bold text-ink">
                          {car.fuelType || "Essence"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="mt-4 space-y-1.5 pt-3 border-t border-border">
                    {car.options && car.options.length > 0 ? (
                      car.options.map((option: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-muted"
                        >
                          <CheckCircleIcon className="h-4 w-4 text-blue-300" />
                          <span>{option}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <PhoneIcon className="h-4 w-4 text-blue-300" />
                          <span>Climatisation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <CheckCircleIcon className="h-4 w-4 text-blue-300" />
                          <span>Options</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Prix</p>
                      <p className="text-2xl font-black text-ink">
                        {car.pricePerDay || 1800} €{" "}
                        <span className="text-sm text-muted">/jour</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    href="#"
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Louer maintenant
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/cars-dashboard"
                className="inline-flex items-center gap-2 text-accent font-bold hover:text-accent/80 transition"
              >
                Afficher tous les véhicules
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
