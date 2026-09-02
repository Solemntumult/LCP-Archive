# ARCHITECTURE & WIREFRAMES V3 (RÉVISÉS) — HERITAGEARCHIVE
*Intégration des retours de `remarque.md` et spécifications d'implémentation finale*

> **Date :** 31 août 2026  
> **Source de référence :** `philosophieV3.md` + `remarque.md`  
> **Règle d'or :** *« Ne cherche pas à rendre l'arbre spectaculaire. Cherche à rendre les relations évidentes. »*

---

## 1. PRINCIPES VALIDÉS & AJUSTEMENTS MAJEURS

### 1.1 Ce qui est validé
- **Expérience Unifiée** : Fin des onglets de mode (Graphe, Foyer, Branches, Déroulante). Un seul espace d'exploration organique.
- **`activePerson` comme centre dynamique de gravité (`★`)**.
- **Desktop $\neq$ Mobile** : Expériences taillées sur-mesure pour chaque support.
- **Historique de navigation** avec bouton `[← Retour]`.
- **Couples comme unités relationnelles claires** sans duplication.
- **Tolérance bienveillante de l'incomplétude**.
- **Barre d'outils apaisée** (actions minimalistes et essentielles).

### 1.2 Ajustements Clés intégrés depuis `remarque.md`
1. **Racine Familiale Flexible (Pas de "Patriarche Unique" forcé)** :
   - Détection intelligente de la première racine, avec sélecteur de point d'entrée ou de racine familiale pour les familles à plusieurs branches fondatrices.
2. **Séparation nette entre "Sélectionner" et "Explorer"** :
   - **Simple Clic / Tap** : Ouvre l'aperçu/fiche de la personne (ne déplace pas le centre de l'arbre).
   - **Double-Clic ou Bouton explicite `[ Explorer sa famille → ]`** : Déplace le centre d'attention `★` sur cette personne.
3. **Transition Visuelle Douce (Continuité Cognitive)** :
   - Animation douce (`transition-all duration-300 ease-out`) pour que le regard suive la personne qui se place au centre pendant que ses ascendants et descendants se déploient.
4. **Mobile : Un Arbre Vertical Visuellement Structuré (Pas une fiche Wikipédia)** :
   - De vrais embranchements visuels, des connecteurs orthogonaux et des micro-cartes compactes dans un flux vertical élégant.
5. **Minimap / Indicateur d'Orientation Discret (Desktop)** :
   - Une boussole familiale discrète en coin d'écran montrant où se situe `★ activePerson` par rapport à la structure globale.

---

## 2. MODÈLE D'ÉTAT & INTERACTIONS V3

```typescript
interface TreeV3State {
  centerPersonId: number;         // La personne au centre de l'arbre (★)
  selectedPersonId: number | null; // La personne sélectionnée (affichée dans le drawer/sheet)
  history: number[];              // Historique des centres explorés pour le [← Retour]
  searchQuery: string;
  isTransitioning: boolean;       // Verrou d'animation douce
}
```

