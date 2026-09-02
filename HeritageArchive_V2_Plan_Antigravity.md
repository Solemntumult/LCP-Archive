# HeritageArchive — Plan V2 pour un arbre généalogique scalable, élégant et réellement familial

> **Objectif principal :** transformer HeritageArchive en une application de mémoire familiale moderne, capable de passer d'une vingtaine de personnes à 100, 300 voire 1 000+ membres sans rendre l'arbre illisible.
>
> **Principe directeur :** ne pas simplement "embellir l'arbre actuel". Repenser l'expérience de navigation, le layout généalogique et les interactions afin que la structure reste compréhensible lorsque la famille grandit.

---

## 0. Contexte du projet à respecter

Le projet actuel est une application **Next.js App Router + React 19 + TypeScript + Tailwind CSS + SQLite**, avec notamment :

- arbre généalogique interactif ;
- zoom / pan ;
- vue hiérarchique ;
- parents, conjoints et enfants ;
- profils individuels ;
- biographies ;
- photos ;
- recherche ;
- CRUD ;
- données SQLite ;
- layout généalogique existant.

Le projet possède déjà une identité visuelle **Heritage Modern**. La V2 doit améliorer cette base sans casser les fonctionnalités métier existantes.

### Règle absolue

**Ne pas commencer par modifier le CSS.**

Avant toute modification importante :

1. comprendre l'architecture existante ;
2. comprendre le modèle de données ;
3. comprendre le layout actuel ;
4. identifier les composants réutilisables ;
5. identifier les régressions possibles ;
6. définir une architecture V2 ;
7. seulement ensuite implémenter.

---

# 1. Vision produit

HeritageArchive ne doit plus être perçu comme :

> "un arbre avec des cartes reliées entre elles"

mais comme :

> **une archive numérique vivante de la famille.**

L'utilisateur doit pouvoir :

- voir la structure globale de sa famille ;
- explorer une branche ;
- partir d'une personne et voir ses descendants ;
- remonter vers ses ancêtres ;
- retrouver rapidement un membre ;
- comprendre les relations ;
- ajouter progressivement les membres manquants ;
- raconter l'histoire d'une personne ;
- naviguer dans une famille devenue très grande.

---

# 2. Objectifs UX prioritaires

Priorité P0 :

- lisibilité de l'arbre ;
- navigation dans une grande famille ;
- focus sur une personne ;
- branches repliables ;
- ascendants / descendants ;
- ajout contextuel d'un membre ;
- recherche ;
- performance.

Priorité P1 :

- meilleure fiche personne ;
- statistiques de complétude ;
- suggestions de données manquantes ;
- meilleure navigation entre branches ;
- historique / chronologie.

Priorité P2 :

- collaboration familiale ;
- invitations ;
- validation des informations ;
- sources historiques ;
- export / impression ;
- partage sécurisé.

---

# 3. Nouvelle philosophie de l'arbre

## 3.1 Ne jamais essayer de montrer 300 personnes avec le même niveau de détail

L'interface doit être **progressive**.

### Zoom éloigné

Afficher uniquement :

- nom court ;
- photo éventuellement sous forme de petit cercle ;
- branche ;
- génération.

### Zoom moyen

Afficher :

- nom ;
- dates ;
- photo ;
- conjoint si pertinent.

### Zoom rapproché

Afficher :

- photo ;
- nom complet ;
- dates ;
- profession ou information principale ;
- indicateurs de relations.

---

# 4. Concept central : le "Family Focus"

Lorsqu'une personne est sélectionnée, l'arbre doit pouvoir se recentrer sur elle.

Exemple :

```text
                         Parents
                            │
                    ┌───────┴───────┐
                    │               │
                  Parent          Parent
                    │
                    ▼
                  PERSONNE
                 /        \
          Conjoint          Conjoint
             │                 │
        ┌────┴────┐       ┌────┴────┐
       Enfant    Enfant   Enfant    Enfant
```

Actions disponibles :

- **Voir la famille proche**
- **Voir les descendants**
- **Voir les ascendants**
- **Centrer dans l'arbre**
- **Voir la branche**
- **Ouvrir le profil**

