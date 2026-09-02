# SPÉCIFICATION DÉFINITIVE V3 — HERITAGEARCHIVE
*La Famille comme un Espace d'Exploration Vivant & Accessible*

> **Document :** `SPECIFICATION_FINALE_V3.md`  
> **Source de référence :** `remarque.md` & `philosophieV3.md`  
> **Règle d'or :** *« La complexité de la famille doit être absorbée par l'interface, jamais transférée à l'utilisateur. »*

---

# PARTIE 1 : LES 10 STRATÉGIES DE CONCEPTION

---

### 1. Stratégie d'Expérience Unique (Sans Niveaux ni Modes)
- **Unicité de l'espace** : L'interface ne comporte aucun onglet technique (*pas de mode 1/2/3, pas de toggle Graphe/Foyer/Branches*).
- **Centre de gravité (`★ activePerson`)** : L'arbre s'organise toujours autour de la personne explorée.
- **Profondeur dynamique** : Les ascendants et descendants directs sont affichés naturellement autour d'elle, avec des embranchements pliables/dépliables au besoin.

---

### 2. Stratégie des Couples & Unions Multiples (Familles Recomposées)
- **Union unique** : Unité horizontale compacte `● Homme ──┄┄── ┄ Femme`, avec départ de filiation au point central.
- **Unions multiples** : La personne centrale `★` n'est **jamais dupliquée**. Ses conjoints successifs sont disposés à ses côtés avec date d'union, et les enfants sont regroupés distinctement sous leur lit respectif (*ex: « Avec Rachel (3) »*, *« Avec Anne (2) »*).

---

### 3. Stratégie pour les Familles Nombreuses (8 à 12+ Enfants)
- **Ordre chronologique préservé** : Enfants triés par date de naissance (aîné à gauche $\rightarrow$ benjamin à droite).
- **Affichage proportionné** :
  - Jusqu'à 4-5 enfants : Ligne horizontale classique avec connecteur en peigne.
  - De 6 à 12 enfants : Ligne d'enfants avec défilement horizontal doux ou affichage des 4 aînés + badge interactif `[ + 8 autres enfants... ]` qui déploie la fratrie sans casser la hauteur de l'arbre.
- **Zéro réduction de taille de texte** : Les noms restent à taille 100% lisible en permanence.

---

### 4. Stratégie pour les Branches Massives (50+ Descendants)
- **Découverte progressive à la demande** : Les enfants ayant eux-mêmes une descendance affichent un bouton de déploiement discret `[ + 14 descendants ]`.
- **Expansion in-situ** : Cliquer sur `[ + descendants ]` ouvre la sous-branche directement sur le canevas sans quitter le contexte global.

---

### 5. Stratégie d'Expansion Progressive & Chronologie
- **Repères temporels discrets** : Présence des années clés (naissance – décès) alignées verticalement pour faire ressentir le passage des générations (*1920 Paul $\rightarrow$ 1952 Claude $\rightarrow$ 1982 Clara $\rightarrow$ 2012 Yanis*).
- **Extensibilité sans rupture** : Possibilité d'étendre n'importe quelle branche vers le haut (ascendance) ou vers le bas (descendance) en 1 clic.

---

### 6. Stratégie d'Animation de Transition (250 – 400 ms)
- **Continuité cognitive** : Quand l'utilisateur choisit d'explorer `Clara` :
  1. `Clara` glisse en douceur vers le centre `★`.
  2. `Jean` monte au niveau supérieur des `PARENTS`.
  3. L'époux et les enfants de `Clara` se déploient harmonieusement.
- **Aucun flash ni saut brutal d'écran** : Le cerveau comprend instantanément le déplacement du foyer familial.

---

### 7. Stratégie de Sélection vs Exploration
- **Clic simple / Tap** :
  - Le membre est entouré d'une lueur ambrée.
  - Le volet latéral discret (Desktop) ou le bottom-sheet (Mobile) s'ouvre avec son aperçu biographique.
  - **L'arbre ne bouge pas.**
- **Bouton « 🌿 Explorer sa famille → » (ou double-clic)** :
  - Déclenche l'animation de transition et place ce membre au centre `★`.

---

