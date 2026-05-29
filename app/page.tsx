'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  LifebuoyIcon,
  HomeIcon,
  TruckIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  StarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  ChevronDownIcon,
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
                  Trouvez, réservez
                </span>
                <br />
                <span className="relative inline-block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  <span className="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full blur-lg opacity-70"></span>
                  et louez une voiture facilement
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-400 leading-relaxed max-w-xl font-light tracking-wide">
                Locars est une plateforme de réservation et de mise en location de voitures qui connecte les propriétaires de véhicules aux personnes à la recherche d’une solution de mobilité simple, rapide et fiable.              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
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
                  <Image src="/google.svg" alt="Google Play" width={24} height={24} className="h-6 w-6" />
                  <span className="flex flex-col leading-none text-white">
                    <span className="text-[11px] uppercase tracking-wide text-white/80">Télécharger sur</span>
                    <span className="text-base font-semibold">Google Play</span>
                  </span>
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
                  src="/voiture.jpg"
                />


              </div>
            </div>
          </div>
        </section>

        {/* Value Props Section */}
        <section id="why-us" className="scroll-mt-28 py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Pourquoi Locars ?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
              Nous facilitons la mise en relation entre clients et loueurs, avec un cadre clair pour réserver en toute confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Renters */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Nos engagements</h3>
                </div>

                <ul className="space-y-6">
                  {[
                    { Icon: ShieldCheckIcon, title: 'Mise en relation fiable', desc: 'Locars facilite la rencontre entre clients et loueurs vérifiés sur la plateforme' },
                    { Icon: CheckBadgeIcon, title: 'Tarifs définis par les loueurs', desc: 'Les prix sont fixés par chaque loueur selon son véhicule et ses conditions' },
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
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <LifebuoyIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Service continu</h3>
                </div>

                <ul className="space-y-6">
                  {[
                    { Icon: ClockIcon, title: 'Réservation simple et flexible', desc: 'Choisissez votre période et soumettez votre demande directement au loueur' },
                    { Icon: ShieldCheckIcon, title: 'Support plateforme', desc: 'Notre équipe vous accompagne sur l\'usage de la plateforme et le suivi des demandes' },
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
        <section id="how-it-works" className="scroll-mt-28 py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Louez en 3 étapes simples
            </h2>
            <p className="text-gray-400 text-lg font-light">Un parcours de réservation clair, de la recherche à la confirmation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:max-w-5xl lg:mx-auto justify-center">
            {/* Renters */}
            <div className="space-y-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold">
                <MagnifyingGlassIcon className="w-8 h-8 text-blue-400" />
                Pour les clients
              </h3>
              <div className="space-y-8">
                {[
                  { num: 1, title: 'Choisir une localisation', desc: 'Choisissez votre localisation et trouvez la meilleure voiture parmi les véhicules disponibles' },
                  { num: 2, title: 'Date de réservation', desc: 'Sélectionnez votre date et votre heure de récupération pour réserver instantanément' },
                  { num: 3, title: 'Réserver votre voiture', desc: 'Confirmez votre réservation puis convenez avec le loueur des modalités de récupération' },
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
                Pour les loueurs
              </h3>
              <div className="space-y-8">
                {[
                  { num: 1, title: 'Publiez', desc: 'Créez votre annonce en 5 minutes' },
                  { num: 2, title: 'Validez', desc: 'Acceptez les demandes de location' },
                  { num: 3, title: 'Gagnez', desc: 'Recevez vos revenus en temps réel' },
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
