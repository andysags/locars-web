🇬🇧 [English](README.md) | 🇫🇷 Français

<p align="center">
  <img src="public/locars-logo.png" alt="Logo Locars" width="96" />
</p>

# Locars Web

> Site web et back-office d'administration de **Locars**, une marketplace de location de voitures qui met en relation des locataires avec des particuliers et des agences de location.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Storage-FFCA28?logo=firebase&logoColor=black)

## À propos

Locars est une plateforme de location de voitures exploitée par INNOVTECH SAS (Cotonou, Bénin). Les locataires réservent via l'application mobile Locars, et les propriétaires de véhicules (les « loueurs ») publient leurs voitures et fixent eux-mêmes leurs tarifs. Les prix sont affichés en FCFA et l'interface est en français.

Ce dépôt contient la **partie web** du produit :

- un **site public** qui présente le service et permet de parcourir les véhicules validés, de s'inscrire comme loueur, de contacter l'équipe, de demander la suppression de son compte et de télécharger l'application mobile ;
- un **back-office d'administration** où l'équipe Locars valide les loueurs et les véhicules, suit les réservations et les avis, et gère les commissions et le chiffre d'affaires.

Les deux parties utilisent le même projet Firebase que l'application mobile.

<p align="center">
  <img src="public/mockup.png" alt="Maquette de l'application mobile Locars" width="320" />
</p>

<!-- TODO: add screenshot -->

## Fonctionnalités principales

### Site public

- **Page d'accueil** (`/`) : proposition de valeur, fonctionnement et voitures populaires.
- **Catalogue de véhicules** (`/cars-dashboard`) chargé depuis Firestore, avec des filtres par boîte de vitesses, type de carburant et durée de location (jour / semaine / mois).
- **Inscription loueur** (`/become-host`) : formulaire en 4 étapes pour les particuliers (`particulier`) ou les agences (`agence`). Il crée un compte Firebase Auth et téléverse les justificatifs dans Firebase Storage : pièce d'identité et permis de conduire pour un particulier ; pièce d'identité, extrait du registre du commerce et attestation IFU pour une agence.
- **Formulaire de contact** (`/contact`) : envoie un e-mail à l'équipe via [Resend](https://resend.com).
- **Demande de suppression de compte** (`/delete-account`) : téléverse un justificatif d'identité et enregistre la demande dans Firestore pour traitement.
- **Page de téléchargement** (`/download`) avec les liens App Store et Google Play.
- **FAQ, À propos, CGU (`/cgu`) et Politique de confidentialité (`/privacy`)**. Les pages juridiques sont générées à chaque requête à partir des fichiers Markdown situés à la racine du dépôt, avec `react-markdown` et `remark-gfm`.

### Back-office d'administration (`/back-office`)

| Section | Rôle |
|---------|------|
| Tableau de bord | Statistiques globales (comptes en attente, véhicules en attente, utilisateurs) |
| Utilisateurs | Approuver, rejeter, suspendre ou réactiver des comptes |
| Demandes loueurs (`web-requests`) | Examiner les candidatures envoyées depuis le site ; l'approbation crée l'utilisateur Firebase Auth et le document `users` |
| Véhicules | Examiner les annonces et les valider |
| Réservations | Liste et fiche détaillée des réservations |
| Avis | Modérer les notes et avis, émettre des avertissements |
| Analytique | Paiements en attente, gains des loueurs, revenu mensuel |
| Commissions loueurs | Suivre les commissions dues et marquer les paiements comme effectués |
| Demandes de contact / de suppression | Suivi des messages et des demandes de suppression de compte |
| Paramètres | Informations sur l'application et l'environnement, compteurs récapitulatifs |

Les pages du back-office et de `/auth` ont leur propre mise en page, sans l'en-tête ni le pied de page publics.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router), React 19 |
| Langage | TypeScript 5 |
| Style | Tailwind CSS 4, Heroicons |
| Données | Cloud Firestore (SDK client dans les pages, Admin SDK dans les routes API) |
| Authentification | Firebase Authentication |
| Stockage de fichiers | Firebase Storage |
| E-mail | Resend |
| Contenu | `react-markdown` + `remark-gfm` pour les pages juridiques |
| Conteneurisation | Dockerfile (`node:20-alpine`) |

### Choix techniques notables

- **Deux SDK Firebase.** Les composants client utilisent le SDK JavaScript Firebase (`lib/firebase.ts`, `lib/firebase-utils.ts`). Les opérations privilégiées, comme la création d'utilisateurs, les validations ou l'enregistrement des demandes de suppression, passent par des Route Handlers Next.js avec le **Firebase Admin SDK** (`lib/firebase-admin.ts`). Si les identifiants Admin sont absents, l'Admin SDK s'initialise à la demande et renvoie `null` : le site public fonctionne toujours, et les routes API concernées renvoient une erreur `500` explicite.
- **Protection des routes par middleware.** `middleware.ts` redirige les requêtes vers `/back-office/*` sur `/auth/login` en l'absence de cookie `authToken`. La page de connexion authentifie l'utilisateur avec Firebase Auth, puis appelle `/api/auth/login` pour poser le cookie.
- **Contenu juridique en Markdown.** Les CGU et la politique de confidentialité sont des fichiers `.md` versionnés, lus avec `fs` dans des Server Components. Les mettre à jour ne demande aucune modification de code.
- **Échappement HTML** des saisies utilisateur avant leur insertion dans l'e-mail de contact.

## Architecture

