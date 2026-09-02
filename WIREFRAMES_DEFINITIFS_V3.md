# WIREFRAMES DÉFINITIFS & LISIBILITÉ GÉNÉALOGIQUE V3 — HERITAGEARCHIVE

> **Document de référence :** `WIREFRAMES_DEFINITIFS_V3.md`  
> **Objectif :** Résoudre concrètement les défis généalogiques réels (couples, familles nombreuses, familles recomposées, transition de focus) et présenter les wireframes à l'échelle de **20, 100 et 500 membres** sur Desktop et Mobile.

---

## 1. RÈGLES GÉNÉALOGIQUES DE DISPOSITION VISUELLE

### 1.1 Couples & Unions Multiples (Familles Recomposées)

#### Cas A : Union Unique
Le couple forme une unité horizontale indissociable, le trait de filiation part du point d'alliance central :
```text
          ● Jean LISSANON ──┄┄── ┄ Rachel GBAGUIDI
                      │
            ┌─────────┴─────────┐
      ● Clara SOGLO       ● Lucas LISSANON
```

#### Cas B : Unions Multiples (Famille Recomposée)
La personne au centre (`★ Jean`) n'est **jamais dupliquée**. Ses conjoints sont disposés de part et d'autre ou groupés avec leurs enfants respectifs clairement étiquetés par lit :
```text
                         ★ JEAN LISSANON ★
                 ┌───────────────┴───────────────┐
         ┄ Anne DUPONT (1975–1985)        ┄ Marie KOFFI (1988–...)
                 │                               │
       ┌─────────┴─────────┐           ┌─────────┴─────────┐
   ● Enfant A1         ● Enfant A2 ● Enfant B1         ● Enfant B2
  (Demi-frères)       (Demi-frères)(Demi-sœurs)       (Demi-sœurs)
```
*Bénéfice immédiat :* L'utilisateur distingue d'un coup d'œil qui est né de quelle union, sans confusion.

---

### 1.2 Familles Nombreuses (6 à 12+ Enfants)
Pour éviter l'explosion horizontale (qui forçait autrefois à dézoomer et rendait le texte illisible) :
- **1 à 4 enfants** : Disposition sur une ligne horizontale avec connecteur en peigne.
- **5 à 12 enfants** : Disposition en **double rangée compacte (matrice $2 \times N$)** avec connecteur central vertical et branches latérales.

```text
                           ★ JEAN ─── ┄ ANNE ★
                                    │
       ┌────────────────────────────┼────────────────────────────┐
 ┌─────┴─────┐                ┌─────┴─────┐                ┌─────┴─────┐
 │ 1. Paul   │                │ 2. Marc   │                │ 3. Clara  │
 └───────────┘                └───────────┘                └───────────┘
 ┌─────┴─────┐                ┌─────┴─────┐                ┌─────┴─────┐
 │ 4. Joseph │                │ 5. Sarah  │                │ 6. David  │
 └───────────┘                └───────────┘                └───────────┘
```

---

### 1.3 Cinématique de Transition : Le Passage d'une Personne à une Autre

```
[ ÉTAT 1 : CLIC SIMPLE ]               [ ÉTAT 2 : EXPLORER (Bouton ou Double-Clic) ]
L'utilisateur clique sur Clara.         L'arbre s'anime en 300ms :
• Clara s'illumine (contour doré).     • Clara glisse doucement vers le CENTRE (★).
• L'arbre NE BOUGE PAS.                • Jean monte d'un cran au rang de PARENT.
• Le volet latéral s'ouvre à droite :  • Oscar (époux) apparaît à ses côtés.
  - Photo, dates, biographie           • Yanis (fils) apparaît en dessous.
  - Bouton [ 🌿 Explorer sa famille ]   • La boussole/minimap met à jour le curseur.
```

---

## 2. WIREFRAMES DESKTOP (20, 100 ET 500 MEMBRES)

---

### WIREFRAME DESKTOP 1 : ÉCHELLE 20 MEMBRES (Famille Proche Documentée)

