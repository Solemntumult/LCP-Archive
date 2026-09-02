# 🌿 LCP Archives — Arbre Généalogique & Mémoire Familiale

Plateforme interactive et moderne de généalogie, de préservation de la mémoire familiale et de chroniques d'époque pour la famille **LCP Archives**.

---

## ✨ Fonctionnalités Principales

- **🌳 Arbre Généalogique Interactif** :
  - Visualisation multi-générationnelle dynamique avec navigation par foyers.
  - Gestion fidèle des unions, des enfants par alliance et des branches directes (zéro croisement de lignes).
  - Générations des conjoints harmonisées avec leurs partenaires.
  - Avatars circulaires épurés avec initiales et distinctions de genre.
- **📜 Événements & Récits Historiques** :
  - Galerie d'époque dédiée aux chroniques et documents d'archives.
  - Sélecteur de photos natif (compatible galerie smartphone et explorateur PC avec sélection multiple et téléversement direct).
  - Rendu pur et authentique des photographies sans filtres altérants.
- **🔍 Recherche & Statistiques** :
  - Moteur de recherche instantané (`⌘K` / `Ctrl+K`).
  - Métriques démographiques et complétude généalogique.
- **📱 100% Responsive & Moderne** :
  - Optimisé pour mobile, tablette et desktop.
  - Conçu avec Next.js 16 (App Router), Tailwind CSS et SQLite.

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 3. Build de production
```bash
npm run build
npm run start
```

---

## 📁 Structure du Projet

```
├── data/               # Base de données SQLite (family_tree.db) & seeds
├── public/             # Assets statiques, logo officiel (icon.svg) & médias
├── src/
│   ├── app/            # Routes Next.js App Router (Tree, Person, Events, API)
│   ├── components/     # Composants UI (Tree, Person, Events, Dashboard)
│   ├── lib/            # Logique métier, requêtes DB SQLite & calculs généalogiques
│   └── types/          # Types TypeScript du modèle familial
├── next.config.ts      # Configuration Next.js
├── tailwind.config.ts  # Design tokens & styles
└── package.json        # Dépendances du projet
```

---

## 🔒 Licence & Confidentialité
Archives familiales privées — Données historiques et généalogiques protégées.