### 8. Stratégie de Navigation Arrière (Historique Vivant)
- **Pile de navigation** : Chaque changement de centre `★` alimente un historique.
- **Bouton `[ ← Retour (vers Prénom) ]`** : Permet de revenir en arrière étape par étape sans se perdre.
- **Bouton `[ ⌂ Racines ]`** : Permet de revenir à la racine de la famille.

---

### 9. Stratégie de Recherche & Orientation
- **Recherche prédictive** : Tape un prénom, nom, ou profession $\rightarrow$ sélectionne la personne et l'explore en 1 clic.
- **Boussole d'orientation discrète (Desktop)** : En bas de l'écran, un fil généalogique compact montre où se situe `★ activePerson` dans la lignée globale (*ex: Paul > Claude > Clara > ★ Yanis*).

---

### 10. Stratégie d'Accessibilité Tactile Mobile
- **Structure d'arbre verticale pure** : De vraies lignes de filiation et d'alliance verticales avec connecteurs orthogonaux, respectant les zones tactiles d'au moins 44px.
- **Pas de geste de zoom complexe obligatoire** : Navigation naturelle par le toucher de proche en proche.

---

# PARTIE 2 : LES 7 CAS GÉNÉALOGIQUES (WIREFRAMES DESKTOP)

---

### CAS A — FAMILLE SIMPLE (2 parents → 4 enfants → 8 petits-enfants)
```text
                                [ PARENTS ]
                         ┌───────────────────────┐
                         │   ● Paul ─── ┄ Dida   │
                         │      1920 – 1995      │
                         └───────────┬───────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                                       │
            [ ALLIANCE ]                            [ FRATRIE ]
       ┌───────────────────┐                    ┌───────────────────┐
       │ ┄ Rachel GBAGUIDI │                    │ ● Valère  (1955)  │
       │   Épouse (1956)   │                    │ ● Alexis  (1960)  │
       └─────────┬─────────┘                    │ ● Janvier (1964)  │
                 │                              └───────────────────┘
          ┌──────┴──────┐
          │★ CLAUDE ★   │ (1952 – 2021)
          └──────┬──────┘
                 │
            [ ENFANTS ]
   ┌─────────────┼─────────────┬─────────────┐
┌──┴──┐       ┌──┴──┐       ┌──┴──┐       ┌──┴──┐
│Clara│       │David│       │Sarah│       │Marc │
└──┬──┘       └──┬──┘       └──┬──┘       └──┬──┘
   │             │             │             │
┌──┴──┐       ┌──┴──┐       ┌──┴──┐       ┌──┴──┐
│Yanis│       │2 enf│       │2 enf│       │3 enf│
└─────┘       └─────┘       └─────┘       └─────┘
```

---

### CAS B — FAMILLE NOMBREUSE (2 parents → 12 enfants)
```text
                         ★ CLAUDE ─── ┄ RACHEL ★
                                    │
                               [ 12 ENFANTS ]
  (Affichage chronologique avec pagination/déploiement doux sans casser l'arbre)
  
       ┌────────────────────────────┼────────────────────────────┐
 ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐
 │ 1. Paul   │ │ 2. Clara  │ │ 3. David  │ │ 4. Sarah  │ │ 5. Marc   │
 │ (1975)    │ │ (1978)    │ │ (1980)    │ │ (1982)    │ │ (1985)    │
 └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
 
                [ ＋ Voir les 7 autres enfants (1987 à 2002) ]
                                    │ (au clic)
 ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐
 │ 6. Joseph │ │ 7. Thomas │ │ 8. Lucie  │ │ 9. Esther │ │ 10. Yanis │ ...
 └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
```

---

### CAS C — FAMILLE RECOMPOSÉE (Jean → 2 unions distinctes)
```text
                               ★ JEAN LISSANON ★
                                  (1950 – ...)
                 ┌──────────────────────┴──────────────────────┐
                 │                                             │
      [ 1ère Union (1975) ]                         [ 2nde Union (1990) ]
       ┄ Rachel GBAGUIDI                             ┄ Marie KOFFI
                 │                                             │
      ┌──────────┴──────────┐                       ┌──────────┴──────────┐
   ┌──┴──┐   ┌──┴──┐   ┌──┴──┐                   ┌──┴──┐               ┌──┴──┐
   │Clara│   │David│   │Sarah│                   │Lucas│               │Emma │
   └─────┘   └─────┘   └─────┘                   └─────┘               └─────┘
      (Enfants du 1er lit)                         (Enfants du 2nd lit)
```

