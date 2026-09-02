# 🌳 HeritageArchive — Arbre Généalogique Familial (Next.js / React / TypeScript)

Ce projet est la refonte moderne complète de l'application d'arbre généalogique en **Next.js (App Router)**, **React 19**, **TypeScript** et **Tailwind CSS (Theme Heritage Modern)**, basée sur la logique métier Django et les recommandations des maquettes Stitch.

L'application Next.js est située dans le dossier [`heritage_app/`](file:///C:/Users/USER/Desktop/Family_tree/heritage_app).

---

## 🚀 Démarrage Rapide

```bash
cd heritage_app
npm install
npm run dev
```

Accédez à l'application sur [http://localhost:3000](http://localhost:3000).

---

## 🏛️ Vues Principales

1. **Tableau de Bord (`/`)** : Indicateurs clés (StatCard), Journal d'activité (ActivityFeed), Suggestions de complétion (HintCard), Galerie des portraits vintage (RecentGallery).
2. **Arbre Généalogique (`/tree`)** : 
   - *Graphe Visuel Interactif* : Canvas SVG avec zoom/pan/fit, liens de filiation et de mariage courbés, filtres de lignée.
   - *Vue Déroulante Hiérarchique* : Accordéon par génération avec déploiement des enfants groupés par conjoint.
3. **Fiche Personnelle (`/person/[id]`)** : En-tête héro avec cadre portrait ancien, récit de vie avec lettrine historique (*drop-cap*), chronologie d'événements, liens de filiation complets.
4. **Formulaires & Gestion (`/person/add`, `/person/[id]/edit`)** : Création/Modification avec sélection filtrée des parents et conjoints, upload d'images.
5. **Recherche Globale (`⌘K` / `Ctrl+K`)** : Modal de recherche instantanée.