Le mode Focus doit devenir une interaction fondamentale.

---

# 5. Trois modes de visualisation

## Mode A — Toute la famille

But :

> comprendre la structure générale.

Ne pas afficher systématiquement toutes les cartes détaillées.

Utiliser des groupes / branches / nœuds condensés lorsque nécessaire.

Exemple conceptuel :

```text
Ancêtre
   │
   ├── Branche A · 18 membres
   ├── Branche B · 42 membres
   └── Branche C · 27 membres
```

Une branche peut être développée.

---

## Mode B — Descendants

Depuis une personne :

```text
Personne
   │
   ├── Enfant A
   │    ├── Petit-enfant A1
   │    └── Petit-enfant A2
   │
   └── Enfant B
        └── Petit-enfant B1
```

---

## Mode C — Ascendants

```text
Arrière-grand-parent
        │
     Grand-parent
        │
      Parent
        │
      Personne
```

---

# 6. Branches repliables — fonctionnalité P0

Chaque grosse branche doit pouvoir être :

- développée ;
- repliée ;
- développée jusqu'à une génération ;
- centrée.

Exemple :

```text
                     Ancêtre
                        │
        ┌───────────────┼───────────────┐
        │               │               │
     Branche A       Branche B       Branche C
      18 pers.        42 pers.         27 pers.
        [+]             [-]             [+]

                    Branche B
                       │
                 ┌─────┼─────┐
                 │     │     │
                 A     B     C
```

### Important

Le nombre de membres dans une branche doit être calculé à partir des données réelles.

Ne jamais afficher de nombres fictifs.

---

# 7. Repenser le layout généalogique

Le fichier / module de layout actuel doit être étudié en profondeur avant modification.

L'agent doit répondre à ces questions :

1. Comment les générations sont-elles calculées ?
2. Comment les couples sont-ils représentés ?
3. Comment les enfants sont-ils positionnés ?
4. Comment sont calculées les dimensions ?
5. Pourquoi certaines branches produisent-elles beaucoup de vide ?
6. À partir de quelle taille les nœuds deviennent-ils illisibles ?
7. Comment éviter les croisements de relations ?
8. Comment gérer plusieurs conjoints ?
9. Comment gérer les parents inconnus ?
10. Comment gérer les demi-frères / demi-sœurs ?
11. Comment gérer une personne appartenant à plusieurs chemins familiaux ?

### Ne pas accepter un simple "recentrage CSS"

Le layout doit être traité comme un véritable problème algorithmique de graphe généalogique.

---

# 8. Modèle mental des relations

L'application doit progressivement considérer les relations comme des relations explicites.

Le modèle doit pouvoir évoluer pour supporter correctement :

- parent biologique ;
- parent adoptif si le produit le nécessite ;
- conjoint ;
- ancien conjoint ;
- enfant ;
- demi-frère / demi-sœur ;
- parent inconnu ;
- plusieurs unions ;
- familles recomposées.

### Attention

Ne pas effectuer de migration de base de données sans analyser d'abord les données existantes et proposer un plan de migration réversible.

---

# 9. Nœuds de personnes — nouveau design

Créer un composant conceptuel réutilisable :

`PersonNode`

États :

- default ;
- hover ;
- selected ;
- focused ;
- deceased ;
- incomplete ;
- compact ;
- expanded.

### Vue compacte

```text
   ◉
 Jean
```

### Vue standard

```text
┌─────────────────────┐
│         ◉           │
│   Jean LISSANON     │
│      1952–2021      │
└─────────────────────┘
```

### Vue détaillée

```text
┌─────────────────────────┐
│          PHOTO          │
│                         │
│      JEAN LISSANON      │
│       1952 – 2021       │
│       Ingénieur         │
└─────────────────────────┘
```

Ne pas transformer chaque nœud en mini-fiche.

---

# 10. Relations visuelles

Utiliser une grammaire visuelle cohérente.

### Filiation

```text
Parent
  │
  │
Enfant
```

### Couple

```text
Personne ─── Personne
```

### Fratrie

```text
           │
     ──────┼──────
     │     │     │
     A     B     C
```

### Principes

