# ARCHITECTURE CIBLE — HeritageArchive V2

> **Document :** `TREE_V2_ARCHITECTURE.md`  
> **Version :** 2.0.0  
> **Statut :** Spécification Technique & Fonctionnelle Validée  

---

## 1. Pipeline de Traitement des Données (Data-to-Canvas Pipeline)

Pour découpler totalement l'algorithme généalogique du JSX React et garantir un calcul pur, testable et ultra-rapide sur 1 000+ membres, le pipeline est structuré en 6 couches séquentielles :

```
┌────────────────────────────────────────────────────────┐
│ 1. DATA (SQLite / API tree-data)                       │
│    Array de TreeNodeData brutes                        │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 2. RELATION GRAPH (buildFamilyGraph)                   │
│    DAG bidirectionnel (Parents, Conjoints, Enfants)     │
│    Calcul des générations & tailles réelles de branches│
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 3. FILTER & PROJECTION (filterGraphByMode)             │
│    Modes : 'full' | 'focus' | 'descendants' | 'ancestors'
│    Application des branches repliées (collapsedBranches)
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 4. LAYOUT ENGINE (computeTreeLayoutV2)                 │
│    Calcul récursif des sous-arbres & boîtes de collision
│    Positionnement 2D (x, y, w, h) & chemins SVG 90°    │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 5. VIEW MODEL (TreeViewModel)                          │
│    Nodes positionnés + Connecteurs + Bounds + LOD      │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 6. RENDERER & INTERACTIONS (FamilyTree React 19)       │
│    TreeViewport + TreeConnections (SVG) + PersonNode   │
│    Touch Pan/Zoom + Focus + Drawer + Ajout Contextuel  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Les 4 Modes de Visualisation Fondamentaux

### Mode 1 : Toute la Famille (`mode = 'full'`)
- Visualise l'ensemble de la dynastie familiale depuis les patriarches fondateurs.
- **Support des Branches Repliables (`BranchNode`)** : Chaque sous-branche peut être condensée en un badge interactif `[ Branche de Paul • 14 membres [+] ]` pour libérer l'espace visuel.

### Mode 2 : Famille Proche / Family Focus (`mode = 'focus'`)
- Recentrage immédiat sur la personne sélectionnée :
  - **Au-dessus (Niveau -1)** : Parents (Père & Mère).
  - **Au centre (Niveau 0)** : Personne sélectionnée + Conjoint(s).
  - **En-dessous (Niveau +1)** : Enfants groupés par conjoint.
  - **Latéral** : Fratrie directe.
- Permet de comprendre instantanément le foyer immédiat sans encombrement.

### Mode 3 : Descendance (`mode = 'descendants'`)
- Arbre descendant pur partant de l'individu sélectionné jusqu'aux arrière-petits-enfants.
- Idéal pour explorer la postérité d'un patriarche ou d'un aïeul.

### Mode 4 : Ascendance (`mode = 'ancestors'`)
- Arbre ascendant (lignée des pères et mères) remontant vers les racines fondatrices.

---

## 3. Niveau de Détail Adaptatif au Zoom (LOD - Level of Detail)

L'arbre s'adapte automatiquement à l'échelle de zoom (`zoomScale`) :

```
Zoom Éloigné (< 0.6x)          Zoom Standard (0.6x - 1.2x)       Zoom Rapproché (> 1.2x)
[LOD Compact]                  [LOD Standard]                     [LOD Détaillé]
      ◉                              ╭─────╮                      ┌──────────────────┐
    Jean                             │  ◉  │                      │     [PHOTO]      │
 (Micro-avatar +                   Jean LISSANON                  │  JEAN LISSANON   │
  point de lignée)                   1952–2021                    │    1952 – 2021   │
                                (Cercle 60px + Cadre)             │    Ingénieur     │
                                                                  │  ✓ Fiche 100%    │
                                                                  └──────────────────┘
```

---

## 4. Ajout Contextuel de Membre (Expérience P0)

Depuis n'importe quel nœud sélectionné ou depuis le panneau latéral :
Bouton **`+ Ajouter un proche`** déclenchant un modal avec 4 choix contextuels pré-remplis :
1. **`Ajouter un Enfant`** : Le parent sélectionné est pré-rempli (avec choix du conjoint co-parent).
2. **`Ajouter un Parent`** : Sélection automatique du rôle Père ou Mère pour l'individu.
3. **`Ajouter un Conjoint`** : Relation d'alliance pré-configurée.
4. **`Ajouter un Frère / une Sœur`** : Les parents de l'individu sélectionné sont automatiquement assignés.

---

## 5. Architecture des Composants V2

```
src/components/tree/
├── FamilyTree.tsx                 # Composant maître orchestrant état, graphe et modes
├── TreeToolbar.tsx                # Barre d'outils (Modes, LOD, Zoom, Fit, Recherche, Reset)
├── TreeViewport.tsx               # Conteneur Pan/Zoom haute performance (Touch + Souris)
├── TreeConnections.tsx            # Rendu SVG vectoriel des lignes orthogonales à 90°
├── PersonNode.tsx                 # Nœud unifié (LOD compact, standard, détaillé, états focus)
├── BranchNode.tsx                 # Badge condensé de sous-branche avec compteur réel
├── PersonFocusPanel.tsx           # Panneau "Family Preview" avec actions généalogiques
├── ContextualAddMemberModal.tsx   # Modal contextuel d'ajout rapide (Enfant/Parent/Conjoint)
├── TreeCompletenessWidget.tsx     # Widget de mémoire familiale & complétude
└── TreeEmptyState.tsx             # Écran d'accueil si base vide
```

---

## 6. Stratégie de Performance & Scalabilité (500 - 1 000 membres)

1. **Calcul Hors React (`Pure Layout Engine`) :** Calculs matriciels effectués dans des fonctions TypeScript pures sans re-render React inutile.
2. **Mémoïsation (`useMemo`) :** Le graphe relationnel et le layout ne sont recalculés que lors d'un changement de filtre, d'état de repliage ou de données.
3. **Transform GPU (`translate3d + scale`) :** Le déplacement et le zoom s'exécutent sur la couche GPU matérielle à 60 FPS sans recalcul de disposition.
4. **Accessibilité WCAG 2.2 :** Navigation clavier intégrée (Flèches directionnelles, Tab, Entrée), focus visible, contraste vérifié 4.5:1 minimum et respect de `prefers-reduced-motion`.
