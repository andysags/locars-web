'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  SparklesIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  StarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  KeyIcon,
  ChevronDownIcon,
  HomeIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient glow background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      {/* TopNavBar */}
      <nav className="sticky top-0 w-full z-[100] h-20 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-blue-500/5 border-b border-blue-500/10">
        <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-full">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition group">
            <img
              alt="Locars Logo"
              className="h-20 w-auto"
              src="/locars-logo.png"
            />
          </Link>

          {/* Navigation Links (Web) */}
          <div className="hidden md:flex space-x-1 items-center h-full">
            {[
              { label: 'Accueil', href: '/' },
              { label: 'Comment ça marche', href: '#how-it-works' },
              { label: 'Pourquoi nous', href: '#why-us' },
              { label: 'Devenir loueur', href: '/become-host' },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-200 relative group">
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Trailing Action */}
          <Link href="/become-host" className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95">
            Devenir loueur
          </Link>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <div className="flex flex-col items-start z-10 space-y-8 animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm font-semibold text-blue-300">Le leader de l'autopartage en Afrique</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-black leading-snug">
                <span className="bg-gradient-to-b from-white via-white to-white bg-clip-text text-transparent">
                  La mobilité réinventée
                </span>
                <br />
                <span className="relative inline-block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  <span className="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full blur-lg opacity-70"></span>
                  par la communauté
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-400 leading-relaxed max-w-xl font-light tracking-wide">
                Louez des voitures à vos voisins ou rentabilisez la vôtre. Expérience transparente, sécurisée et 100% communautaire.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-semibold text-white transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
                  <ArrowDownTrayIcon className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  Télécharger maintenant
                </button>

                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-white transition-all duration-300 backdrop-blur-sm group">
                  Découvrir
                  <ArrowRightIcon className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative z-10 group">
              {/* Floating card decoration */}
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-all duration-500"></div>

              {/* Main image */}
              <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent z-10"></div>
                <img
                  alt="Premium electric vehicle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9vF3WM51fyOb_ZK57nR4Uv4F6xUnsqy3_YXix4Rl1MacAJwOFDBTtZZZxLhcDMDWXPKH2VnDpdscB14rJYjqTfiJuIIoyF9iunAdzBpe_guJ2KuwlQDGgfAs30WS47siDVHIbG8XjWg6E2CMDlPbv1bXwcZhZKtkrVSFGVzFdffbn1AsNqhjys4w-D0mHDfJy_WIQzIa5nqT7nXay9YmSqsUzkF00THkbtWpxhyv2oJMVS9cdKV2tsh2yv7f1vqzqtIOnTFqb-337"
                />


              </div>
            </div>
          </div>
        </section>

        {/* Value Props Section */}
        <section id="why-us" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Une plateforme, deux rôles
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
              Que vous louiez ou que vous partagiez, l'expérience est pensée pour vous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Renters */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <TruckIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Pour les locataires</h3>
                </div>

                <ul className="space-y-6">
                  {[
                    { Icon: CurrencyDollarIcon, title: 'Prix transparents', desc: 'Aucun frais caché, aucune surprise.' },
                    { Icon: CheckCircleIcon, title: 'Choix illimité', desc: 'Des citadines aux SUV premium.' },
                    { Icon: ClockIcon, title: 'Flexibilité totale', desc: '1h, 1 jour, 1 semaine — à vous de choisir.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 group/item">
                      <item.Icon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>

            {/* Owners */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Pour les propriétaires</h3>
                </div>

                <ul className="space-y-6">
                  {[
                    { Icon: CurrencyDollarIcon, title: 'Revenus passifs', desc: 'Jusqu\'à 800€/mois, sans effort.' },
                    { Icon: ShieldCheckIcon, title: 'Assurance comprise', desc: 'Protégé par Allianz tous risques.' },
                    { Icon: ChartBarIcon, title: 'Contrôle total', desc: 'Vos tarifs, vos conditions, vos règles.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <item.Icon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Comment ça marche
            </h2>
            <p className="text-gray-400 text-lg font-light">3 étapes simples pour commencer</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Renters */}
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold">
                <TruckIcon className="w-8 h-8 text-blue-400" />
                Louer une voiture
              </h3>
              <div className="space-y-8">
                {[
                  { num: 1, title: 'Téléchargez', desc: 'Inscrivez-vous en 2 minutes.' },
                  { num: 2, title: 'Cherchez', desc: 'Trouvez votre voiture parfaite.' },
                  { num: 3, title: 'Roulez', desc: 'Déverrouillez via l\'app et partez.' },
                ].map((step, idx) => (
                  <div key={idx} className="relative flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm transition-all duration-300 ${
                        idx === 2 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50' 
                          : 'bg-white/10 border border-white/20 text-gray-300 group-hover:border-blue-500/50'
                      }`}>
                        {step.num}
                      </div>
                      {idx < 2 && <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500/50 to-transparent mt-2"></div>}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-gray-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owners */}
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold">
                <HomeIcon className="w-8 h-8 text-amber-400" />
                Partager sa voiture
              </h3>
              <div className="space-y-8">
                {[
                  { num: 1, title: 'Publiez', desc: 'Créez votre annonce en 5 minutes.' },
                  { num: 2, title: 'Validez', desc: 'Acceptez les demandes de location.' },
                  { num: 3, title: 'Gagnez', desc: 'Recevez vos revenus chaque semaine.' },
                ].map((step, idx) => (
                  <div key={idx} className="relative flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm transition-all duration-300 ${
                        idx === 2 
                          ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-500/50' 
                          : 'bg-white/10 border border-white/20 text-gray-300 group-hover:border-amber-500/50'
                      }`}>
                        {step.num}
                      </div>
                      {idx < 2 && <div className="w-0.5 h-12 bg-gradient-to-b from-amber-500/50 to-transparent mt-2"></div>}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-gray-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Ce qu'ils en pensent
            </h2>
            <p className="text-gray-400 text-lg font-light">Vrais avis de vrais utilisateurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stars: 5,
                text: "Génial ! Louer une voiture n'a jamais été aussi simple et rapide.",
                name: 'Sophie M.',
                role: 'Locataire, Cotonou',
              },
              {
                stars: 5,
                text: "Ma voiture me rapporte 400€/mois. Incroyable ! Et l'assurance Allianz c'est vraiment rassurant.",
                name: 'Thomas L.',
                role: 'Propriétaire, Abomey-Calavi',
              },
              {
                stars: 5,
                text: "Meilleure alternative aux agences. Plus humain, plus transparent, plus juste.",
                name: 'Julie D.',
                role: 'Locataire, Porto-Novo',
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">{testimonial.text}</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Comment fonctionne l\'assurance avec Allianz ?',
                answer:
                  'Votre véhicule est assuré 24/7 pendant chaque location. Couverture tous risques, assistance 24/7. Aucun frais supplémentaire.',
              },
              {
                question: 'Qui fixe les prix de location ?',
                answer:
                  'Les propriétaires fixent leurs tarifs librement. Nous proposons des recommandations basées sur la demande pour maximiser vos revenus.',
              },
              {
                question: 'Quels sont les prérequis pour louer ?',
                answer:
                  '21 ans minimum, permis valide depuis 2 ans, carte bancaire. Vérification instantanée via vidéo.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
              >
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-white text-left">{faq.question}</span>
                  <ChevronDownIcon className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-gray-400 border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-sm rounded-2xl p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                Prêt à rejoindre la communauté ?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto font-light">
                Plus de 10 000 utilisateurs nous font confiance. Devenez locataire ou propriétaire aujourd'hui.
              </p>
              <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-white transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto">
                <ArrowDownTrayIcon className="w-5 h-5" />
                Télécharger l'application
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6 md:px-12 bg-gradient-to-b from-transparent to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition">
                <img
                  alt="Locars"
                  className="h-14 w-auto"
                  src="/locars-logo.png"
                />
              </Link>
              <p className="text-gray-500 text-sm">La mobilité réinventée par la communauté.</p>
            </div>

            {[
              {
                title: 'Produit',
                links: [
                  { label: 'Pour locataires', href: '/' },
                  { label: 'Pour propriétaires', href: '/become-host' },
                  { label: 'Tarifs', href: '#' },
                ],
              },
              {
                title: 'Entreprise',
                links: [
                  { label: 'À propos', href: '#' },
                  { label: 'Blog', href: '#' },
                  { label: 'Carrières', href: '#' },
                ],
              },
              {
                title: 'Légal',
                links: [
                  { label: 'Conditions', href: '/cgu' },
                  { label: 'Confidentialité', href: '/privacy' },
                  { label: 'Contact', href: '/contact' },
                ],
              },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((item, i) => (
                    <li key={i}>
                      <Link href={item.href} className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex justify-between items-center text-sm text-gray-500">
            <p>© 2025 Locars. Tous droits réservés.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
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

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