### Matrice d'Interaction :
- **Action sur un Nœud / Proche** :
  - `Click / Tap` $\rightarrow$ `setSelectedPersonId(id)` (Aperçu dans le volet latéral ou bottom sheet sans changer le centre de l'arbre).
  - `Double-click` ou `Clic sur "Explorer sa famille"` $\rightarrow$ `setCenterPersonId(id)` avec transition douce + ajout à `history`.
- **Bouton `[← Retour]`** : Dépile le dernier `centerPersonId` de `history`.
- **Bouton `[⌂ Racines]`** : Revient à la racine de la famille.
- **Bouton `[🔍 Rechercher]`** : Permet de trouver instantanément un membre et de l'explorer.

---

## 3. WIREFRAMES TECHNIQUES V3

---

### WIREFRAME 1 : DESKTOP — LE VOISINAGE VIVANT & SA BOUSSOLE

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  LISSANONArchive                   [ ← Retour ]  [ ⌂ Racines ]         🔍 [ Rechercher... ]  │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│                                      [ GRANDS-PARENTS ]                                      │
│                                       ┌──────────────┐                                       │
│                                       │ ● Ancêtres   │                                       │
│                                       └──────┬───────┘                                       │
│                                              │                                               │
│                                         [ PARENTS ]                                          │
│                               ┌──────────────┴──────────────┐                                │
│                               │      ● Paul ─── ┄ Dida      │                                │
│                               └──────────────┬──────────────┘                                │
│                                              │                                               │
│                     ┌────────────────────────┼────────────────────────┐                      │
│                     │                        │                        │                      │
│              [ FRATRIE ]                     │                   [ ALLIANCE ]                │
│        ┌─────────────────────┐               │              ┌─────────────────────┐          │
│        │ ● Valère   ● Alexis │        ┌──────┴──────┐       │ ┄ Rachel GBAGUIDI   │          │
│        │ ● Janvier  ● Régina │ ────── │★ CLAUDE ★   │ ───── │ (Épouse)            │ ──┐      │
│        └─────────────────────┘        │ 1952 – 2021 │       └─────────────────────┘   │      │
│                                       └──────┬──────┘                                 │      │
│                                              │                                        │      │
│                                         [ ENFANTS ]                                   │[APERÇU]
│                               ┌──────────────┴──────────────┐                         │┌────┐│
│                    ┌──────────┴──────────┐       ┌──────────┴──────────┐              ││CLAU││
│                    │  ● Clara SOGLO      │       │  + 2 enfants        │              ││DE  ││
│                    │  (1 enfant : Yanis) │       │  à documenter       │              ││    ││
│                    │  [ 🔍 Aperçu ]      │       │  [ ＋ Ajouter ]     │              ││[Ex-││
│                    │  [ 🌿 Explorer → ]  │       └─────────────────────┘              ││plo-││
│                    └─────────────────────┘                                            ││rer]││
│                                                                                       │└────┘│
│  ┌─ Orientation ─┐                                                                           │
│  │    ┌─●─┐      │                                                                           │
│  │ ───┼───┼──    │                                                                           │
│  │    │ ★ │      │                                                                           │
│  └───────────────┘                                                                           │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### WIREFRAME 2 : MOBILE — L'ARBRE VERTICAL STRUCTURÉ (AVEC EMBRANCHEMENTS)

*Conserve la structure visuelle d'un arbre généalogique en format vertical sans perte de lisibilité.*

```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│ [ ← Retour ]         [ ⌂ Racines ]│
│                                   │
│            ┌─────────┐            │
│            │  PÈRE   │ ─── MÈRE   │  (Niveau -1 : Parents reliés)
│            └────┬────┘            │
│                 │                 │
│                 ▼                 │
│         ╭───────────────╮         │
│         │★ CLAUDE (52-21) ★       │  (Niveau 0 : Centre actif)
│         ╰───────┬───────╯         │
│                 │ ┄┄ Épouse Rachel│
│       ┌─────────┴─────────┐       │
│       │                   │       │
│  [ FRATRIE ]         [ ENFANTS ]  │  (Embranchements clairs)
│  ┌─────────┐         ┌─────────┐  │
│  │ Valère  │         │ Clara   │  │
│  │ Alexis  │         │ (Yanis) │  │
│  │ Janvier │         └────┬────┘  │
│  └─────────┘              │       │
│                           ▼       │
│                    [ 🌿 Explorer ]│  (1 tap pour recentrer sur Clara)
│                                   │
│ ───────────────────────────────── │
│ ＋ Ajouter un enfant / parent     │
└───────────────────────────────────┘
```

---

## 4. FEUILLE DE ROUTE D'IMPLÉMENTATION IMMÉDIATE

1. **Suppression définitive des 4 onglets techniques de `/tree`**.
2. **Composant Maître `LivingFamilyExplorer.tsx`** :
   - Mode Desktop : Canevas spacieux centré sur `★ activePerson` avec grands-parents, parents, personne + conjoint + fratrie, enfants, minimap et panneau d'aperçu.
   - Mode Mobile : Arbre vertical structuré avec embranchements et connecteurs SVG à angles droits.
3. **Moteur d'Interaction `Select` vs `Explore`** :
   - Clic / Tap simple = Ouvre l'aperçu à droite (sans bouger l'arbre).
   - Bouton "Explorer sa famille" / Double-clic = Transition douce vers le nouveau centre `★`.
4. **Boussole d'orientation discrète sur Desktop**.
