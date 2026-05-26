"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import {
  registerUser,
  createHostRequest,
  uploadDocument,
  ParticulierRegistrationData,
  AgenceRegistrationData,
} from "@/lib/firebase-utils";
import { auth as firebaseAuth, db, storage as firebaseStorage } from "@/lib/firebase";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function BecomeHostPage() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [storage, setStorage] = useState<FirebaseStorage | null>(null);

  useEffect(() => {
    setAuth(firebaseAuth);
    setFirestore(db);
    setStorage(firebaseStorage);
  }, []);
  const [step, setStep] = useState(1);
  const [hostType, setHostType] = useState<"particulier" | "agence" | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Credentials
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Personal/Professional info
  // Particulier
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCountry, setLicenseCountry] = useState("FR");

  // Agence
  const [agencyName, setAgencyName] = useState("");
  const [repFirstName, setRepFirstName] = useState("");
  const [repLastName, setRepLastName] = useState("");
  const [agencyAddress, setAgencyAddress] = useState("");
  const [professionalEmail, setProfessionalEmail] = useState("");
  const [professionalPhone, setProfessionalPhone] = useState("");
  const [ifuNumber, setIfuNumber] = useState("");

  // Step 3: Documents
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
  const [drivingLicenseDoc, setDrivingLicenseDoc] = useState<File | null>(null);
  const [commercialRegDoc, setCommercialRegDoc] = useState<File | null>(null);
  const [ifuAttestationDoc, setIfuAttestationDoc] = useState<File | null>(null);

  const nextStep = () => {
    setError(null);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const validateStep1 = (): boolean => {
    if (!email || !phone || !password || !confirmPassword) {
      setError("Tous les champs sont requis");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (hostType === "particulier") {
      if (!firstName || !lastName || !dateOfBirth || !licenseNumber) {
        setError("Tous les champs sont requis");
        return false;
      }
    } else if (hostType === "agence") {
      if (
        !agencyName ||
        !repFirstName ||
        !repLastName ||
        !agencyAddress ||
        !professionalEmail ||
        !professionalPhone
      ) {
        setError("Tous les champs sont requis");
        return false;
      }
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (hostType === "particulier") {
      if (!identityDoc || !drivingLicenseDoc) {
        setError("Veuillez télécharger tous les documents requis");
        return false;
      }
      if (
        identityDoc.size > 10 * 1024 * 1024 ||
        drivingLicenseDoc.size > 10 * 1024 * 1024
      ) {
        setError("La taille des fichiers ne doit pas dépasser 10 MB");
        return false;
      }
    } else if (hostType === "agence") {
      if (!identityDoc || !commercialRegDoc || !ifuAttestationDoc) {
        setError("Veuillez télécharger tous les documents requis");
        return false;
      }
      if (
        identityDoc.size > 10 * 1024 * 1024 ||
        commercialRegDoc.size > 10 * 1024 * 1024 ||
        ifuAttestationDoc.size > 10 * 1024 * 1024
      ) {
        setError("La taille des fichiers ne doit pas dépasser 10 MB");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    if (!auth || !firestore || !storage) {
      setError("Firebase n\'est pas initialisé");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Register user with Firebase Auth
      const user = await registerUser(auth, email, password);

      // 2. Upload documents to Cloud Storage
      const documentUrls: Record<string, string> = {};

      if (hostType === "particulier" && identityDoc && drivingLicenseDoc) {
        documentUrls.identityDocument = await uploadDocument(
          storage,
          user.uid,
          "identity",
          identityDoc,
        );
        documentUrls.drivingLicense = await uploadDocument(
          storage,
          user.uid,
          "driving-license",
          drivingLicenseDoc,
        );

        // 3. Create Host Request in Firestore
        await createHostRequest(
          firestore,
          user.uid,
          "particulier",
          {
            email,
            phone,
            password: "", // Don't store password
            firstName,
            lastName,
            dateOfBirth,
            licenseNumber,
            licenseCountry,
            identityDocument: new File([], ""), // Placeholder
            drivingLicense: new File([], ""), // Placeholder
          },
          documentUrls,
        );
      } else if (
        hostType === "agence" &&
        identityDoc &&
        commercialRegDoc &&
        ifuAttestationDoc
      ) {
        documentUrls.identityDocument = await uploadDocument(
          storage,
          user.uid,
          "identity",
          identityDoc,
        );
        documentUrls.commercialRegistry = await uploadDocument(
          storage,
          user.uid,
          "commercial-registry",
          commercialRegDoc,
        );
        documentUrls.ifuAttestation = await uploadDocument(
          storage,
          user.uid,
          "ifu-attestation",
          ifuAttestationDoc,
        );

        // 3. Create Host Request in Firestore
        await createHostRequest(
          firestore,
          user.uid,
          "agence",
          {
            email,
            phone,
            password: "", // Don't store password
            agencyName,
            representativeFirstName: repFirstName,
            representativeLastName: repLastName,
            agencyAddress,
            professionalEmail,
            professionalPhone,
            ifuNumber: ifuNumber || undefined,
            identityDocument: new File([], ""), // Placeholder
            commercialRegistry: new File([], ""), // Placeholder
            ifuAttestation: new File([], ""), // Placeholder
          },
          documentUrls,
        );
      }

      // Go to success step
      nextStep();
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessage = err?.message || "Une erreur s'est produite";
      if (errorMessage.includes("email-already-in-use")) {
        setError("Cet email est déjà utilisé");
      } else if (errorMessage.includes("weak-password")) {
        setError("Le mot de passe est trop faible");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 4; // 1: Host type, 2: Credentials, 3: Info, 4: Documents, 5: Success (implicit step 4)
  const displayStep = step <= 4 ? step : 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl">
          {step <= 4 && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <span>Inscription loueur</span>
                <span>Etape {displayStep}/4</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full ${
                      index <= displayStep ? "bg-blue-500" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Host Type Selection */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-white mb-4">
                  Devenir Loueur
                </h1>
                <p className="text-lg text-slate-400">
                  Quel type de profil correspond le mieux à votre situation ?
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <button
                  onClick={() => setHostType("particulier")}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${
                    hostType === "particulier"
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:border-blue-400/60 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-xl ${
                      hostType === "particulier"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-800 text-blue-300"
                    }`}
                  >
                    👤
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Particulier
                  </h3>
                  <p className="text-sm text-slate-400">
                    Je souhaite louer mon véhicule personnel quelques jours par
                    mois.
                  </p>
                </button>

                <button
                  onClick={() => setHostType("agence")}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${
                    hostType === "agence"
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:border-blue-400/60 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-xl ${
                      hostType === "agence"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-800 text-blue-300"
                    }`}
                  >
                    🏢
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Professionnel / Agence
                  </h3>
                  <p className="text-sm text-slate-400">
                    Je gère une flotte de véhicules et souhaite développer mon
                    activité.
                  </p>
                </button>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!hostType}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Credentials */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Retour
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  Vos identifiants
                </h2>
                <p className="text-slate-400">
                  Créez votre compte pour accéder à la plateforme.
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateStep1()) nextStep();
                }}
                className="space-y-5 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm"
              >
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Adresse email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@example.com"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Mot de passe
                  </label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Au moins 6 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
                  >
                    Étape suivante
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Personal/Professional Info */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Retour
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  {hostType === "particulier"
                    ? "Vos informations personnelles"
                    : "Informations de votre agence"}
                </h2>
                <p className="text-slate-400">Parlez-nous un peu de vous.</p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateStep2()) nextStep();
                }}
                className="space-y-5 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm"
              >
                {hostType === "particulier" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Prénom
                        </label>
                        <input
                          required
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jean"
                          className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Nom
                        </label>
                        <input
                          required
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Dupont"
                          className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Date de naissance
                      </label>
                      <input
                        required
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Numéro de permis
                      </label>
                      <input
                        required
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="1234567890"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Pays d'émission
                      </label>
                      <select
                        value={licenseCountry}
                        onChange={(e) => setLicenseCountry(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="LU">Luxembourg</option>
                        <option value="DE">Allemagne</option>
                        <option value="CH">Suisse</option>
                      </select>
                    </div>
                  </>
                )}

                {hostType === "agence" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Nom de l'agence
                      </label>
                      <input
                        required
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="Locars SAS"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Prénom du représentant
                        </label>
                        <input
                          required
                          type="text"
                          value={repFirstName}
                          onChange={(e) => setRepFirstName(e.target.value)}
                          placeholder="Jean"
                          className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Nom du représentant
                        </label>
                        <input
                          required
                          type="text"
                          value={repLastName}
                          onChange={(e) => setRepLastName(e.target.value)}
                          placeholder="Dupont"
                          className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Adresse de l'agence
                      </label>
                      <input
                        required
                        type="text"
                        value={agencyAddress}
                        onChange={(e) => setAgencyAddress(e.target.value)}
                        placeholder="123 Rue de Paris, 75001 Paris"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Email professionnel
                      </label>
                      <input
                        required
                        type="email"
                        value={professionalEmail}
                        onChange={(e) => setProfessionalEmail(e.target.value)}
                        placeholder="contact@agence.com"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Téléphone professionnel
                      </label>
                      <input
                        required
                        type="tel"
                        value={professionalPhone}
                        onChange={(e) => setProfessionalPhone(e.target.value)}
                        placeholder="+33 1 23 45 67 89"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Numéro IFU (optionnel)
                      </label>
                      <input
                        type="text"
                        value={ifuNumber}
                        onChange={(e) => setIfuNumber(e.target.value)}
                        placeholder="1234567890"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
                  >
                    Étape suivante
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Retour
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-white mb-2">
                  Téléchargez vos documents
                </h2>
                <p className="text-slate-400">
                  Pour valider votre inscription, veuillez fournir les documents
                  requis.
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm"
              >
                {hostType === "particulier" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-ink mb-3">
                        Pièce d'identité (CNI, Passeport, etc.) *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 bg-slate-900/40 p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-slate-400" />
                        <div>
                          <p className="font-bold text-sm text-white">
                            {identityDoc
                              ? identityDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-slate-400">
                            PDF, JPG, PNG - Max 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            setIdentityDoc(e.target.files?.[0] || null)
                          }
                          className="hidden"
                          required
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-3">
                        Permis de conduire *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 bg-slate-900/40 p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-slate-400" />
                        <div>
                          <p className="font-bold text-sm text-white">
                            {drivingLicenseDoc
                              ? drivingLicenseDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-slate-400">
                            PDF, JPG, PNG - Max 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            setDrivingLicenseDoc(e.target.files?.[0] || null)
                          }
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                  </>
                )}

                {hostType === "agence" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-white mb-3">
                        Pièce d'identité du représentant (CNI, Passeport, etc.)
                        *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 bg-slate-900/40 p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-slate-400" />
                        <div>
                          <p className="font-bold text-sm text-white">
                            {identityDoc
                              ? identityDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-slate-400">
                            PDF, JPG, PNG - Max 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            setIdentityDoc(e.target.files?.[0] || null)
                          }
                          className="hidden"
                          required
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-3">
                        Extrait du registre du commerce (RCCM) *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 bg-slate-900/40 p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-slate-400" />
                        <div>
                          <p className="font-bold text-sm text-white">
                            {commercialRegDoc
                              ? commercialRegDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-slate-400">
                            PDF, JPG, PNG - Max 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            setCommercialRegDoc(e.target.files?.[0] || null)
                          }
                          className="hidden"
                          required
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-3">
                        Attestation IFU *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 bg-slate-900/40 p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-slate-400" />
                        <div>
                          <p className="font-bold text-sm text-white">
                            {ifuAttestationDoc
                              ? ifuAttestationDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-slate-400">
                            PDF, JPG, PNG - Max 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            setIfuAttestationDoc(e.target.files?.[0] || null)
                          }
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                  </>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Soumission en cours..." : "Soumettre"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-extrabold text-ink mb-4">
                  Demande soumise avec succès !
                </h1>
                <p className="text-lg text-slate-300 max-w-md mx-auto">
                  Merci de vous être inscrit comme loueur. Nous examinerons
                  votre demande et vous répondrons par email dans les 48 heures.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
                <p className="text-sm text-slate-400 mb-2">
                  Un email de confirmation a été envoyé à :
                </p>
                <p className="font-bold text-white">{email}</p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
              >
                Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
