"use client";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient glow background (copied from homepage) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      <main className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>

        <section className="w-full max-w-2xl px-6 py-24 text-center">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight">Télécharger l'application Locars</h1>
          <p className="mb-8 text-slate-300">L'expérience Locars directement sur votre téléphone.</p>

          <div className="mx-auto flex w-full max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://apps.apple.com/bj/app/locars/id6763099054"
              className="group inline-flex h-14 min-w-[210px] items-center gap-3 rounded-xl bg-black px-4 transition-all hover:-translate-y-0.5 hover:opacity-95"
              aria-label="Télécharger sur App Store"
            >
              <img src="/apple.svg" alt="Apple" width={24} height={24} className="h-6 w-6 brightness-0 invert" />
              <span className="flex flex-col leading-none text-white">
                <span className="text-[11px] uppercase tracking-wide text-white/80">Télécharger sur</span>
                <span className="text-base font-semibold">App Store</span>
              </span>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.innovtechlabs.locars&pcampaignid=web_share"
              className="group inline-flex h-14 min-w-[210px] items-center gap-3 rounded-xl bg-black px-4 transition-all hover:-translate-y-0.5 hover:opacity-95"
              aria-label="Télécharger sur Google Play"
            >
              <img src="/google.svg" alt="Google Play" width={24} height={24} className="h-6 w-6" />
              <span className="flex flex-col leading-none text-white">
                <span className="text-[11px] uppercase tracking-wide text-white/80">Télécharger sur</span>
                <span className="text-base font-semibold">Google Play</span>
              </span>
            </a>
          </div>
        </section>
      </main>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
