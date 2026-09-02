# 🌳 HeritageArchive — Arbre Généalogique Familial

Application moderne d'arbre généalogique et d'archive familiale construite avec **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS (Heritage Modern Theme)** et **SQLite**.

Cette application reprend l'intégralité de la logique métier, des calculs de parenté et des données de l'ancienne application Django, en intégrant les spécifications de design system de **Stitch** (*Heritage Modern*).

---

## 🏛️ Fonctionnalités Principales

### 1. 📊 Tableau de Bord Historique (`/`)
- **Indicateurs clés (StatCards)** : Nombre total de membres (lignée de sang / par alliance), profondeur générationnelle, portraits archivés, berceaux géographiques.
- **Journal d'activité (`ActivityFeed`)** : Historique des ajouts, modifications et créations de fiches.
- **Suggestions de recherche (`HintCard`)** : Détection intelligente des données manquantes (dates de naissance, photos, récits biographiques).
- **Galerie des portraits d'époque (`RecentGallery`)** : Cadres photographiques vintage avec survol dynamique.

### 2. 🌲 Arbre Généalogique Interactif (`/tree`)
- **Double mode de visualisation** :
  - **Graphe Visuel Interactif (Canvas / SVG)** : Zoom fluide, déplacement (drag & pan), recadrage automatique, courbes de Bézier de filiation (`#7a5739`) et d'alliances (`#c69214`), badges par genre et photos d'archive.
  - **Vue Déroulante Hiérarchique (Générations)** : Déploiement accordéon génération par génération, enfants groupés par conjoint avec photos et badges.
- **Filtres de lignée** : *Lignée pure (famille de sang)* vs *Avec conjoints (alliances)*.

### 3. 📜 Fiche Personnelle & Récit d'Ancêtre (`/person/[id]`)
- **En-tête Hero** : Portrait encadré vintage, nom complet avec gestion des noms de jeune fille, dates vitales, âge calculé (au décès ou actuel), profession.
- **Histoire de vie** : Récit biographique avec typographie *Literata* et **lettrine éditoriale (drop-cap)**, accomplissements et cursus éducatif.
- **Chronologie verticale (`PersonTimeline`)** : Jalons historiques (naissance, mariages, naissances des enfants, carrière, décès).
- **Relations familiales complètes** : Parents, fratrie, conjoints et enfants groupés par co-parent.

### 4. ✍️ Formulaires CRUD & Recherche Globale
- **Création & Modification (`/person/add`, `/person/[id]/edit`)** : Filtrage intelligent des choix (pères masculins, mères féminines, membres de sang pour alliances), pré-remplissage des liens de parenté, téléversement de photos.
- **Recherche instantanée (`⌘K` / `Ctrl+K`)** : Recherche plein texte avec autocomplétion par nom, prénom, lieu ou profession.

---

## 🎨 Design System : Heritage Modern

- **Typographies** :
  - *Literata* (Google Fonts) : Titres, lettrines historiques, noms d'ancêtres.
  - *Work Sans* (Google Fonts) : Textes d'interface, métadonnées, dates.
- **Palette chromatique** :
  - **Vert Forêt (`#173124`)** : Couleur primaire évoquant l'arbre et la pérennité.
  - **Noyer / Bois (`#7A5739`)** : Couleur secondaire pour les accents historiques et liens.
  - **Parchemin (`#FFF8F4` / `#F5ECE5`)** : Fond tactile reposant.
  - **Or / Laiton (`#C69214`)** : Distinctions et alliances matrimoniales.
  - **Bleu Acier (`#2980B9`)** & **Rose Ancien (`#C0392B`)** : Représentation des genres (H/F).

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** (v18+)
- **npm** ou **pnpm** / **yarn**

### Lancement en mode développement

```bash
cd heritage_app
npm install
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build & Lancement en production

```bash
cd heritage_app
npm run build
npm start
```

---

## 🗄️ Structure du Projet (`heritage_app/`)

```
heritage_app/
├── data/
│   ├── family_tree.db           # Base SQLite locale
│   ├── initial_seed.json        # Données initiales exportées de Django
│   └── seed.py                  # Script de réinitialisation/seeding
├── public/
│   └── media/photos/            # Portraits et photographies numérisées
├── src/
│   ├── app/
│   │   ├── api/                 # Endpoints REST (/tree-data, /persons, /stats, /search, /upload)
│   │   ├── person/              # Pages Fiche (/person/[id]), Ajout (/add), Édition (/edit)
│   │   ├── tree/                # Page Arbre Généalogique (/tree)
│   │   ├── layout.tsx           # Layout racine avec polices Literata & Work Sans
│   │   ├── page.tsx             # Tableau de bord d'accueil
│   │   └── globals.css          # Thème Heritage Modern & classes utilitaires
│   ├── components/
│   │   ├── dashboard/           # StatCard, ActivityFeed, HintCard, RecentGallery
│   │   ├── layout/              # Navbar, Footer
│   │   ├── person/              # PersonHero, PersonBio, PersonTimeline, FamilyRelationships, PersonForm
│   │   ├── search/              # SearchModal (Ctrl+K)
│   │   └── tree/                # InteractiveTreeCanvas, HierarchicalTreeView
│   ├── lib/
│   │   ├── db.ts                # Connexion SQLite better-sqlite3 & requêtes CRUD
│   │   └── genealogy.ts         # Algorithmes de parenté, générations et statistiques
│   └── types/
│       └── index.ts             # Définitions TypeScript
```