- lignes suffisamment épaisses ;
- contraste accessible ;
- pas de couleurs criardes ;
- pas de gradients inutiles ;
- pas d'animations décoratives ;
- animations courtes et fonctionnelles.

---

# 11. Direction artistique

Conserver l'idée **Heritage Modern**, mais réduire le côté "interface vintage".

### Inspiration

- archive familiale ;
- musée numérique ;
- livre de famille ;
- bibliothèque patrimoniale ;
- produit premium contemporain.

### Palette recommandée

- Vert forêt : couleur identitaire ;
- Ivoire / crème : surfaces ;
- Noyer : accents historiques ;
- Or / laiton : unions et éléments importants ;
- gris neutres : UI secondaire.

### À éviter

- emojis décoratifs partout ;
- stickers ;
- illustrations enfantines ;
- cartes trop colorées ;
- ombres excessives ;
- gradients flashy ;
- bordures partout ;
- effet "template généré par IA".

---

# 12. Typographie

Conserver :

- Literata pour les titres / noms patrimoniaux ;
- Work Sans pour l'interface.

Mais établir une vraie hiérarchie :

- H1 ;
- H2 ;
- nom de personne ;
- génération ;
- dates ;
- métadonnées ;
- boutons ;
- labels.

Les informations secondaires doivent rester discrètes.

---

# 13. Nouvelle barre d'outils de l'arbre

Proposition :

```text
┌───────────────────────────────────────────────────────────┐
│ Arbre familial                         🔍 Rechercher      │
│                                                           │
│ [Toute la famille] [Descendants] [Ascendants] [Proche]   │
│                                                           │
│                            −   100%   +   ⛶              │
└───────────────────────────────────────────────────────────┘
```

Le bouton de configuration peut ouvrir :

```text
Affichage

○ Toute la famille
○ Lignée
○ Descendants
○ Ascendants
○ Famille proche

☑ Photos
☑ Dates
☐ Professions
☐ Conjoints

Taille des nœuds
───────●────────
```

---

# 14. Recherche

La recherche existante doit devenir un véritable point d'entrée dans l'arbre.

Recherche par :

- prénom ;
- nom ;
- nom de jeune fille ;
- lieu ;
- profession ;
- génération.

Lorsqu'une personne est trouvée :

1. sélectionner la personne ;
2. fermer / réduire les éléments qui masquent la zone ;
3. centrer l'arbre ;
4. afficher le nœud ;
5. proposer d'ouvrir sa fiche.

Ajouter éventuellement :

> "Voir dans l'arbre"

---

# 15. Panneau de personne

Le drawer doit devenir un **Family Preview**.

Structure :

```text
┌───────────────────────────────────┐
│                             ×     │
│                                   │
│              PHOTO                │
│                                   │
│        JEAN LISSANON              │
│        1952 — 2021                │
│        Ingénieur                  │
│                                   │
│  ───────────────────────────────  │
│                                   │
│  Famille                          │
│                                   │
│  Père       ...                   │
│  Mère       ...                   │
│  Conjoint   ...                   │
│  Enfants    4                     │
│                                   │
│  ───────────────────────────────  │
│                                   │
│  Résumé biographique...           │
│                                   │
│ [Ouvrir le profil]                │
│ [Voir les descendants]            │
│ [Voir les ascendants]             │
│ [Centrer l'arbre]                 │
└───────────────────────────────────┘
```

---

# 16. Ajouter un membre depuis le contexte

C'est une fonctionnalité P0.

Depuis une personne :

`+ Ajouter`

Puis :

```text
Que voulez-vous ajouter ?

[ Un enfant ]
[ Un parent ]
[ Un conjoint ]
[ Un frère / une sœur ]
```

Le formulaire doit être pré-rempli avec la relation sélectionnée.

Exemple :

> Ajouter un enfant de Jean

Le parent Jean est déjà sélectionné.

### Résultat

L'ajout d'une grande famille doit devenir rapide et naturel.

---

# 17. Complétude de la famille

Puisque l'arbre sera progressivement construit, afficher la progression.

Exemple :

```text
MÉMOIRE FAMILIALE

24 profils documentés

███████░░░░░░░░░ 28%

La famille est encore en cours de construction.

[Ajouter un membre]
```

