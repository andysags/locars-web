"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import {
  MagnifyingGlassIcon,
  StarIcon,
  MapPinIcon,
  UserIcon,
  BoltIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { getAllCars } from "@/lib/firebase-utils";

interface Car {
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
  location?: string;
  imageUrls?: string[];
  options?: string[];
  description?: string;
  licensePlate?: string;
  mileage?: number;
  isApproved?: boolean;
}

type TransmissionFilter = "all" | "auto" | "manual";
type FuelFilter = "all" | "essence" | "diesel" | "hybrid" | "electric";

export default function CarsDashboard() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [transmission, setTransmission] = useState<TransmissionFilter>("all");
  const [fuelType, setFuelType] = useState<FuelFilter>("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [rentalType, setRentalType] = useState<
    "all" | "day" | "week" | "month"
  >("all");

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const allCarsData = await getAllCars(db);
        // Filter for approved cars only
        const approvedCars = (allCarsData as Car[]).filter(
          (car) => car.isApproved === true || car.isApproved === undefined,
        );
        setAllCars(approvedCars);
        setFilteredCars(approvedCars);
        if (approvedCars.length > 0) {
          setSelectedCar(approvedCars[0]);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = allCars;

    // Search
    if (searchTerm) {
      result = result.filter(
        (car) =>
          `${car.brand} ${car.model}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          car.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Transmission
    if (transmission !== "all") {
      result = result.filter((car) =>
        car.transmission?.toLowerCase().includes(transmission),
      );
    }

    // Fuel Type
    if (fuelType !== "all") {
      result = result.filter((car) =>
        car.fuelType?.toLowerCase().includes(fuelType),
      );
    }

    // Price Range
    result = result.filter(
      (car) =>
        (car.pricePerDay || 0) >= priceRange[0] &&
        (car.pricePerDay || 0) <= priceRange[1],
    );

    setFilteredCars(result);
    if (result.length > 0 && !result.find((c) => c.id === selectedCar?.id)) {
      setSelectedCar(result[0]);
    }
  }, [searchTerm, transmission, fuelType, priceRange, allCars, selectedCar]);

  const handleNextImage = () => {
    const images = selectedCar?.imageUrls || [];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    const images = selectedCar?.imageUrls || [];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-border p-6 shadow-sm">
        <h1 className="text-4xl font-bold text-ink mb-4">
          Trouver votre véhicule
        </h1>
        <div className="max-w-xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder="Rechercher une marque, modèle ou localité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent bg-blue-50"
            />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-160px)]">
        {/* Left Sidebar - Filters */}
        <div className="w-72 bg-white border-r border-border p-6 overflow-y-auto">
          <h2 className="text-lg font-bold text-ink mb-6">Filtrer par</h2>

          {/* Rental Type */}
          <div className="mb-8">
            <h3 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wider">
              Type de location
            </h3>
            <div className="space-y-2">
              {(["all", "day", "week", "month"] as const).map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={rentalType === type}
                    onChange={() => setRentalType(type)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="ml-3 text-muted capitalize">
                    {type === "all"
                      ? "Tous"
                      : type === "day"
                        ? "Par jour"
                        : type === "week"
                          ? "Par semaine"
                          : "Par mois"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="mb-8">
            <h3 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wider">
              Transmission
            </h3>
            <div className="space-y-2">
              {(["all", "auto", "manual"] as const).map((trans) => (
                <label key={trans} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={transmission === trans}
                    onChange={() => setTransmission(trans)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="ml-3 text-muted capitalize">
                    {trans === "all"
                      ? "Tous"
                      : trans === "auto"
                        ? "Automatique"
                        : "Manuelle"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div className="mb-8">
            <h3 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wider">
              Carburant
            </h3>
            <div className="space-y-2">
              {(
                ["all", "essence", "diesel", "hybrid", "electric"] as const
              ).map((fuel) => (
                <label key={fuel} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={fuelType === fuel}
                    onChange={() => setFuelType(fuel)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="ml-3 text-muted capitalize">
                    {fuel === "all" ? "Tous" : fuel}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-semibold text-ink mb-3 text-sm uppercase tracking-wider">
              Prix par jour
            </h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full accent-accent"
              />
              <div className="flex items-center justify-between">
                <span className="text-muted text-sm">€{priceRange[0]}</span>
                <span className="text-muted text-sm">€{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Car List */}
        <div className="w-96 bg-white border-r border-border overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-muted">
              Chargement des véhicules...
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="p-6 text-center text-muted">
              Aucun véhicule trouvé
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => {
                    setSelectedCar(car);
                    setCurrentImageIndex(0);
                  }}
                  className={`p-4 cursor-pointer transition-all border-l-4 ${
                    selectedCar?.id === car.id
                      ? "bg-blue-50 border-l-accent"
                      : "border-l-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      {car.imageUrls?.[0] && (
                        <Image
                          src={car.imageUrls[0]}
                          alt={`${car.brand} ${car.model}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-ink truncate">
                        {car.brand} {car.model}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-ink">
                          {car.rating?.toFixed(1) || "4.5"}
                        </span>
                        <span className="text-xs text-muted">
                          ({car.reviews || 0})
                        </span>
                      </div>
                      <div className="text-sm text-accent font-bold mt-2">
                        €{car.pricePerDay || 0}/jour
                      </div>
                    </div>

                    {/* Status Badge */}
                    {car.isApproved && (
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - Car Details */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-muted">Chargement...</div>
          ) : selectedCar ? (
            <div className="bg-white">
              {/* Image Carousel */}
              <div className="relative bg-gray-100 h-80 flex items-center justify-center overflow-hidden">
                {selectedCar.imageUrls && selectedCar.imageUrls.length > 0 ? (
                  <>
                    <Image
                      src={selectedCar.imageUrls[currentImageIndex]}
                      alt={`${selectedCar.brand} ${selectedCar.model}`}
                      fill
                      className="object-cover"
                    />
                    {selectedCar.imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                        >
                          <ChevronLeftIcon className="h-5 w-5 text-ink" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                        >
                          <ChevronRightIcon className="h-5 w-5 text-ink" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                          {selectedCar.imageUrls.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition ${
                                idx === currentImageIndex
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-muted">Pas d'image disponible</div>
                )}
              </div>

              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-ink mb-2">
                    {selectedCar.brand} {selectedCar.model}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-ink">
                        {selectedCar.rating?.toFixed(1) || "4.5"}
                      </span>
                      <span className="text-muted">
                        ({selectedCar.reviews || 0} avis)
                      </span>
                    </div>
                    {selectedCar.location && (
                      <div className="flex items-center gap-1 text-muted">
                        <MapPinIcon className="h-4 w-4" />
                        {selectedCar.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 mb-8">
                  <div className="text-sm text-muted mb-2">Prix par jour</div>
                  <div className="text-5xl font-bold text-accent mb-4">
                    €{selectedCar.pricePerDay || 0}
                  </div>
                  <button className="w-full bg-accent text-white font-semibold py-3 rounded-2xl hover:bg-blue-700 transition">
                    Réserver maintenant
                  </button>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <UserIcon className="h-6 w-6 text-accent mx-auto mb-2" />
                    <div className="font-semibold text-ink">
                      {selectedCar.seats || 5}
                    </div>
                    <div className="text-xs text-muted">Passagers</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <BoltIcon className="h-6 w-6 text-accent mx-auto mb-2" />
                    <div className="font-semibold text-ink capitalize">
                      {selectedCar.transmission || "Auto"}
                    </div>
                    <div className="text-xs text-muted">Transmission</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <SparklesIcon className="h-6 w-6 text-accent mx-auto mb-2" />
                    <div className="font-semibold text-ink capitalize">
                      {selectedCar.fuelType || "Essence"}
                    </div>
                    <div className="text-xs text-muted">Carburant</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {selectedCar.year && (
                    <div className="flex justify-between">
                      <span className="text-muted">Année</span>
                      <span className="font-semibold text-ink">
                        {selectedCar.year}
                      </span>
                    </div>
                  )}
                  {selectedCar.licensePlate && (
                    <div className="flex justify-between">
                      <span className="text-muted">Immatriculation</span>
                      <span className="font-semibold text-ink font-mono">
                        {selectedCar.licensePlate}
                      </span>
                    </div>
                  )}
                  {selectedCar.mileage && (
                    <div className="flex justify-between">
                      <span className="text-muted">Kilométrage</span>
                      <span className="font-semibold text-ink">
                        {selectedCar.mileage.toLocaleString()} km
                      </span>
                    </div>
                  )}
                </div>

                {/* Options */}
                {selectedCar.options && selectedCar.options.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-bold text-ink mb-3">
                      Options incluses
                    </h3>
                    <div className="space-y-2">
                      {selectedCar.options.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <span className="text-muted">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedCar.description && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="font-bold text-ink mb-3">Description</h3>
                    <p className="text-muted leading-relaxed">
                      {selectedCar.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted">
              Sélectionnez un véhicule
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
