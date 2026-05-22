"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { loginUser } from "@/lib/firebase-utils";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await loginUser(auth, email, password);

      // Set auth cookie via API
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Redirect to back-office
      router.push("/back-office");
    } catch (err: any) {
      const errorCode = err?.code || "";
      const errorMessage = err?.message || "Erreur de connexion";

      // Firebase error codes
      if (
        errorCode === "auth/user-not-found" ||
        errorMessage.includes("user-not-found")
      ) {
        setError(
          "❌ Cet email n'existe pas. Vérifiez votre email ou créez un compte.",
        );
      } else if (
        errorCode === "auth/wrong-password" ||
        errorMessage.includes("wrong-password")
      ) {
        setError("❌ Le mot de passe est incorrect.");
      } else if (errorCode === "auth/invalid-email") {
        setError("❌ Format d'email invalide.");
      } else if (errorCode === "auth/too-many-requests") {
        setError("❌ Trop de tentatives. Veuillez réessayer plus tard.");
      } else if (errorCode === "auth/invalid-credential") {
        setError("❌ Email ou mot de passe incorrect.");
      } else {
        setError(`❌ Erreur: ${errorMessage || "Erreur de connexion"}`);
      }
      console.error("Login error:", {
        errorCode,
        errorMessage,
        fullError: err,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="mb-8 hover:opacity-80 transition inline-block"
          >
            <Image
              src="/locars-logo.png"
              alt="Locars Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>
          <h1 className="text-3xl font-black text-ink mb-2">Connexion</h1>
          <p className="text-muted">
            Accédez au tableau de bord administrateur
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-ink mb-2"
              >
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@locars.com"
                  className="w-full rounded-xl border border-border bg-white pl-12 pr-4 py-3 text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-ink mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-white pl-12 pr-4 py-3 text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition"
                />
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  disabled
                />
                <span className="text-sm text-muted">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                className="text-sm text-muted hover:text-accent transition disabled:opacity-50"
                disabled
              >
                Mot de passe oublié?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-6"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            Retour à l'accueil{" "}
            <Link
              href="/"
              className="font-bold text-accent hover:text-accent/80 transition"
            >
              Locars
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