Sur une branche :

```text
Branche de Paul

12 membres documentés
7 membres potentiels à ajouter

[Compléter cette branche]
```

### Attention

Ne pas prétendre connaître des membres inexistants.

Les "membres potentiels" doivent provenir uniquement de données réellement connues / suggérées / saisies par la famille.

---

# 18. Données incomplètes

Un membre peut avoir :

- pas de photo ;
- pas de date ;
- pas de biographie ;
- parent manquant ;
- profession manquante.

Afficher un indicateur discret.

Exemple :

```text
Jean
⚠ Profil incomplet
```

Dans le profil :

```text
Profil à compléter

□ Photo
□ Date de naissance
□ Lieu de naissance
□ Biographie
```

---

# 19. Dashboard

Le dashboard doit devenir un centre de mémoire familiale.

Cartes :

- membres ;
- générations ;
- portraits ;
- branches ;
- profils incomplets.

Mais surtout :

### "Continuer à construire la famille"

```text
3 profils à compléter
2 branches sans enfants renseignés
5 personnes sans photo

[Voir les suggestions]
```

---

# 20. Performance — objectif obligatoire

Tester avec des données simulées :

- 50 membres ;
- 100 membres ;
- 250 membres ;
- 500 membres ;
- 1 000 membres.

Mesurer :

- temps de rendu initial ;
- FPS pendant pan/zoom ;
- temps de recalcul du layout ;
- mémoire ;
- nombre de DOM nodes ;
- temps de recherche ;
- temps d'ouverture d'un profil.

### Si SVG devient trop lourd

Étudier :

- SVG hybride ;
- rendu Canvas pour la vue globale ;
- DOM seulement pour les nœuds interactifs ;
- virtualisation / culling ;
- calcul de layout hors rendu React si nécessaire.

**Ne pas changer de technologie sans benchmark.**

---

# 21. Accessibilité

Obligatoire :

- navigation clavier ;
- focus visible ;
- boutons avec labels accessibles ;
- contraste suffisant ;
- alternative textuelle pour les relations importantes ;
- comportement correct sur écran tactile ;
- tailles de zones tactiles suffisantes.

L'arbre visuel doit avoir une alternative exploitable :

> Vue hiérarchique / liste familiale.

---

# 22. Responsive

Ne pas simplement "faire rentrer l'arbre" sur mobile.

Sur mobile :

### Vue arbre

- zoom tactile ;
- pan tactile ;
- focus automatique ;
- nœuds plus compacts.

### Alternative

Afficher une vue :

```text
Jean LISSANON

Parents
→ ...

Conjoint
→ ...

Enfants
→ ...

Fratrie
→ ...
```

Le mobile doit privilégier la navigation relationnelle plutôt qu'un immense canvas.

---

# 23. Animations

Animations uniquement lorsqu'elles expliquent un changement :

- centrage sur une personne ;
- ouverture d'une branche ;
- sélection ;
- transition de mode.

Durée courte.

Respecter `prefers-reduced-motion`.

Éviter :

- animations permanentes ;
- particules ;
- effets "magiques" ;
- transitions exagérées.

---

# 24. Architecture de composants recommandée

L'agent doit chercher à converger vers quelque chose proche de :

```text
tree/
├── FamilyTree
├── TreeToolbar
├── TreeViewport
├── TreeCanvas
├── TreeConnections
├── PersonNode
├── CoupleNode
├── BranchNode
├── GenerationLayer
├── TreeMinimap
├── TreeLegend
├── TreeFilters
├── PersonFocusPanel
└── TreeEmptyState
```

Le nom exact peut être adapté à l'architecture existante.

### Important

Ne pas créer 30 composants abstraits inutiles.

Extraire seulement les responsabilités réellement distinctes.

---

# 25. Architecture de layout

Séparer clairement :

```text
DATA
  ↓
RELATION GRAPH
  ↓
LAYOUT ENGINE
  ↓
VIEW MODEL
  ↓
RENDERER
  ↓
INTERACTION
```

Le layout ne doit pas dépendre directement du JSX.

Exemple conceptuel :

