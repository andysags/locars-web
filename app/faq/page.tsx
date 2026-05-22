"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    category: "Inscription et Vérification",
    items: [
      {
        question: "Pourquoi dois-je envoyer mes documents d’identité ?",
        answer: "Pour garantir la sécurité et la fiabilité de la plateforme. Tous les profils sont vérifiés manuellement par notre équipe avant activation."
      },
      {
        question: "Combien de temps prend la validation de mon compte ?",
        answer: "Généralement entre 24 et 72 heures. Vous serez notifié dès que votre compte sera actif."
      },
      {
        question: "Puis-je m’inscrire en tant qu’agence professionnelle ?",
        answer: "Oui. Vous devez fournir votre RCCM et votre IFU."
      }
    ]
  },
  {
    category: "Véhicules et Annonces",
    items: [
      {
        question: "Mon véhicule doit-il passer une inspection ?",
        answer: "Nous vérifions les documents et les photos. Nous pouvons demander des informations complémentaires. Le véhicule doit être en bon état et assuré."
      },
      {
        question: "Puis-je fixer mon propre tarif ?",
        answer: "Oui, vous définissez le tarif journalier/horaire et les conditions (kilométrage, caution éventuelle, etc.)."
      }
    ]
  },
  {
    category: "Réservation et Paiement",
    items: [
      {
        question: "Comment fonctionne la réservation ?",
        answer: "Vous envoyez une demande au propriétaire. Il l’accepte ou la refuse. Le paiement n’est demandé qu’après acceptation."
      },
      {
        question: "Puis-je louer un véhicule avec chauffeur ?",
        answer: "Oui, certains propriétaires proposent cette option. Cela sera explicitement mentionné sur l'annonce du véhicule."
      },
      {
        question: "Puis-je appeler le propriétaire directement depuis l'appli ?",
        answer: "L'application permet d'échanger des messages écrits et des notes vocales via le chat sécurisé. Les appels audio et vidéo ne sont pas disponibles."
      },
      {
        question: "Le propriétaire peut-il refuser ma demande ?",
        answer: "Oui, il reste maître de ses disponibilités et peut refuser sans justification."
      },
      {
        question: "Puis-je payer en espèces ?",
        answer: "Oui, pour la réservation initiale si le propriétaire l'accepte. En revanche, toutes les prolongations doivent être payées par transaction électronique via l'application."
      },
      {
        question: "Quand est-ce que je paie ?",
        answer: "Uniquement après acceptation de la demande par le propriétaire."
      }
    ]
  },
  {
    category: "Prolongation et Restitution",
    items: [
      {
        question: "Comment prolonger une location en cours ?",
        answer: "Depuis votre espace locataire, faites une demande de prolongation. Le propriétaire doit l’accepter et vous paierez le supplément."
      },
      {
        question: "Que se passe-t-il en cas de retard à la restitution ?",
        answer: "Des frais de retard seront appliqués selon les conditions du propriétaire. Contactez-le rapidement."
      }
    ]
  },
  {
    category: "Pour le Propriétaire",
    items: [
      {
        question: "Quand dois-je payer ma commission si j'ai été payé en espèces ?",
        answer: "Vous devez régler les 5 % de commission à Locars avant le 30 du mois en cours. En cas d'oubli, votre compte sera suspendu jusqu'au paiement."
      }
    ]
  },
  {
    category: "Litiges et Problèmes",
    items: [
      {
        question: "Que faire en cas de dommage sur le véhicule ?",
        answer: "Signalez-le immédiatement via l’application avec photos. Le locataire est responsable des dommages causés par sa faute."
      },
      {
        question: "Qui gère les amendes ?",
        answer: "Les amendes sont à la charge du conducteur (locataire). Le propriétaire peut transmettre les informations aux autorités si nécessaire."
      },
      {
        question: "Comment contacter le support ?",
        answer: "Via le chat de l’application ou à l’adresse support@locars.app."
      }
    ]
  },
  {
    category: "Annulation",
    items: [
      {
        question: "Puis-je annuler une réservation ?",
        answer: "Avant acceptation : gratuite. Après acceptation : selon la politique d’annulation du propriétaire (visible avant paiement)."
      }
    ]
  }
];

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-900 bg-white hover:bg-slate-50 transition"
      >
        {question}
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-slate-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-slate-700">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition">
              <Image src="/locars-logo.png" alt="Locars Logo" width={100} height={100} className="object-contain" />
            </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Retour à l'accueil
          </Link>
        </div>
      </div>

      <main className="flex-grow mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 text-center">Foire Aux Questions (FAQ)</h1>
        <p className="text-lg text-slate-600 mb-12 text-center">
          Retrouvez les réponses aux questions les plus fréquentes sur l'utilisation de LOCARS.
        </p>

        <div className="space-y-10">
          {faqs.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.items.map((item, itemIdx) => (
                  <FaqItem key={itemIdx} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
