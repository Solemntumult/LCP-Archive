# AUDIT TECHNIQUE & UX — HeritageArchive V1 vers V2

> **Date de l'audit :** 31 août 2026  
> **Projet :** LISSANONArchive / HeritageArchive  
> **Objectif :** Diagnostiquer les limites actuelles et poser les fondations d'un arbre généalogique scalable (20 à 1 000+ membres), lisible, interactif et centré sur la mémoire familiale vivante.

---

## 1. Vue d'Ensemble de l'Architecture Actuelle

### 1.1 Stack Technologique
- **Framework :** Next.js 16.3.3 (App Router, Turbopack, Server & Client Components)
- **UI & Rendu :** React 19, TypeScript strict, Tailwind CSS v4, Lucide React (SVG)
- **Base de Données :** SQLite locale (`family_tree.db`) via `better-sqlite3` avec migrations automatiques et logs d'activité
- **Typographie :** *Literata* (Serif patrimoniale) + *Work Sans* (Sans-serif claire)

---

## 2. Analyse des Données & Modèle Relationnel

### 2.1 Schéma SQLite (`persons` & `family_events`)
```sql
CREATE TABLE persons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  maiden_name TEXT,
  gender TEXT NOT NULL,
  birth_date TEXT,
  birth_place TEXT,
  death_date TEXT,
  death_place TEXT,
  father_id INTEGER REFERENCES persons(id),
  mother_id INTEGER REFERENCES persons(id),
  spouse_of_id INTEGER REFERENCES persons(id),
  biography TEXT,
  accomplishments TEXT,
  profession TEXT,
  education TEXT,
  photo TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

### 2.2 Points Forts Existants
1. Liens parentaux directs (`father_id`, `mother_id`) simples et efficaces pour les ascendances immédiates.
2. Groupement des enfants par conjoint (`children_by_spouse`) géré via l'analyse relationnelle dans `genealogy.ts` et `db.ts`.
3. Support complet des événements passés et à venir avec galeries photos multiples (JSON).

### 2.3 Limites & Risques de Scalabilité Identifiés
1. **Unions multiples et polygynie/polyamour/remariages :** Le champ unique `spouse_of_id` dans la table `persons` est insuffisant si un individu a plus de 2 conjoints successifs. Actuellement, la déduction des conjoints passe par les enfants communs, ce qui ne couvre pas les couples sans enfants déclarés.
2. **Calculs dynamiques de génération :** La génération est calculée à la volée depuis les patriarches. Sur un graphe de 500 à 1 000 personnes, des appels récursifs non mémoïsés peuvent ralentir le chargement initial.
3. **Absence de notion explicite de « Branches » :** Il n'existe pas d'identifiant ou de regroupement formel de branches descendantes pour replier/déplier des sous-arbres entiers avec calcul de complétude.

---

## 3. Analyse du Moteur de Layout Actuel (`treeLayout.ts` & `InteractiveTreeCanvas.tsx`)

### 3.1 Architecture du Layout Actuel
Le moteur actuel (`treeLayout.ts`) :
- Construit récursivement un arbre de sous-graphes (`FamilySubTree`).
- Calcule la largeur de chaque sous-arbre de bas en haut.
- Positionne les conjoints horizontalement côte à côte (`SPOUSE_GAP = 24px`).
- Génère des chemins SVG orthogonaux à 90° (`M x1 y1 L x2 y2 ...`).

### 3.2 Problèmes Critiques pour le Passage à l'Échelle (100 - 1 000 membres)
| Problème | Cause Racine | Impact UX |
| :--- | :--- | :--- |
| **Explosion horizontale de la largeur** | Chaque sous-branche alloue un espace horizontal fixe même si elle est repliée ou secondaire. | Sur 100+ personnes, l'arbre mesure plus de 10 000px de large, rendant la vue globale illisible (*effet filiforme*). |
| **Niveau de détail fixe (No LOD)** | Tous les nœuds affichent le même format (Cercle 60px + cadre nom) quel que soit le zoom. | Dézoomé, les noms se chevauchent ; zoomé, le contexte global est perdu. |
| **Absence de repliage de branches sur le canevas** | Le canevas affiche 100% des personnes simultanément. | Impossibilité de masquer temporairement une branche de 50 personnes pour se concentrer sur une autre. |
| **Absence de mode Focus Dynamique** | La sélection d'un membre ouvre un panneau latéral mais ne recentre pas l'arbre sur sa famille proche (parents + conjoints + enfants). | L'utilisateur doit naviguer manuellement à travers un grand canevas pour trouver les proches. |
| **Ajout décontextualisé** | Le formulaire `/person/add` nécessite de chercher manuellement le parent dans une liste déroulante globale. | Risque d'erreur de sélection sur de grands arbres et friction majeure lors de la saisie d'une fratrie. |

---

## 4. Analyse des Composants & de l'Expérience Utilisateur

### 4.1 Navigation & Outils
- **Toolbar actuelle :** Propose un basculement statique *Graphe Visuel* / *Vue Déroulante* et deux filtres (*Complet* / *Lignée Directe*).
- **Manque V2 :**
  - Sélecteur de mode de vue : *Toute la famille*, *Descendants*, *Ascendants*, *Famille proche (Focus)*.
  - Contrôle du niveau de détail (Photos on/off, Dates on/off, Métadonnées on/off).
  - Boutons de dépliage/repliage global ou par palier de génération.

### 4.2 Recherche
- **Actuel :** Surligne le nœud sur le canevas et centre la caméra.
- **Manque V2 :** Recherche enrichie (nom de jeune fille, lieu, profession, génération) avec suggestion instantanée et activation automatique du mode Focus sur le membre trouvé.

### 4.3 Fiche Personnelle & Panneau Latéral
- Le panneau latéral (`Drawer`) doit devenir un véritable **Family Preview** interactif offrant des boutons d'actions directes :
  - *« Voir les descendants »*
  - *« Voir les ascendants »*
  - *« Voir la famille proche »*
  - *« Ajouter un enfant / conjoint / parent »* (pré-rempli)

---

## 5. Matrice des Risques & Recommandations pour la V2

### 5.1 Recommandations Architecturales V2
1. **Pipeline de Layout Isolé & Pur (Sans dépendance JSX)** :
   `Données SQLite` $\rightarrow$ `Graphe Relationnel` $\rightarrow$ `Moteur de Layout V2 (avec état de repliage & LOD)` $\rightarrow$ `ViewModel` $\rightarrow$ `Renderer SVG/HTML`.
2. **Système de Branches Repliables (`BranchNode`)** :
   Calculer dynamiquement le nombre exact de descendants d'une branche et permettre de la condenser en un badge `[Branche de X • 18 membres (+)]`.
3. **Niveau de Détail Adaptatif au Zoom (LOD)** :
   - *Zoom lointain (< 0.5x)* : Micro-points / cercles nominaux avec couleur de lignée.
   - *Zoom standard (0.5x - 1.2x)* : Cercle photo 48-60px + prénom + dates.
   - *Zoom rapproché (> 1.2x)* : Nœud enrichi avec profession, lieu et indicateur de complétude.
4. **Ajout Contextuel de Membre (Modal Pré-rempli)** :
   Bouton `+ Ajouter` sur chaque nœud et dans le panneau Focus proposant d'ajouter directement un *Enfant*, un *Conjoint*, un *Parent* ou un *Frère/Sœur*.
5. **Indicateur de Complétude Familiale** :
   Calculer le score de documentation (photo, biographie, dates, filiation) pour chaque branche et pour la famille globale.

---

## 6. Conclusion de l'Audit
La base Next.js 16 + React 19 + SQLite est extrêmement saine, performante et stable. La transition vers la V2 ne nécessite aucune rupture destructrice mais une **élévation algorithmique et interactionnelle majeure** du moteur de graphe et des vues généalogiques.
