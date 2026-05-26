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

      {/* Header is provided by the global layout Header component */}

      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <div className="flex flex-col items-start z-10 space-y-8 animate-fade-up">

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
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-black/80 hover:bg-black/90 rounded-lg shadow-lg"
                  aria-label="Télécharger sur Google Play"
                >
                  <img src="/google-play-badge.svg" alt="Google Play" className="h-8" />
                </a>

                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-black/80 hover:bg-black/90 rounded-lg shadow-lg"
                  aria-label="Télécharger sur App Store"
                >
                  <img src="/app-store-badge.svg" alt="App Store" className="h-8" />
                </a>
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
                  src="/vendeur-au-centre-concession-automobile-aidant-conjoints-noirs-choisir-nouveau-vehicule-familial-expliquant-caracteristiques-automobile-jeune-couple-afro-americain-tout-se-tenant-dans-salle-exposition-automobile_568137-639.avif"
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
                  { num: 1, title: 'Téléchargez', desc: 'Inscrivez-vous en 2 minutes' },
                  { num: 2, title: 'Cherchez', desc: 'Trouvez votre voiture parfaite' },
                  { num: 3, title: 'Roulez', desc: 'Déverrouillez via l\'app et partez' },
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
                  { num: 1, title: 'Publiez', desc: 'Créez votre annonce en 5 minutes' },
                  { num: 2, title: 'Validez', desc: 'Acceptez les demandes de location' },
                  { num: 3, title: 'Gagnez', desc: 'Recevez vos revenus chaque semaine' },
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

        {/* Removed Testimonials, inline FAQ and site CTA — moved FAQ to a dedicated page */}
      </main>

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
