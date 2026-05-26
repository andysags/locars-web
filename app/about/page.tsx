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
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur-sm">
            <p className="leading-relaxed">
              LOCARS relie des personnes qui ont besoin d’un véhicule avec celles qui souhaitent rentabiliser le leur.
              L’objectif est simple: rendre la location plus humaine, plus fluide et plus transparente.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-white">Notre vision</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              La location de véhicules a trop souvent été pensée comme une expérience lourde, opaque et standardisée. LOCARS s’appuie sur un fonctionnement communautaire pour simplifier l’accès à la mobilité et redonner de la valeur au véhicule déjà en circulation.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Nous construisons une plateforme sobre, sécurisée et lisible, conçue pour inspirer confiance et faciliter l’usage au quotidien, qu’on soit locataire, propriétaire ou professionnel.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">Ce qui nous distingue</h2>
            <ul className="space-y-3 text-slate-300">
              <li>• Une expérience claire et rapide</li>
              <li>• Des échanges directs entre membres</li>
              <li>• Une plateforme pensée pour la confiance</li>
              <li>• Une approche locale, utile et durable</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
