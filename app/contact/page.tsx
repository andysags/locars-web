"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto w-full max-w-6xl px-6 md:px-12 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-stretch">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.12),transparent_35%)]" />
            <div className="relative">
              <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300/70">Support</p>
              <h1 className="text-3xl sm:text-5xl font-black mb-5 bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                Contactez-nous
              </h1>
              <p className="max-w-md text-slate-300 text-lg leading-relaxed mb-10">
                Une question, un blocage, une demande de partenariat ou un retour produit ?
                Écrivez-nous ici et on vous répond rapidement.
              </p>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Réponse</p>
                  <p className="text-white font-semibold">Sous 24 heures ouvrées</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Canal</p>
                  <p className="text-white font-semibold">Email, support ou partenariat</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Ton</p>
                  <p className="text-white font-semibold">Direct, rapide, humain</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300/70">Formulaire</p>
            <h2 className="text-2xl sm:text-3xl font-black mb-4 text-white">Envoyer un message</h2>
            <p className="text-slate-400 mb-8">
              Décris la demande en quelques lignes, on s’occupe du reste.
            </p>

          {status === "success" && (
            <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-200">
              Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
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
                Adresse e-mail
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
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10 resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
          </section>
        </div>
      </main>
    </div>
  );
}
