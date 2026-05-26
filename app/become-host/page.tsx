"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import {
  registerUser,
  createHostRequest,
  uploadDocument,
  ParticulierRegistrationData,
  AgenceRegistrationData,
} from "@/lib/firebase-utils";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const firebaseConfig = {
  apiKey: "AIzaSyAyw0SLzb6aS1Bf9KwK6P0-6xUY4GwhbRs",
  authDomain: "locars-b5310.firebaseapp.com",
  projectId: "locars-b5310",
  storageBucket: "locars-b5310.firebasestorage.app",
  messagingSenderId: "677998459360",
  appId: "1:677998459360:web:c7082792792b829b4a5385",
};

export default function BecomeHostPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [storage, setStorage] = useState<FirebaseStorage | null>(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      setAuth(getAuth(app));
      setFirestore(getFirestore(app));
      setStorage(getStorage(app));
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
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
        <div className="w-full max-w-xl">
          {/* Step 1: Host Type Selection */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-ink mb-4">
                  Devenir Loueur
                </h1>
                <p className="text-lg text-muted">
                  Quel type de profil correspond le mieux à votre situation ?
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <button
                  onClick={() => setHostType("particulier")}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${
                    hostType === "particulier"
                      ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                      : "border-border bg-white hover:border-accent/40 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-xl ${
                      hostType === "particulier"
                        ? "bg-accent text-white"
                        : "bg-blue-50 text-accent"
                    }`}
                  >
                    👤
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">
                    Particulier
                  </h3>
                  <p className="text-sm text-muted">
                    Je souhaite louer mon véhicule personnel quelques jours par
                    mois.
                  </p>
                </button>

                <button
                  onClick={() => setHostType("agence")}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${
                    hostType === "agence"
                      ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                      : "border-border bg-white hover:border-accent/40 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 text-xl ${
                      hostType === "agence"
                        ? "bg-accent text-white"
                        : "bg-blue-50 text-accent"
                    }`}
                  >
                    🏢
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">
                    Professionnel / Agence
                  </h3>
                  <p className="text-sm text-muted">
                    Je gère une flotte de véhicules et souhaite développer mon
                    activité.
                  </p>
                </button>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!hostType}
                  className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink mb-8 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Retour
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-ink mb-2">
                  Vos identifiants
                </h2>
                <p className="text-muted">
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
                className="space-y-5 bg-white p-8 rounded-3xl border border-border shadow-sm"
              >
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Adresse email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@example.com"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Mot de passe
                  </label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <p className="text-xs text-muted mt-1">
                    Au moins 6 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 rounded-xl bg-border px-6 py-3 font-bold text-ink transition hover:bg-border/70"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
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
                className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink mb-8 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Retour
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-ink mb-2">
                  {hostType === "particulier"
                    ? "Vos informations personnelles"
                    : "Informations de votre agence"}
                </h2>
                <p className="text-muted">Parlez-nous un peu de vous.</p>
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
                className="space-y-5 bg-white p-8 rounded-3xl border border-border shadow-sm"
              >
                {hostType === "particulier" && (
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-ink mb-2">
                          Prénom
                        </label>
                        <input
                          required
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jean"
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-ink mb-2">
                          Nom
                        </label>
                        <input
                          required
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Dupont"
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">
                        Date de naissance
                      </label>
                      <input
                        required
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">
                        Numéro de permis
                      </label>
                      <input
                        required
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="1234567890"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">
                        Pays d'émission
                      </label>
                      <select
                        value={licenseCountry}
                        onChange={(e) => setLicenseCountry(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
                      <label className="block text-sm font-bold text-ink mb-2">
                        Nom de l'agence
                      </label>
                      <input
                        required
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="Locars SAS"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-ink mb-2">
                          Prénom du représentant
                        </label>
                        <input
                          required
                          type="text"
                          value={repFirstName}
                          onChange={(e) => setRepFirstName(e.target.value)}
                          placeholder="Jean"
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-ink mb-2">
                          Nom du représentant
                        </label>
                        <input
                          required
                          type="text"
                          value={repLastName}
                          onChange={(e) => setRepLastName(e.target.value)}
                          placeholder="Dupont"
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">
                        Adresse de l'agence
                      </label>
                      <input
                        required
                        type="text"
                        value={agencyAddress}
                        onChange={(e) => setAgencyAddress(e.target.value)}
                        placeholder="123 Rue de Paris, 75001 Paris"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">
                        Email professionnel
                      </label>
                      <input
                        required
                        type="email"
                        value={professionalEmail}
                        onChange={(e) => setProfessionalEmail(e.target.value)}
                        placeholder="contact@agence.com"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">
                        Téléphone professionnel
                      </label>
                      <input
                        required
                        type="tel"
                        value={professionalPhone}
                        onChange={(e) => setProfessionalPhone(e.target.value)}
                        placeholder="+33 1 23 45 67 89"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">
                        Numéro IFU (optionnel)
                      </label>
                      <input
                        type="text"
                        value={ifuNumber}
                        onChange={(e) => setIfuNumber(e.target.value)}
                        placeholder="1234567890"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 rounded-xl bg-border px-6 py-3 font-bold text-ink transition hover:bg-border/70"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
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
                className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink mb-8 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Retour
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-ink mb-2">
                  Téléchargez vos documents
                </h2>
                <p className="text-muted">
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
                className="space-y-5 bg-white p-8 rounded-3xl border border-border shadow-sm"
              >
                {hostType === "particulier" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-ink mb-3">
                        Pièce d'identité (CNI, Passeport, etc.) *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 cursor-pointer hover:border-accent hover:bg-accent/5 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-muted" />
                        <div>
                          <p className="font-bold text-sm text-ink">
                            {identityDoc
                              ? identityDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-muted">
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
                      <label className="block text-sm font-bold text-ink mb-3">
                        Permis de conduire *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 cursor-pointer hover:border-accent hover:bg-accent/5 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-muted" />
                        <div>
                          <p className="font-bold text-sm text-ink">
                            {drivingLicenseDoc
                              ? drivingLicenseDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-muted">
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
                      <label className="block text-sm font-bold text-ink mb-3">
                        Pièce d'identité du représentant (CNI, Passeport, etc.)
                        *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 cursor-pointer hover:border-accent hover:bg-accent/5 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-muted" />
                        <div>
                          <p className="font-bold text-sm text-ink">
                            {identityDoc
                              ? identityDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-muted">
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
                      <label className="block text-sm font-bold text-ink mb-3">
                        Extrait du registre du commerce (RCCM) *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 cursor-pointer hover:border-accent hover:bg-accent/5 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-muted" />
                        <div>
                          <p className="font-bold text-sm text-ink">
                            {commercialRegDoc
                              ? commercialRegDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-muted">
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
                      <label className="block text-sm font-bold text-ink mb-3">
                        Attestation IFU *
                      </label>
                      <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 cursor-pointer hover:border-accent hover:bg-accent/5 transition">
                        <DocumentArrowUpIcon className="h-6 w-6 text-muted" />
                        <div>
                          <p className="font-bold text-sm text-ink">
                            {ifuAttestationDoc
                              ? ifuAttestationDoc.name
                              : "Cliquez pour télécharger"}
                          </p>
                          <p className="text-xs text-muted">
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
                    className="flex items-center gap-2 rounded-xl bg-border px-6 py-3 font-bold text-ink transition hover:bg-border/70 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-lg text-muted max-w-md mx-auto">
                  Merci de vous être inscrit comme loueur. Nous examinerons
                  votre demande et vous répondrons par email dans les 48 heures.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 mb-8">
                <p className="text-sm text-muted mb-2">
                  Un email de confirmation a été envoyé à :
                </p>
                <p className="font-bold text-ink">{email}</p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
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
