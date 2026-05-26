export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300/70">Juridique</p>
            <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight whitespace-nowrap bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              Conditions Générales d’Utilisation
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 1 : Conditions générales</h2>
            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">1.1 Mentions légales</h3>
            <p className="mb-4 text-slate-300 leading-relaxed">
              L’application mobile LOCARS est éditée et exploitée par la société INNOVTECH SAS, immatriculée au Registre du Commerce et des Sociétés de Cotonou sous le N°RB/COT/25 B 40056.
              <br />Dénomination sociale : INNOVTECH
              <br />Siège social : Ilot 1000 E, Djidjè – En face de la 2ème rue après le commissariat d’Aidjedo – Cotonou, République du Bénin
              <br />Capital social : 1.000.000 FCFA
              <br />Hébergeur : AWS
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">1.2 Définitions</h3>
            <ul className="space-y-3 text-slate-300 leading-relaxed">
              <li><strong>Plateforme</strong> : application et services numériques LOCARS permettant la mise en relation entre propriétaires de véhicules et locataires</li>
              <li><strong>Utilisateur</strong> : toute personne physique ou morale disposant d’un compte sur la Plateforme LOCARS</li>
              <li><strong>Propriétaire</strong> : utilisateur proposant un véhicule à la location via la Plateforme sous sa propre responsabilité</li>
              <li><strong>Locataire</strong> : utilisateur réservant et utilisant un véhicule mis en location via la Plateforme</li>
              <li><strong>Location</strong> : contrat conclu directement entre un propriétaire et un locataire pour l’usage temporaire d’un véhicule via la Plateforme</li>
            </ul>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">1.3 Acceptation et objet des CGU</h3>
            <p className="mb-4 text-slate-300 leading-relaxed">
              Les présentes CGU définissent les conditions d’accès et d’utilisation de la plateforme LOCARS... En accédant à la plateforme, l'utilisateur accepte ces CGU sans réserve.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 2 : Accès à la plateforme et aux services</h2>
            <p className="text-slate-300 leading-relaxed">
              LOCARS est un service de mise en relation. LOCARS n’est pas propriétaire des véhicules, n'est pas partie aux contrats de location, et n’intervient pas dans leur exécution.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 3 : Inscription et création du compte utilisateur</h2>
            <p className="text-slate-300 leading-relaxed">La création de compte est gratuite. Réservée aux majeurs ou personnes morales. L'utilisateur est responsable de ses identifiants.</p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 4 : Accès aux services de la plateforme</h2>
            <p className="text-slate-300 leading-relaxed">
              Paiement et commission: LOCARS prélève une commission de 5% sur chaque transaction. L'annulation est gratuite jusqu'à 7 jours avant. Assurance est sous la responsabilité exclusive du propriétaire. Etats des lieux obligatoires.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 5 : Responsabilité de LOCARS</h2>
            <p className="text-slate-300 leading-relaxed">
              LOCARS ne pourra être tenue responsable des dommages matériels ou immatériels, des litiges, de la qualité des véhicules, ou des accidents.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 6 : Litiges</h2>
            <p className="text-slate-300 leading-relaxed">Privilégier la résolution amiable. A défaut, juridictions béninoises.</p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 7 : Propriété intellectuelle</h2>
            <p className="text-slate-300 leading-relaxed">
              Tous les éléments de la plateforme sont propriétés de INNOVTECH SAS. Toute utilisation non autorisée est interdite.
              <br /><br />
              <strong className="text-white">Date de dernière mise à jour : 01 mai 2026</strong>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