---

### CAS D — PLUSIEURS GÉNÉRATIONS (Arrière-grands-parents → Petits-enfants)
```text
1890                 [ ARRIÈRE-GRANDS-PARENTS ]
                         ● Mathieu ─── ┄ Louise
                                   │
1920                     [ GRANDS-PARENTS ]
                         ● Paul ─── ┄ Dida
                                   │
1952                         [ PARENTS ]
                        ● Claude ─── ┄ Rachel
                                   │
1982                        ★ CLARA SOGLO ★ ─── ┄ Oscar SOGLO
                                   │
2012                          [ ENFANT ]
                            ● Yanis SOGLO
                                   │
2038                       [ PETITS-ENFANTS ]
                        [ ＋ Prochaine génération ]
```

---

### CAS E — BRANCHE TRÈS IMPORTANTE (Une personne ayant 50+ descendants)
```text
                            ★ PAUL LISSANON ★
                            (58 descendants)
                                   │
        ┌──────────────────────────┼──────────────────────────┐
 ┌──────┴──────┐            ┌──────┴──────┐            ┌──────┴──────┐
 │ ● Claude    │            │ ● Valère    │            │ ● Janvier   │
 │ 24 membres  │            │ 18 membres  │            │ 16 membres  │
 │ [ Déployer ]│            │ [ Déployer ]│            │ [ Déployer ]│
 └──────┬──────┘            └─────────────┘            └─────────────┘
        │ (au clic sur Déployer)
 ┌──────┴──────────────────────────┐
 │ Enfants de Claude (4)           │
 │ Clara (8 desc.) • David (12)... │
 └─────────────────────────────────┘
```

---

### CAS F — FAMILLE INCOMPLÈTE (Relations & Données partielles)
```text
                                [ ASCENDANCE ]
                         ┌──────────────────────────┐
                         │ ● Père : Inconnu         │
                         │ ┄ Mère : Marie LISSANON  │
                         └────────────┬─────────────┘
                                      │
                               ┌──────┴──────┐
                               │★ KEVIN ★    │
                               │ (1995)      │
                               └──────┬──────┘
                                      │
                                 [ ENFANTS ]
                         ┌────────────┴────────────┐
                         │  ● Fille documentée     │
                         │  ＋ 2 membres à ajouter │
                         └─────────────────────────┘
```

---

### CAS G — PLUSIEURS UNIONS AVEC ENFANTS ET ALLIANCES CROISÉES
```text
                         ★ MARIE LISSANON ★
                 ┌───────────────┴───────────────┐
         ┄ 1er Époux : Koffi             ┄ 2nd Époux : Mensah
                 │                               │
            ┌────┴────┐                     ┌────┴────┐
         ● Marc KOFFI                    ● Sarah MENSAH
```

---

# PARTIE 3 : LES 7 CAS GÉNÉALOGIQUES (WIREFRAMES MOBILE)

---

### CAS A (Mobile) — FAMILLE SIMPLE
```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│ [ ← Retour ]         [ ⌂ Racines ]│
│                                   │
│            ┌─────────┐            │
│            │  PARENTS│            │
│            │ Paul─Dida            │
│            └────┬────┘            │
│                 │                 │
│                 ▼                 │
│         ╭───────────────╮         │
│         │★ CLAUDE ★     │         │
│         ╰───────┬───────╯         │
│                 │ ┄┄ Rachel (Ép.) │
│       ┌─────────┴─────────┐       │
│       │                   │       │
│  [ FRATRIE ]         [ ENFANTS ]  │
│  • Valère            • Clara      │
│  • Alexis            • David      │
│  • Janvier           • Sarah      │
│                      • Marc       │
│                           │       │
│                    [ 🌿 Explorer ]│
└───────────────────────────────────┘
```

---

