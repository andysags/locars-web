"use client";

import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    category: "Inscription et Vérification",
    items: [
      {
        question: "Pourquoi dois-je envoyer mes documents d’identité ?",
        answer:
          "Pour garantir la sécurité et la fiabilité de la plateforme. Tous les profils sont vérifiés manuellement par notre équipe avant activation.",
      },
      {
        question: "Combien de temps prend la validation de mon compte ?",
        answer:
          "Généralement entre 24 et 72 heures. Vous serez notifié dès que votre compte sera actif.",
      },
      {
        question: "Puis-je m’inscrire en tant qu’agence professionnelle ?",
        answer: "Oui. Vous devez fournir votre RCCM et votre IFU.",
      },
    ],
  },
  {
    category: "Véhicules et Annonces",
    items: [
      {
        question: "Mon véhicule doit-il passer une inspection ?",
        answer:
          "Nous vérifions les documents et les photos. Nous pouvons demander des informations complémentaires. Le véhicule doit être en bon état et assuré.",
      },
      {
        question: "Puis-je fixer mon propre tarif ?",
        answer:
          "Oui, vous définissez le tarif journalier/horaire et les conditions (kilométrage, caution éventuelle, etc.).",
      },
    ],
  },
  {
    category: "Réservation et Paiement",
    items: [
      {
        question: "Comment fonctionne la réservation ?",
        answer:
          "Vous envoyez une demande au propriétaire. Il l’accepte ou la refuse. Le paiement n’est demandé qu’après acceptation.",
      },
      {
        question: "Puis-je louer un véhicule avec chauffeur ?",
        answer:
          "Oui, certains propriétaires proposent cette option. Cela sera explicitement mentionné sur l'annonce du véhicule.",
      },
      {
        question: "Puis-je appeler le propriétaire directement depuis l'appli ?",
        answer:
          "L'application permet d'échanger des messages écrits et des notes vocales via le chat sécurisé. Les appels audio et vidéo ne sont pas disponibles.",
      },
      {
        question: "Le propriétaire peut-il refuser ma demande ?",
        answer:
          "Oui, il reste maître de ses disponibilités et peut refuser sans justification.",
      },
      {
        question: "Puis-je payer en espèces ?",
        answer:
          "Oui, pour la réservation initiale si le propriétaire l'accepte. En revanche, toutes les prolongations doivent être payées par transaction électronique via l'application.",
      },
      {
        question: "Quand est-ce que je paie ?",
        answer:
          "Uniquement après acceptation de la demande par le propriétaire.",
      },
    ],
  },
  {
    category: "Prolongation et Restitution",
    items: [
      {
        question: "Comment prolonger une location en cours ?",
        answer:
          "Depuis votre espace locataire, faites une demande de prolongation. Le propriétaire doit l’accepter et vous paierez le supplément.",
      },
      {
        question: "Que se passe-t-il en cas de retard à la restitution ?",
        answer:
          "Des frais de retard seront appliqués selon les conditions du propriétaire. Contactez-le rapidement.",
      },
    ],
  },
  {
    category: "Pour le Propriétaire",
    items: [
      {
        question:
          "Quand dois-je payer ma commission si j'ai été payé en espèces ?",
        answer:
          "Vous devez régler les 5 % de commission à Locars avant le 30 du mois en cours. En cas d'oubli, votre compte sera suspendu jusqu'au paiement.",
      },
    ],
  },
  {
    category: "Litiges et Problèmes",
    items: [
      {
        question: "Que faire en cas de dommage sur le véhicule ?",
        answer:
          "Signalez-le immédiatement via l’application avec photos. Le locataire est responsable des dommages causés par sa faute.",
      },
      {
        question: "Qui gère les amendes ?",
        answer:
          "Les amendes sont à la charge du conducteur (locataire). Le propriétaire peut transmettre les informations aux autorités si nécessaire.",
      },
      {
        question: "Comment contacter le support ?",
        answer: "Via le chat de l’application ou à l’adresse support@locars.app.",
      },
    ],
  },
  {
    category: "Annulation",
    items: [
      {
        question: "Puis-je annuler une réservation ?",
        answer:
          "Avant acceptation : gratuite. Après acceptation : selon la politique d’annulation du propriétaire (visible avant paiement).",
      },
    ],
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left font-medium text-white hover:bg-white/5 transition"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-slate-400 shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-white/10 px-5 pb-5 pt-0 text-slate-300">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto w-full max-w-5xl px-6 md:px-12 py-20 md:py-24">
        <div className="text-center mb-14">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-300/70">
            Support
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
            Foire Aux Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Retrouvez les réponses aux questions les plus fréquentes sur l'utilisation de LOCARS.
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map((category, idx) => (
            <section key={idx}>
              <h2 className="mb-4 text-2xl font-bold text-white">{category.category}</h2>
              <div className="space-y-3">
                {category.items.map((item, itemIdx) => (
                  <FaqItem key={itemIdx} question={item.question} answer={item.answer} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-slate-400">
          <p>
            Besoin d'aide supplémentaire ?{" "}
            <a href="/contact" className="text-white underline underline-offset-4">
              Contactez-nous
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
