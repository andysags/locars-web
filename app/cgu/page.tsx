import Link from "next/link";
import Image from "next/image";
import Footer from "@/app/components/Footer";

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition">
              <Image src="/locars-logo.png" alt="Locars Logo" width={100} height={100} className="object-contain" />
            </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>

      <main className="flex-grow mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 sm:p-12 shadow rounded-2xl prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold mb-6">CONDITIONS GENERALES D’UTILISATION</h1>

          <h2 className="text-xl font-semibold mt-8 mb-4">Article 1 : Conditions générales</h2>
          <h3 className="text-lg font-medium mt-6 mb-3">1.1 Mentions légales </h3>
          <p className="mb-4 text-slate-700">
            L’application mobile LOCARS est éditée et exploitée par la société INNOVTECH SAS, immatriculée au Registre du Commerce et des Sociétés de Cotonou sous le N°RB/COT/25 B 40056.
            <br />Dénomination sociale : INNOVTECH
            <br />Siège social : Ilot 1000 E, Djidjè – En face de la 2ème rue après le commissariat d’Aidjedo – Cotonou, République du Bénin
            <br />Capital social : 1.000.000 FCFA
            <br />Hébergeur : AWS
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">1.2 Définitions</h3>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-slate-700">
            <li><strong>Plateforme</strong> : application et services numériques LOCARS permettant la mise en relation entre propriétaires de véhicules et locataires</li>
            <li><strong>Utilisateur</strong> : toute personne physique ou morale disposant d’un compte sur la Plateforme LOCARS</li>
            <li><strong>Propriétaire</strong> : utilisateur proposant un véhicule à la location via la Plateforme sous sa propre responsabilité</li>
            <li><strong>Locataire</strong> : utilisateur réservant et utilisant un véhicule mis en location via la Plateforme</li>
            <li><strong>Location</strong> : contrat conclu directement entre un propriétaire et un locataire pour l’usage temporaire d’un véhicule via la Plateforme</li>
          </ul>

          <h3 className="text-lg font-medium mt-6 mb-3">1.3 Acceptation et objet des CGU</h3>
          <p className="mb-4 text-slate-700">
            Les présentes CGU définissent les conditions d’accès et d’utilisation de la plateforme LOCARS... En accédant à la plateforme, l'utilisateur accepte ces CGU sans réserve.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Article 2 : Accès à la plateforme et aux services</h2>
          <p className="mb-4 text-slate-700">
            LOCARS est un service de mise en relation. LOCARS n’est pas propriétaire des véhicules, n'est pas partie aux contrats de location, et n’intervient pas dans leur exécution.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Article 3 : Inscription et création du compte utilisateur</h2>
          <p className="mb-4 text-slate-700">La création de compte est gratuite. Réservée aux majeurs ou personnes morales. L'utilisateur est responsable de ses identifiants.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Article 4 : Accès aux services de la plateforme</h2>
          <p className="mb-4 text-slate-700">
            Paiement et commission: LOCARS prélève une commission de 5% sur chaque transaction. L'annulation est gratuite jusqu'à 7 jours avant. Assurance est sous la responsabilité exclusive du propriétaire. Etats des lieux obligatoires.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Article 5 : Responsabilité de LOCARS</h2>
          <p className="mb-4 text-slate-700">
            LOCARS ne pourra être tenue responsable des dommages matériels ou immatériels, des litiges, de la qualité des véhicules, ou des accidents.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Article 6 : Litiges</h2>
          <p className="mb-4 text-slate-700">Privilégier la résolution amiable. A défaut, juridictions béninoises.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Article 7 : Propriété intellectuelle</h2>
          <p className="mb-6 text-slate-700">
            Tous les éléments de la plateforme sont propriétés de INNOVTECH SAS. Toute utilisation non autorisée est interdite.
            <br /><br />
            <strong>Date de dernière mise à jour : 01 mai 2026</strong>
          </p>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
