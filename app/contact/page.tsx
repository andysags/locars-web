"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/app/components/Footer";

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-slate-900">
            LOCARS
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Retour à l'accueil
          </Link>
        </div>
      </div>

      <main className="flex-grow mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white p-8 sm:p-12 shadow rounded-2xl">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">Contactez-nous</h1>
          <p className="text-slate-600 mb-8">
            Une question ? Un problème ? N'hésitez pas à nous envoyer un message via le formulaire ci-dessous.
          </p>

          {status === "success" && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
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
                Adresse e-mail
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
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent outline-none resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-slate-900 text-white font-medium py-3 px-4 rounded-md hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
