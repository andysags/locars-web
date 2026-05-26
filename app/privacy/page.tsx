export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300/70">Juridique</p>
            <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight whitespace-nowrap bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              Politique de confidentialité
            </h1>
          </div>
         
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-5 text-white">Définitions</h2>
            <ul className="space-y-3 text-slate-300 leading-relaxed">
            <li><strong>LOCARS</strong> : plateforme numérique de mise en relation permettant la location de véhicules entre particuliers et professionnels</li>
            <li><strong>Données personnelles</strong> : toute information relative à une personne identifiée ou identifiable</li>
            <li><strong>Traitement</strong> : toute opération appliquée aux données (collecte, enregistrement, utilisation, transmission, suppression)</li>
            <li><strong>Utilisateur</strong> : toute personne accédant à la plateforme LOCARS, en tant que locataire, propriétaire ou visiteur</li>
            <li><strong>Propriétaire</strong> : utilisateur mettant un véhicule en location</li>
            <li><strong>Locataire</strong> : utilisateur réservant un véhicule</li>
            <li><strong>Plateforme</strong> : application mobile et site internet LOCARS</li>
            <li><strong>Société</strong> : INNOVTECH SAS, éditrice et exploitante de la plateforme</li>
            <li><strong>Personne concernée</strong> : toute personne dont les données sont traitées</li>
          </ul>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 1 : Préambule</h2>
            <p className="mb-4 text-slate-300 leading-relaxed">
              La plateforme LOCARS est éditée par INNOVTECH SAS, immatriculée au RCCM de Cotonou sous le numéro RB/COT/25 B 40056.
              <br />
              LOCARS agit en qualité d’intermédiaire technique pour la mise en relation entre utilisateurs, tout en assurant la collecte et le traitement des données nécessaires au fonctionnement de la plateforme.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">1.1. À quoi sert cette politique de confidentialité ?</h3>
            <p className="mb-4 text-slate-300 leading-relaxed">
              La présente politique de confidentialité a pour objet d’informer l’utilisateur, de manière claire et transparente, sur la manière dont ses données personnelles sont collectées et traitées dans le cadre de l’utilisation de la plateforme LOCARS.
              <br />Elle vise notamment à préciser :
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-slate-300">
              <li>les catégories de données personnelles collectées, notamment dans le cadre de la création de compte, de la vérification d’identité et des opérations de location </li>
              <li>les finalités pour lesquelles ces données sont utilisées, en particulier la mise en relation entre utilisateurs, la gestion des réservations et la sécurisation des transactions </li>
              <li>les destinataires des données, y compris les autres utilisateurs, les prestataires techniques et, le cas échéant, les autorités compétentes </li>
              <li>les droits dont dispose l’utilisateur sur ses données personnelles et les modalités d’exercice de ces droits </li>
              <li>les mesures mises en œuvre pour assurer la sécurité et la confidentialité des données </li>
              <li>l’utilisation des cookies et technologies similaires </li>
            </ul>
            <p className="mb-6 text-slate-300 leading-relaxed">La présente politique s’applique en complément des CGU de la plateforme LOCARS et, le cas échéant, de tout autre document contractuel applicable.</p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">1.2. Qui utilise nos services ?</h3>
            <p className="mb-4 text-slate-300 leading-relaxed">
              Le terme « Propriétaire » désigne tout utilisateur de la plateforme LOCARS mettant un véhicule en location, qu’il s’agisse d’un particulier ou d’un professionnel.
              <br/>Le terme « Locataire » désigne toute personne utilisant la plateforme LOCARS afin de rechercher, réserver ou louer un véhicule mis à disposition par un Propriétaire.
              <br/>Le terme « Utilisateur » désigne indifféremment tout Propriétaire, Locataire ou toute personne accédant à la plateforme LOCARS, que ce soit à des fins de consultation, de réservation ou d’utilisation des services.
            </p>
            <p className="mb-6 text-slate-300 leading-relaxed">Les Propriétaires, les Locataires ainsi que toute autre personne physique ou morale utilisant la plateforme sont collectivement désignés dans la présente politique par les termes « Utilisateur », « vous », « votre » ou « vos ».</p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 2 : Réglementation en matière de collecte et de traitement des données</h2>
            <p className="mb-4 text-slate-300 leading-relaxed">
              Conformément à l’article 383 de la loi n° 2017-20 portant Code du numérique en République du Bénin, la collecte et le traitement des données personnelles sur la plateforme LOCARS sont réalisés selon les principes suivants :
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-slate-300">
              <li>Les données sont traitées de manière licite, loyale, transparente et pour des finalités déterminées liées notamment à la création de compte, la mise en relation entre utilisateurs, la gestion des réservations, la vérification d’identité, la sécurité et la prévention des fraudes.</li>
              <li>Elles sont limitées au strict nécessaire, exactes et mises à jour si besoin. Toute donnée inexacte peut être corrigée ou supprimée.</li>
              <li>Les données sont conservées uniquement pendant la durée nécessaire aux finalités poursuivies, sauf obligations légales ou impératifs de preuve.</li>
            </ul>
            <p className="mb-6 text-slate-300 leading-relaxed">
              Des mesures techniques et organisationnelles appropriées sont mises en place afin d’assurer la sécurité et la confidentialité des données.<br/>
              Les données sensibles ne sont traitées que dans les cas strictement autorisés par la loi, notamment avec le consentement explicite de la personne concernée ou lorsqu’un traitement est nécessaire à une obligation légale, à la sécurité ou à la prévention de la fraude.<br/>
              En cas de contradiction avec les dispositions légales en vigueur, LOCARS s’engage à se conformer immédiatement à la réglementation applicable.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 3 : Gestion des données personnelles</h2>
            <p className="mb-4 text-slate-300 leading-relaxed">
              Lorsque vous utilisez la plateforme LOCARS ou interagissez avec ses services, nous sommes amenés à collecter et traiter certaines données personnelles vous concernant. Cette collecte peut intervenir :
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-slate-300">
              <li>pour le compte de LOCARS, lorsque vous utilisez directement la plateforme (création de compte, recherche ou réservation d’un véhicule, gestion de location)</li>
              <li>entre utilisateurs, lorsque vos données sont transmises dans le cadre d’une mise en relation entre un propriétaire et un locataire</li>
            </ul>
            <p className="mb-6 text-slate-300 leading-relaxed">Cette distinction est importante, notamment en matière de responsabilité et de traitement des données.</p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">3.1. Données collectées lors de l’utilisation de la plateforme</h3>
            <p className="mb-4 text-slate-300 leading-relaxed">
              Que vous soyez propriétaire ou locataire, nous collectons des données personnelles lorsque vous les fournissez volontairement, notamment lors de :
              <br />- la création d’un compte utilisateur 
              <br />- la mise en ligne ou la réservation d’un véhicule 
              <br />- la gestion d’une location 
              <br />- l’utilisation des fonctionnalités de la plateforme 
              <br />Ces données peuvent inclure, sans s’y limiter : nom et prénom, numéro de téléphone, adresse e-mail, date de naissance, documents d’identité et permis de conduire, informations relatives au véhicule, toute autre information nécessaire.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">3.2. Qui collecte et traite vos données</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              La société INNOVTECH SAS, éditrice et exploitante de la plateforme LOCARS, agit en qualité de Responsable du traitement. Elle définit les finalités du traitement, notamment la gestion des locations, la sécurisation des transactions, la prévention des fraudes et l’amélioration des services, et veille à leur conformité avec la réglementation applicable.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">3.3. Données enregistrées lors de votre utilisation</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              Lors de l’accès et de l’utilisation de la plateforme LOCARS, certaines données techniques sont collectées automatiquement (adresse IP, géolocalisation, fonctionnalités utilisées...) pour le fonctionnement et la sécurité de la plateforme, la prévention de la fraude et des comportements abusifs, l’amélioration des services, etc.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">3.4. Données que vous fournissez lors de certaines actions</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              LOCARS peut collecter les informations lorsque vous utilisez la plateforme (nom, prénom, e-mail, identité, véhicule, etc.) pour la création de compte, les réservations, les états des lieux.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">3.5. Informations demandées aux propriétaires</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              Informations spécifiques au véhicule, documents administratifs, coordonnées bancaires, justificatifs d’identité.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">3.6. À quoi servent les données que nous collectons</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              Création de comptes, mise en relation, gestion des réservations, vérification, support, sécurité.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">3.7. Avec qui partageons-nous vos données ?</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              Autres utilisateurs (pour location), prestataires techniques, autorités compétentes si obligation légale. LOCARS ne vend aucune donnée personnelle.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">3.8. Sécurité des données</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              LOCARS met en œuvre des mesures techniques et organisationnelles adaptées afin de protéger les données personnelles contre la perte, la modification ou l'accès non autorisé.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Article 4 : Droits et modalités de modification des données</h2>
            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">4.1. Droits de l’utilisateur</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              Vous disposez du Droit d’accès, de rectification, à l’effacement, à la limitation, à la portabilité, et d’opposition.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">4.2. Modification ou suppression de vos données</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              Contactez-nous à contact@locars.app ou via la plateforme.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">4.3. Mise à jour de la politique</h3>
            <p className="mb-6 text-slate-300 leading-relaxed">
              Cette politique peut être modifiée à tout moment pour tenir compte des évolutions légales.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3 text-white">4.4. Moyens de recours</h3>
            <p className="text-slate-300 leading-relaxed">
              Vous pouvez contacter l’Autorité de Protection des Données Personnelles (APDP) du Bénin à : contact@apdp.bj
              <br /><br />
              <strong className="text-white">Date d’entrée en vigueur : 01 mai 2026</strong>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
