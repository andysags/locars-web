import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`relative z-10 bg-slate-900 text-white py-16 sm:py-20 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image src="/locars-logo.png" alt="Locars Logo" width={120} height={40} className="object-contain" />
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Ilot 1000 E, Djidjè - Cotonou,
                  <br />
                  République du Bénin
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-accent flex-shrink-0" />
                <p className="text-sm text-gray-300">+229 XX XX XX XX</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-accent">✉</span>
                <p className="text-sm text-gray-300">contact@locars.app</p>
              </div>
            </div>
          </div>

          {/* Légal & Support */}
          <div>
            <h4 className="font-bold text-white mb-4">Légal & Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-300 hover:text-accent transition"
                >
                  Foire Aux Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-300 hover:text-accent transition"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/cgu"
                  className="text-sm text-gray-300 hover:text-accent transition"
                >
                  Conditions Générales d'Utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/delete-account"
                  className="text-sm text-gray-300 hover:text-accent transition"
                >
                  Demande de suppression de compte
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-300 hover:text-accent transition"
                >
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-white mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-accent transition flex items-center justify-center"
              >
                <Image src="/facebook.svg" alt="Facebook Locars" width={20} height={20} />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-accent transition flex items-center justify-center"
              >
                <Image src="/instagram.svg" alt="Instagram Locars" width={20} height={20} />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-accent transition flex items-center justify-center"
              >
                <Image src="/x.svg" alt="X Locars" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © 2026 LOCARS - Tous droits réservés. INNOVTECH SAS
          </p>
        </div>
      </div>
    </footer>
  );
}