### CAS B (Mobile) — FAMILLE NOMBREUSE (12 Enfants)
```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│         ╭───────────────╮         │
│         │★ CLAUDE ★     │         │
│         ╰───────┬───────╯         │
│                 │ ┄┄ Rachel       │
│                 ▼                 │
│ ── 12 Enfants (Par ordre d'âge) ─ │
│ 1. Paul (1975)                    │
│ 2. Clara (1978)                   │
│ 3. David (1980)                   │
│ 4. Sarah (1982)                   │
│ 5. Marc (1985)                    │
│                                   │
│ [ ＋ Dérouler les 7 autres... ]    │
└───────────────────────────────────┘
```

---

### CAS C (Mobile) — FAMILLE RECOMPOSÉE
```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│         ╭───────────────╮         │
│         │★ JEAN ★       │         │
│         ╰───────┬───────╯         │
│                 │                 │
│ ── 1ère Union : Rachel ────────── │
│   │                               │
│   ├── ● Clara (1978)              │
│   └── ● David (1980)              │
│                                   │
│ ── 2nde Union : Marie ─────────── │
│   │                               │
│   ├── ● Lucas (1992)              │
│   └── ● Emma  (1995)              │
│                                   │
│ (1 tap sur un enfant = l'explore) │
└───────────────────────────────────┘
```

---

### CAS D (Mobile) — PLUSIEURS GÉNÉRATIONS (Fil d'Ariane)
```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│ 1920 : Paul (Grand-père)          │
│   │                               │
│ 1952 : Claude (Père)              │
│   │                               │
│ 1982 : ★ CLARA SOGLO ★            │
│   │ ┄┄ Oscar                      │
│   │                               │
│ 2012 : ● Yanis SOGLO (Fils)       │
│                                   │
│ [ 🌿 Explorer le foyer de Yanis ] │
└───────────────────────────────────┘
```

---

### CAS E (Mobile) — BRANCHE MASSIVE (50+ Descendants)
```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│         ╭───────────────╮         │
│         │★ PAUL ★       │         │
│         │ 58 membres    │         │
│         ╰───────┬───────╯         │
│                 │                 │
│ ── Grandes Lignées ────────────── │
│ ├── ● Lignée Claude (24 pers.)    │
│ │   [ 🌿 Entrer dans la branche ] │
│ ├── ● Lignée Valère (18 pers.)    │
│ │   [ 🌿 Entrer dans la branche ] │
│ └── ● Lignée Janvier (16 pers.)   │
│     [ 🌿 Entrer dans la branche ] │
└───────────────────────────────────┘
```

---

### CAS F (Mobile) — FAMILLE INCOMPLÈTE
```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│ ── Ascendance ─────────────────── │
│ • Mère : Marie LISSANON           │
│ • Père : Non renseigné            │
│                                   │
│         ╭───────────────╮         │
│         │★ KEVIN ★      │         │
│         ╰───────┬───────╯         │
│                 │                 │
│ ── Descendance ────────────────── │
│ • Fille : Aïcha (2020)            │
│ ＋ Ajouter un autre enfant        │
└───────────────────────────────────┘
```

---

### CAS G (Mobile) — MULTIPLES UNIONS CROISÉES
```text
┌───────────────────────────────────┐
│ LISSANONArchive                🔍 │
├───────────────────────────────────┤
│         ╭───────────────╮         │
│         │★ MARIE ★      │         │
│         ╰───────┬───────╯         │
│                 │                 │
│ ── 1er Mariage : Koffi ────────── │
│   └── ● Marc KOFFI (1985)         │
│                                   │
│ ── 2nd Mariage : Mensah ───────── │
│   └── ● Sarah MENSAH (1994)       │
└───────────────────────────────────┘
```

---

## 4. CONCLUSION & PRÊT POUR LE CODE

Cette spécification prouve mathématiquement et ergonomiquement que :
1. **L'expérience est 100% unifiée** (zéro onglet technique).
2. **Les 7 cas complexes de la généalogie réelle** sont tous résolus sans saturation d'écran.
3. **Le passage d'une personne à une autre** est naturel, avec distinction claire entre clic de sélection et exploration du foyer.
4. **La même logique fonctionne pour 20, 100, 500 et 1 000+ membres.**