```text
FamilyData
   ↓
buildFamilyGraph()
   ↓
calculateGenerations()
   ↓
calculateFamilyGroups()
   ↓
calculatePositions()
   ↓
TreeViewModel
   ↓
SVG / Canvas / DOM
```

Cela rend le système testable.

---

# 26. Tests du layout

Créer des fixtures de test :

### Cas 1

Une seule personne.

### Cas 2

Couple sans enfant.

### Cas 3

Couple + 1 enfant.

### Cas 4

Couple + 5 enfants.

### Cas 5

3 générations.

### Cas 6

Famille très déséquilibrée.

### Cas 7

Plusieurs conjoints.

### Cas 8

Parent inconnu.

### Cas 9

Demi-fratrie.

### Cas 10

500 membres.

### Cas 11

Branches repliées.

### Cas 12

Focus sur une personne profonde dans l'arbre.

---

# 27. Règles de développement pour Antigravity

L'agent doit :

1. **inspecter avant de modifier** ;
2. ne pas supprimer une fonctionnalité existante sans justification ;
3. ne pas remplacer une architecture stable simplement pour "faire moderne" ;
4. ne pas inventer des données ;
5. ne pas modifier la base SQLite sans migration réfléchie ;
6. ne pas casser les routes existantes ;
7. conserver TypeScript strict ;
8. lancer le lint ;
9. lancer le build ;
10. tester les interactions principales ;
11. documenter les changements importants.

### Règle spéciale Next.js

Le fichier `AGENTS.md` indique explicitement que cette version de Next.js possède des changements importants.

**Avant d'écrire du code Next.js, l'agent doit consulter la documentation locale appropriée dans `node_modules/next/dist/docs/` et respecter les conventions de la version installée.**

Ne pas appliquer aveuglément des patterns Next.js provenant d'anciennes versions.

---

# 28. Méthode de travail obligatoire

Antigravity doit travailler par étapes.

## PHASE 1 — Audit

Ne rien refactorer.

Analyser :

- structure du projet ;
- routes ;
- composants ;
- données ;
- SQLite ;
- modèle relationnel ;
- arbre actuel ;
- `treeLayout` ;
- recherche ;
- drawer ;
- design system.

Livrable :

`AUDIT.md`

avec :

- problèmes ;
- causes ;
- risques ;
- fichiers concernés ;
- recommandations.

---

# 29. PHASE 2 — Architecture cible

Créer :

`TREE_V2_ARCHITECTURE.md`

Inclure :

- architecture du graphe ;
- modèle des relations ;
- pipeline du layout ;
- stratégie de rendu ;
- états UI ;
- responsive ;
- performance ;
- accessibilité.

**Ne pas coder avant validation de cette architecture.**

---

# 30. PHASE 3 — Prototype du layout

Avant le redesign complet :

Créer un prototype isolé du nouveau layout.

Tester avec des données artificielles :

- 20 ;
- 50 ;
- 100 ;
- 250 ;
- 500 ;
- 1 000 personnes.

Objectif :

> vérifier que l'arbre reste navigable.

---

# 31. PHASE 4 — Implémenter l'arbre V2

Implémenter dans cet ordre :

1. pipeline de données ;
2. layout ;
3. viewport ;
4. zoom/pan ;
5. nœuds ;
6. relations ;
7. branches pliables ;
8. focus ;
9. recherche → focus ;
10. modes ascendants/descendants ;
11. drawer ;
12. ajout contextuel.

Ne pas tout réécrire en une seule étape.

---

# 32. PHASE 5 — Refonte visuelle

Une fois la logique validée :

- design system ;
- typographie ;
- couleurs ;
- nœuds ;
- toolbar ;
- drawer ;
- états vides ;
- micro-interactions.

Le design vient **après** la résolution de la lisibilité structurelle.

---

# 33. PHASE 6 — Mobile

Tester au minimum :

- 360 px ;
- 390 px ;
- 768 px ;
- desktop ;
- grands écrans.

Tester réellement :

- pinch zoom ;
- drag ;
- sélection ;
- ouverture du drawer ;
- recherche ;
- ajout de membre.

---

# 34. PHASE 7 — Tests de charge

