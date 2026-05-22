"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { app } from "@/lib/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function DeleteAccountPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", reason: "" });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Veuillez fournir une pièce d'identité pour prouver que ce compte vous appartient.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // Upload document to confirm identity without password
      const storage = getStorage(app);
      const fileName = `delete-requests/${Date.now()}-${file.name}`;
      const fileRef = ref(storage, fileName);
      await uploadBytes(fileRef, file);
      const documentUrl = await getDownloadURL(fileRef);

      const payload = {
        ...formData,
        documentUrl
      };

      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'envoi de la demande");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", reason: "" });
      setFile(null);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition">
              <Image src="/locars-logo.png" alt="Locars Logo" width={100} height={100} className="object-contain" />
            </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Retour à l'accueil
          </Link>
        </div>
      </div>

      <main className="flex-grow mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white p-8 sm:p-12 shadow rounded-2xl">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">Demande de suppression de compte</h1>
          <p className="text-slate-600 mb-8">
            Si vous souhaitez supprimer votre compte et toutes les données associées, veuillez remplir ce formulaire. 
            Afin de vérifier votre identité sans mot de passe, merci de fournir les informations demandées et une pièce d'identité.
          </p>

          {status === "success" && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Votre demande a été envoyée avec succès ! Nous vous informerons dès que la suppression sera effective.
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errorMessage || "Une erreur est survenue."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Adresse e-mail liée au compte
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div>
              <label htmlFor="document" className="block text-sm font-medium text-slate-700 mb-1">
                Copie d'une pièce d'identité (CNI, Passeport...)
              </label>
              <input
                type="file"
                id="document"
                accept="image/*,.pdf"
                required
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
              />
              <p className="mt-1 text-xs text-slate-500">Pour prouver que vous êtes le titulaire du compte.</p>
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
                Raison du départ (optionnel)
              </label>
              <textarea
                id="reason"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent outline-none resize-none"
                placeholder="Dites-nous pourquoi vous nous quittez..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-md hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Envoi en cours..." : "Demander la suppression de mon compte"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
