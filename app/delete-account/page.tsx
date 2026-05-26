"use client";

import { useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto w-full max-w-6xl px-6 md:px-12 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-stretch">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300/70">Compte</p>
            <h1 className="text-3xl sm:text-5xl font-black mb-5 bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              Suppression de compte
            </h1>
            <p className="text-slate-300 leading-relaxed mb-8">
              Si vous souhaitez supprimer votre compte et toutes les données associées, utilisez ce formulaire.
              Nous vérifions votre identité pour éviter toute suppression frauduleuse.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Vérification</p>
                <p className="text-white font-semibold">Pièce d'identité obligatoire</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Délai</p>
                <p className="text-white font-semibold">Traitement manuel</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Sécurité</p>
                <p className="text-white font-semibold">Suppression confirmée</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300/70">Formulaire</p>
            <h2 className="text-2xl sm:text-3xl font-black mb-4 text-white">Demander la suppression</h2>
            <p className="text-slate-400 mb-8">
              Remplissez les informations ci-dessous pour lancer la procédure.
            </p>

          {status === "success" && (
            <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-200">
              Votre demande a été envoyée avec succès ! Nous vous informerons dès que la suppression sera effective.
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-200">
              {errorMessage || "Une erreur est survenue."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Adresse e-mail liée au compte
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10"
              />
            </div>
            <div>
              <label htmlFor="document" className="block text-sm font-medium text-slate-300 mb-2">
                Copie d'une pièce d'identité (CNI, Passeport...)
              </label>
              <input
                type="file"
                id="document"
                accept="image/*,.pdf"
                required
                onChange={handleFileChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/15"
              />
              <p className="mt-2 text-xs text-slate-400">Pour prouver que vous êtes le titulaire du compte.</p>
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-slate-300 mb-2">
                Raison du départ (optionnel)
              </label>
              <textarea
                id="reason"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10 resize-none"
                placeholder="Dites-nous pourquoi vous nous quittez..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-red-500/20 transition hover:from-red-500 hover:to-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Envoi en cours..." : "Demander la suppression de mon compte"}
            </button>
          </form>
          </section>
        </div>
      </main>
    </div>
  );
}
