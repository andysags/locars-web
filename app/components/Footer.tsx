import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`relative z-10 bg-slate-900 font-sans text-white py-16 sm:py-20 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1 lg:pt-2">
            <p className="max-w-xl text-sm leading-relaxed text-slate-400">
              Location claire, simple et sécurisée pour locataires et propriétaires.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  Cotonou, Bénin
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-blue-300 flex-shrink-0" />
                <p className="text-sm text-slate-300">+229 XX XX XX XX</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-300">✉</span>
                <p className="text-sm text-slate-300">contact@locars.app</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">Support</h4>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li><Link href="/faq" className="transition hover:text-white">FAQ</Link></li>
                  <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
                  <li><Link href="/delete-account" className="transition hover:text-white">Suppression de compte</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">Légal</h4>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li><Link href="/privacy" className="transition hover:text-white">Politique de confidentialité</Link></li>
                  <li><Link href="/cgu" className="transition hover:text-white">CGU</Link></li>
                  <li><Link href="/about" className="transition hover:text-white">À propos</Link></li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">Suivez-nous</h4>
              <div className="flex gap-4">
                <Link href="https://www.facebook.com/share/14euiP1vUi5/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-[#1877F2]">
                    <path
                      fill="currentColor"
                      d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 10.99 10.12 11.9v-8.42H7.08v-3.48h3.04V9.41c0-3.02 1.8-4.69 4.56-4.69 1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.5 0-1.97.94-1.97 1.9v2.28h3.35l-.54 3.48h-2.81v8.42C19.61 23.06 24 18.09 24 12.07Z"
                    />
                  </svg>
                </Link>
                <Link href="https://www.instagram.com/locars.app?igsh=dWlsY3gzdWtoeDFs" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
                  <Image src="/instagram.svg" alt="Instagram Locars" width={20} height={20} />
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:pt-2">
            <div>
              <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                Application
              </h4>
              <p className="max-w-sm text-sm leading-relaxed text-slate-300">
                Réservez plus vite depuis votre téléphone et gardez vos trajets à portée de main.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="inline-flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 transition hover:bg-white/10"
                aria-label="Télécharger sur App Store"
              >
                <Image src="/apple.svg" alt="Apple" width={22} height={22} className="h-5 w-5 brightness-0 invert" />
                <span className="flex flex-col leading-none text-white">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Télécharger sur</span>
                  <span className="text-sm font-semibold">App Store</span>
                </span>
              </a>

              <a
                href="#"
                className="inline-flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 transition hover:bg-white/10"
                aria-label="Télécharger sur Google Play"
              >
                <Image src="/google.svg" alt="Google Play" width={22} height={22} className="h-5 w-5" />
                <span className="flex flex-col leading-none text-white">
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Télécharger sur</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LOCARS, Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
