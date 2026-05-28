export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300/70">À propos</p>
            <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight whitespace-nowrap bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              La mobilité réinventée
            </h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm lg:col-span-2">
            <div className="space-y-6">
            <p className="text-slate-300 leading-relaxed mb-4">
              Locars est une plateforme de réservation et de mise en location de voitures qui connecte les propriétaires de véhicules aux personnes à la recherche d’une solution de mobilité simple, rapide et fiable.
            </p>

            <p className="text-slate-300 leading-relaxed mb-4">
              Notre plateforme permet aussi bien aux particuliers qu’aux professionnels, notamment les agences de location, de proposer leurs véhicules à la location en toute simplicité. Que ce soit pour un déplacement professionnel, un voyage, un événement ou un besoin ponctuel, Locars facilite la réservation de voitures adaptées à chaque besoin.
            </p>

            <p className="text-slate-300 leading-relaxed mb-4">
              Nous mettons à disposition une solution moderne et sécurisée permettant :
            </p>

            <ul className="list-disc pl-5 text-slate-300 mb-4 space-y-1">
              <li>aux clients de rechercher et réserver facilement un véhicule ;</li>
              <li>aux propriétaires de rentabiliser leurs voitures ;</li>
              <li>aux agences de location de développer leur visibilité et leurs activités.</li>
            </ul>

            <p className="text-slate-300 leading-relaxed mb-4">
              Chez Locars, nous croyons en une mobilité plus accessible, flexible et collaborative. Notre objectif est de créer une expérience fluide et de confiance pour tous les utilisateurs grâce à une plateforme intuitive, transparente et performante.
            </p>

            </div>
            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Notre vision</h3>
            <p className="text-slate-300 leading-relaxed">
              Devenir la plateforme de référence pour la réservation et la mise en location de véhicules, en connectant particuliers et professionnels au sein d’un écosystème de mobilité moderne et accessible.
            </p>
          </section>
          <div className="space-y-6 lg:pt-2">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-3">Notre mission</h3>
              <p className="text-slate-300 leading-relaxed">
                Simplifier la location de voitures en offrant une plateforme accessible qui rapproche les conducteurs des propriétaires de véhicules.
              </p>
            </section>

            <section className="self-start rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-3">Nos valeurs</h3>
              <ul className="list-disc space-y-1 pl-5 text-slate-300">
                <li>Confiance</li>
                <li>Simplicité</li>
                <li>Sécurité</li>
                <li>Innovation</li>
                <li>Satisfaction client</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