Générer un dataset de test.

Scénarios :

```text
20 personnes
50 personnes
100 personnes
250 personnes
500 personnes
1000 personnes
```

Le produit doit rester utilisable.

---

# 35. PHASE 8 — QA

Avant de déclarer la V2 terminée :

```text
[ ] npm run lint
[ ] npm run build
[ ] arbre 20 membres
[ ] arbre 100 membres
[ ] arbre 500 membres
[ ] zoom
[ ] pan
[ ] recherche
[ ] focus
[ ] descendants
[ ] ascendants
[ ] branches
[ ] ajout enfant
[ ] ajout parent
[ ] ajout conjoint
[ ] drawer
[ ] mobile
[ ] clavier
[ ] reduced motion
```

---

# 36. Skills / connaissances à rechercher pour Antigravity

L'objectif n'est pas de chercher uniquement des "skills de design".

L'agent doit chercher / utiliser des compétences couvrant plusieurs domaines.

## A. Génie logiciel

Rechercher des skills autour de :

- `software architecture`
- `refactoring`
- `TypeScript architecture`
- `React architecture`
- `clean architecture`
- `domain modeling`

---

## B. React / Next.js

Rechercher :

- `Next.js 16`
- `React 19`
- `App Router`
- `React performance`
- `React rendering optimization`
- `server/client components`
- `Next.js local documentation`

**Priorité élevée.**

---

## C. Visualisation de graphes

C'est probablement le domaine le plus important.

Rechercher :

- `graph visualization`
- `tree layout algorithms`
- `family tree layout`
- `hierarchical graph layout`
- `DAG layout`
- `graph drawing`
- `SVG graph visualization`
- `Canvas graph rendering`
- `D3 hierarchy`
- `D3 tree`
- `D3 cluster`
- `D3 zoom`
- `graph culling`
- `graph virtualization`

---

## D. Généalogie / family tree UX

Rechercher :

- `genealogy UI`
- `family tree UX`
- `genealogy data model`
- `family relationship graph`
- `pedigree visualization`
- `ancestor descendant visualization`

Le but est de comprendre les problèmes spécifiques aux familles et pas seulement aux arbres informatiques.

---

## E. Data modeling

Rechercher :

- `relational genealogy database`
- `family relationship database`
- `graph data modeling`
- `SQLite relational modeling`
- `database normalization`
- `migration strategy`

---

## F. UX/UI

Rechercher :

- `information architecture`
- `data dense interface`
- `progressive disclosure`
- `complex data visualization UX`
- `dashboard UX`
- `premium SaaS UI`
- `editorial design system`
- `heritage archive interface`

---

## G. Design system

Rechercher :

- `design system`
- `design tokens`
- `typography scale`
- `accessible color system`
- `component states`
- `responsive design system`

---

## H. Accessibilité

Rechercher :

- `WCAG 2.2`
- `accessible data visualization`
- `keyboard navigation`
- `focus management`
- `reduced motion`
- `screen reader tree navigation`

---

## I. Performance

Rechercher :

- `React performance profiling`
- `large SVG performance`
- `Canvas rendering`
- `DOM virtualization`
- `memoization`
- `layout performance`
- `browser performance profiling`

---

## J. Testing

Rechercher :

- `Vitest`
- `React Testing Library`
- `Playwright`
- `visual regression testing`
- `performance testing`
- `property based testing`

---

# 37. Skills à prioriser

Si Antigravity ne peut pas tout rechercher, utiliser cet ordre :

### PRIORITÉ 1

`graph visualization + family tree layout + D3 hierarchy`

### PRIORITÉ 2

`React performance + large SVG/Canvas`

### PRIORITÉ 3

`genealogy data modeling`

### PRIORITÉ 4

`information architecture + progressive disclosure`

### PRIORITÉ 5

`Next.js 16 + React 19`

### PRIORITÉ 6

`accessibility WCAG`

### PRIORITÉ 7

`Playwright + visual regression`

### PRIORITÉ 8

`premium editorial design system`

---

# 38. Ce qu'il faut absolument éviter

Antigravity ne doit PAS :