```mermaid
flowchart LR
  subgraph Navigateur
    P[Pages publiques]
    B[Pages back-office]
  end
  subgraph "Serveur Next.js"
    MW[middleware.ts<br/>vérif. authToken]
    API[Route Handlers<br/>/api/*]
  end
  subgraph Firebase
    AUTH[Authentication]
    FS[(Firestore)]
    ST[(Storage)]
  end
  RS[Resend]

  P -- SDK client --> FS
  P -- téléversements --> ST
  P -- inscription --> AUTH
  B --> MW
  B -- SDK client --> FS
  P & B -- fetch --> API
  API -- Admin SDK --> FS
  API -- Admin SDK --> AUTH
  API -- /api/contact --> RS
```

Collections Firestore utilisées dans le code : `users`, `cars`, `host_requests`, `web_host_requests`, `reservations`, `reviews`, `review_warnings`, `host_transactions`, `commissionHistory`, `contact_messages`, `inquiries`, `delete_requests`.

## Démarrage

### Prérequis

- Node.js 20 (version utilisée dans le `Dockerfile`) et npm
- Un accès à un projet Firebase avec Authentication, Firestore et Storage activés
- Une clé API Resend si vous voulez que le formulaire de contact envoie des e-mails

### Installation

```bash
git clone https://github.com/andysags/locars-web.git
cd locars-web
npm install
```

### Configuration

Créez un fichier `.env.local` à la racine du projet. Le dépôt ne contient pas de `.env.example` ; voici les variables lues par le code :

| Variable | Nécessaire pour | Description |
|----------|-----------------|-------------|
| `FIREBASE_PROJECT_ID` | Routes API Admin | ID du projet Firebase pour l'Admin SDK |
| `FIREBASE_CLIENT_EMAIL` | Routes API Admin | E-mail du compte de service |
| `FIREBASE_PRIVATE_KEY` | Routes API Admin | Clé privée du compte de service. Les séquences `\n` échappées sont converties en vrais retours à la ligne. |
| `RESEND_API_KEY` | `/api/contact` | Clé API Resend. Sans elle, l'endpoint de contact renvoie une erreur. |
| `CONTACT_RECIPIENT_EMAIL` | `/api/contact` (facultatif) | Adresse destinataire. Par défaut : `contact@locars.app`. |
| `CONTACT_SENDER_EMAIL` | `/api/contact` (facultatif) | Adresse expéditrice. Par défaut : `Locars <onboarding@resend.dev>`. |

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RESEND_API_KEY=your-resend-key
```

> **Remarque :** la configuration Firebase **côté client** est codée en dur dans `lib/firebase.ts`, et des copies figurent dans plusieurs pages du back-office. Elle n'est pas lue depuis les variables d'environnement. Pour utiliser un autre projet Firebase, modifiez ces fichiers.

### Lancement

```bash
npm run dev      # serveur de développement sur http://localhost:3000
npm run build    # build de production
npm start        # sert le build de production
npm run lint     # ESLint
```

### Docker

```bash
docker build -t locars-web .
docker run -p 3000:3000 --env-file .env.local locars-web
```

Pour en savoir plus sur le déploiement (Vercel, Docker, Cloud Run), voir [DEPLOYMENT.md](DEPLOYMENT.md).

## Utilisation

- **Visiteurs** : parcourent `/cars-dashboard`, téléchargent l'application mobile depuis `/download` ou postulent comme loueur via `/become-host`.
- **Administrateurs** : se connectent sur `/auth/login` avec un compte Firebase Auth, puis gèrent la plateforme depuis `/back-office`.

## Structure du projet

```
locars-web/
├── app/
│   ├── page.tsx               # Page d'accueil
│   ├── layout.tsx             # Layout racine (polices, métadonnées, lang="fr")
│   ├── components/            # Header, Footer, PopularCars, SiteChrome, LegalMarkdown
│   ├── cars-dashboard/        # Catalogue de véhicules avec filtres
│   ├── become-host/           # Inscription loueur en plusieurs étapes
│   ├── contact/  faq/  about/  download/  delete-account/
│   ├── cgu/  privacy/         # Pages juridiques générées depuis le Markdown
│   ├── auth/login/            # Connexion administrateur
│   ├── back-office/           # Tableau de bord et sections d'administration
│   └── api/
│       ├── auth/login/        # Pose le cookie authToken
│       ├── contact/           # Envoi d'e-mail via Resend
│       ├── delete-account/    # Enregistre les demandes de suppression
│       └── back-office/       # users, cars, web-requests (Admin SDK)
├── lib/
│   ├── firebase.ts            # Initialisation du SDK client
│   ├── firebase-utils.ts      # Fonctions utilitaires Firestore/Auth/Storage côté client
│   └── firebase-admin.ts      # Initialisation à la demande de l'Admin SDK
├── public/                    # Logo, images, badges des stores
├── middleware.ts              # Protection des routes /back-office
├── CGU Locars_01.05.2026.md   # Conditions générales d'utilisation (source de /cgu)
├── Confidentialité Locars_01.05.2026.md  # Politique de confidentialité (source de /privacy)
├── Dockerfile
└── DEPLOYMENT.md
```

## Tests

Le projet n'a pas encore de tests automatisés. Utilisez `npm run lint` et `npm run build` comme vérifications de base.

## Application mobile

- App Store : <https://apps.apple.com/bj/app/locars/id6763099054>
- Google Play : <https://play.google.com/store/apps/details?id=com.innovtechlabs.locars>

## Licence

Ce dépôt ne contient pas de fichier de licence. Selon les CGU de la plateforme, la plateforme Locars et ses contenus appartiennent à INNOVTECH SAS.