*À 20 membres, la totalité du foyer et des proches est visible avec portraits et noms sans aucun encombrement.*

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  LISSANONArchive               [ ← Retour ]  [ ⌂ Racines ]              🔍 [ Rechercher... ]  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│                                           [ PARENTS ]                                            │
│                                    ┌───────────────────────┐                                     │
│                                    │   ● Paul ─── ┄ Dida   │                                     │
│                                    │      1920 – 1995      │                                     │
│                                    └───────────┬───────────┘                                     │
│                                                │                                                 │
│                     ┌──────────────────────────┼──────────────────────────┐                      │
│                     │                          │                          │                      │
│              [ FRATRIE ]                       │                     [ ALLIANCE ]                │
│        ┌──────────────────────┐                │                ┌──────────────────────┐         │
│        │ ● Valère  (1955)     │         ┌──────┴──────┐         │ ┄ Rachel GBAGUIDI    │         │
│        │ ● Alexis  (1960)     │ ─────── │★ CLAUDE ★   │ ┄┄┄┄┄┄─ │ (Épouse • 1956)      │ ──┐     │
│        │ ● Janvier (1964)     │         │ 1952 – 2021 │         └──────────────────────┘   │     │
│        └──────────────────────┘         └──────┬──────┘                                    │     │
│                                                │                                           │     │
│                                           [ ENFANTS ]                                      │[FICHE
│                                    ┌───────────┴───────────┐                               ││CLAUDE
│                         ┌──────────┴──────────┐ ┌──────────┴──────────┐                    ││1952-21
│                         │ ● Clara SOGLO       │ │ + 2 enfants         │                    ││Agron.
│                         │   (1982 • 1 enfant) │ │   à documenter      │                    ││       │
│                         │ [ 🌿 Explorer → ]   │ │ [ ＋ Ajouter ]      │                    ││[Fiche]│
│                         └─────────────────────┘ └─────────────────────┘                    │└──────┘│
│                                                                                                  │
│  ┌─ Boussole ─┐                                                                                  │
│  │   [Paul]   │                                                                                  │
│  │   ┌─┴─┐    │                                                                                  │
│  │   │ ★ │    │                                                                                  │
│  └────────────┘                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### WIREFRAME DESKTOP 2 : ÉCHELLE 100 MEMBRES (Multi-Branches & Fratries Élargies)

*À 100 membres, l'arbre maintient la lisibilité absolue : les branches cousines sont condensées en indicateurs de lignée discrets, tandis que le foyer de `★ Claude` reste clair.*

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  LISSANONArchive               [ ← Retour ]  [ ⌂ Racines ]              🔍 [ Rechercher... ]  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│                                        [ RACINE / PARENTS ]                                      │
│                                    ┌──────────────────────────┐                                  │
│                                    │  ● Paul (1920) ─── Dida  │                                  │
│                                    └────────────┬─────────────┘                                  │
│                                                 │                                                │
│         ┌─────────────────────┬─────────────────┼─────────────────┬─────────────────────┐        │
│  ┌──────┴──────┐       ┌──────┴──────┐          │          ┌──────┴──────┐       ┌──────┴──────┐ │
│  │ Lignée      │       │ Lignée      │          │          │ Lignée      │       │ Lignée      │ │
│  │ Valère (18) │       │ Alexis (14) │   ┌──────┴──────┐   │ Janvier (22)│       │ Régina (12) │ │
│  │ [Explorer]  │       │ [Explorer]  │   │★ CLAUDE ★   │   │ [Explorer]  │       │ [Explorer]  │ │
│  └─────────────┘       └─────────────┘   │ 34 membres  │   └─────────────┘       └─────────────┘ │
│                                          └──────┬──────┘                                         │
│                                                 │                                                │
│                                   [ ENFANTS DE LA BRANCHE (4) ]                                  │
│                   ┌─────────────────────────────┼─────────────────────────────┐                  │
│        ┌──────────┴──────────┐       ┌──────────┴──────────┐       ┌──────────┴──────────┐       │
│        │ ● Clara SOGLO       │       │ ● David LISSANON    │       │ ● Sarah LISSANON    │       │
│        │ 8 descendants       │       │ 12 descendants      │       │ 6 descendants       │       │
│        │ [ 🌿 Explorer → ]   │       │ [ 🌿 Explorer → ]   │       │ [ 🌿 Explorer → ]   │       │
│        └─────────────────────┘       └─────────────────────┘       └─────────────────────┘       │
│                                                                                                  │
│  ┌─ Boussole 100 ─┐                                                                              │
│  │    [Racine]    │                                                                              │
│  │  ┌─┬─┼─┬─┐     │                                                                              │
│  │    │★│         │  (Claude au centre de la dynastie)                                           │
│  └────────────────┘                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### WIREFRAME DESKTOP 3 : ÉCHELLE 500 MEMBRES (Fenêtre Glissante de Proximité)

*À 500 membres, l'application applique une fenêtre glissante de $\pm 2$ générations autour de `★ activePerson`. Pas de mur de 500 nœuds : une exploration à 60 FPS calme et précise.*

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  LISSANONArchive               [ ← Retour ]  [ ⌂ Racines ]              🔍 [ Rechercher... ]  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  Lignée active : Paul > Claude > Clara > [ ★ YANIS SOGLO ★ ]                                     │
│                                                                                                  │
│                                       [ GRANDS-PARENTS (4) ]                                     │
│                      ┌──────────────────────────┴──────────────────────────┐                     │
│               [ Paternels : Oscar Sr & Anne ]               [ Maternels : Claude & Rachel ]      │
│                                                                            │                     │
│                                                                       [ PARENTS ]                │
│                                                              ┌─────────────┴─────────────┐       │
│                                                              │  ● Oscar ─── ┄ Clara (82) │       │
│                                                              └─────────────┬─────────────┘       │
│                                                                            │                     │
│                                                                    ┌───────┴───────┐             │
│                                                                    │★ YANIS SOGLO★ │             │
│                                                                    │ Né en 2012    │             │
│                                                                    └───────┬───────┘             │
│                                                                            │                     │
│                                                                    [ PROCHAINE GÉNÉRATION ]      │
│                                                                    ┌───────┴───────┐             │
│                                                                    │ ＋ Ajouter un │             │
│                                                                    │   descendant  │             │
│                                                                    └───────────────┘             │
│  ┌─ Boussole 500 ─┐                                                                              │
│  │ [Gen 1: Paul]  │                                                                              │
│  │   └── [Gen 2]  │                                                                              │
│  │        └── [Gen 3: Clara]                                                                     │
│  │             └── [★ Gen 4: Yanis]                                                              │
│  └────────────────┘                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. WIREFRAMES MOBILE (20, 100 ET 500 MEMBRES)

*Sur smartphone (< 768px), pas de canevas miniature illisible : un arbre vertical structuré avec embranchements visuels clairs et tap d'exploration.*

---

### WIREFRAME MOBILE 1 : ÉCHELLE 20 MEMBRES (Foyer Structuré)

```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│ [ ← Retour ]         [ ⌂ Racines ]│
│                                   │
│            ┌─────────┐            │
│            │  PÈRE   │ ─── MÈRE   │  (Niveau -1 : Parents)
│            │  Paul   │    Dida    │
│            └────┬────┘            │
│                 │                 │
│                 ▼                 │
│         ╭───────────────╮         │
│         │★ CLAUDE (52-21) ★       │  (Niveau 0 : Centre)
│         ╰───────┬───────╯         │
│                 │ ┄┄ Rachel (Ép.) │
│       ┌─────────┴─────────┐       │
│       │                   │       │
│  [ FRATRIE ]         [ ENFANTS ]  │  (Embranchements clairs)
│  ┌─────────┐         ┌─────────┐  │
│  │ Valère  │         │ Clara   │  │
│  │ Alexis  │         │ (1 enf) │  │
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

### WIREFRAME MOBILE 2 : ÉCHELLE 100 MEMBRES (Navigation par Lignées & Lits)

```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│ [ ← Retour ]         [ ⌂ Racines ]│
│                                   │
│ ── Branche de Claude (34 pers) ── │
│                                   │
│         ╭───────────────╮         │
│         │★ CLAUDE ★     │         │
│         ╰───────┬───────╯         │
│                 │                 │
│ ── 1ère Union : avec Rachel ───── │
│ ┌───────────────────────────────┐ │
│ │ ● Clara SOGLO                 │ │
│ │   8 descendants répertoriés   │ │
│ │   [ 🌿 Explorer la branche ]  │ │
│ ├───────────────────────────────┤ │
│ │ ● David LISSANON              │ │
│ │   12 descendants              │ │
│ │   [ 🌿 Explorer la branche ]  │ │
│ └───────────────────────────────┘ │
│                                   │
│ ── Frères & Sœurs de Claude ───── │
│ [● Valère (18)] [● Janvier (22)]  │
│                                   │
│ ───────────────────────────────── │
│ [ 📖 Voir la fiche complète ]     │
└───────────────────────────────────┘
```

---

### WIREFRAME MOBILE 3 : ÉCHELLE 500 MEMBRES (Fil d'Ariane & Navigation Rapide)

```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│ [ ← Retour ]         [ ⌂ Racines ]│
│                                   │
│ ── Fil Généalogique ───────────── │
│ Paul > Claude > Clara > [★ YANIS] │
│                                   │
│              [ PARENTS ]          │
│        ┌────────────────────┐     │
│        │ ● Oscar ─── Clara  │     │
│        └─────────┬──────────┘     │
│                  │                │
│                  ▼                │
│          ╭──────────────╮         │
│          │★ YANIS SOGLO ★         │
│          │  Né en 2012  │         │
│          ╰───────┬──────╯         │
│                  │                │
│                  ▼                │
│        ┌────────────────────┐     │
│        │ ＋ Ajouter un      │     │
│        │    descendant      │     │
│        └────────────────────┘     │
│                                   │
│ ── Remonter vers ──────────────── │
│ [ 🌿 Foyer de Clara (Mère) ]      │
│ [ 🌿 Branche LISSANON (Racine) ]  │
└───────────────────────────────────┘
```

---

## 4. MATRICE RÉCAPITULATIVE DE VALIDATION

| Problématique Généalogique | Solution Technique & Visuelle V3 |
| :--- | :--- |
| **Couples & Alliances** | Unité horizontale claire `● ─── ┄` avec ligne d'alliance dorée sans duplication. |
| **Familles Recomposées** | Personne centrale unique, enfants sous-groupés par lit (`1ère union`, `2nde union`). |
| **Familles Nombreuses (8-12 enfants)** | Matrice $2 \times N$ compacte avec connecteurs orthogonaux évitant l'étalement infini. |
| **Passage d'une personne à une autre** | Clic = sélection/fiche latérale ; Bouton "Explorer" = animation fluide vers le nouveau centre `★`. |
| **Boussole d'orientation** | Widget discret en coin d'écran montrant le fil et la position relative dans la dynastie. |
| **Scalabilité 20 à 500+ membres** | Fenêtre glissante de $\pm 2$ générations autour de `★ activePerson` garantissant 60 FPS et clarté totale. |