- faire un simple redesign esthétique ;
- agrandir les cartes ;
- mettre toutes les personnes à l'écran ;
- utiliser des couleurs différentes pour chaque personne ;
- ajouter des emojis décoratifs ;
- mettre des animations partout ;
- utiliser des illustrations génériques ;
- ajouter des gradients sans raison ;
- utiliser un arbre radial uniquement parce qu'il "fait joli" ;
- remplacer D3 par une autre librairie sans benchmark ;
- réécrire SQLite sans nécessité ;
- inventer des fonctionnalités non demandées ;
- inventer des données familiales ;
- supprimer la vue hiérarchique ;
- sacrifier la lisibilité pour l'effet visuel.

---

# 39. Critères de réussite

Le projet sera considéré comme réussi si une personne qui ne connaît pas l'application peut :

### En moins de 10 secondes

Comprendre :

- où elle se trouve ;
- quelle branche elle regarde ;
- quelle personne est sélectionnée.

### En moins de 30 secondes

Pouvoir :

- retrouver un membre ;
- voir ses parents ;
- voir ses enfants ;
- ouvrir son profil.

### Avec 100 membres

L'arbre reste compréhensible.

### Avec 500 membres

L'utilisateur peut naviguer sans être submergé.

### Avec 1 000 membres

L'application reste utilisable grâce au focus, au regroupement, au repliage et au niveau de détail adaptatif.

---

# 40. Critère esthétique final

L'application doit donner cette impression :

> "C'est une véritable archive numérique de ma famille."

Et non :

> "C'est un template d'arbre généalogique généré automatiquement."

Le résultat doit être :

- professionnel ;
- sobre ;
- chaleureux ;
- patrimonial ;
- moderne ;
- lisible ;
- premium ;
- cohérent ;
- sans stickers ni éléments visuels enfantins.

---

# 41. Prompt de mission pour Antigravity

Utiliser ce texte comme consigne initiale :

> **Mission : refondre HeritageArchive en V2 sans casser les fonctionnalités existantes.**
>
> Tu dois commencer par auditer intégralement le projet et son système d'arbre. Ne modifie pas immédiatement le code.
>
> Le problème principal n'est pas uniquement esthétique : l'arbre doit pouvoir évoluer d'une vingtaine de membres vers 100, 300, 500 et potentiellement 1 000+ membres.
>
> Repenser donc l'arbre comme une visualisation interactive d'un graphe familial, avec :
>
> - branches repliables ;
> - focus sur une personne ;
> - vue ascendants ;
> - vue descendants ;
> - vue famille proche ;
> - niveau de détail adaptatif au zoom ;
> - recherche avec centrage automatique ;
> - ajout contextuel d'un enfant / parent / conjoint / frère-sœur ;
> - nœuds lisibles ;
> - relations clairement distinguées ;
> - performances mesurées sur de grandes familles ;
> - alternative hiérarchique accessible ;
> - expérience mobile adaptée.
>
> Avant toute implémentation, produire un audit puis une architecture cible.
>
> Consulter les connaissances / skills pertinentes concernant :
>
> - graph visualization ;
> - genealogy UX ;
> - family tree layout ;
> - D3 hierarchy ;
> - React performance ;
> - SVG/Canvas rendering ;
> - genealogy data modeling ;
> - progressive disclosure ;
> - WCAG 2.2 ;
> - Playwright ;
> - Next.js 16 / React 19.
>
> Respecter impérativement `AGENTS.md` et consulter la documentation locale de la version de Next.js installée avant toute modification Next.js.
>
> Ne jamais inventer de données familiales.
>
> Ne jamais privilégier un effet visuel au détriment de la lisibilité.
>
> Ne jamais considérer "plus joli" comme une solution au problème de structure.
>
> L'objectif final est une application qui ressemble à une **archive familiale numérique premium**, et dont l'arbre reste réellement utilisable quand la famille devient très grande.

---

# 42. Définition du "Done"

La V2 n'est pas terminée lorsque :

> "le nouvel arbre est joli."

Elle est terminée lorsque :

> **la famille peut continuer à ajouter des membres pendant plusieurs années sans que l'interface ne devienne chaotique.**

C'est le véritable objectif architectural du projet.
