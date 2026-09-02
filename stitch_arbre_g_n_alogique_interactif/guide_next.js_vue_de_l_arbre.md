# Guide d'implémentation : Vue de l'Arbre (Tree View)

Ce guide décrit l'implémentation de l'interface interactive de l'arbre généalogique.

## Architecture de la Vue (`/tree/page.tsx`)

Cette page nécessite une gestion de canevas ou une bibliothèque de graphes pour la navigation.

### 1. Stack recommandée
- **React Flow** ou **D3.js**: Pour la gestion des connexions et du zoom/pan.
- **Composant `PersonNode`**: Le bloc visuel représentant un individu.

### 2. Structure des Données
```typescript
interface FamilyNode {
  id: string;
  name: string;
  lifespan: string;
  photoUrl?: string;
  parentId?: string;
  spouseId?: string;
  relationships: 'paternal' | 'maternal';
}
```

### 3. Fonctionnalités Clés
- **Navigation Interactive**: Implémentez le zoom et le déplacement (drag & pan) sur le canevas.
- **Filtrage**: Un état global (`useContext` ou `Zustand`) pour filtrer les branches (ex: afficher uniquement la branche maternelle).
- **Mini-map**: Utilisez un composant de prévisualisation pour faciliter la navigation dans les grands arbres.

### 4. Styles
- Appliquez le fond `bg-surface-container-low` pour simuler le parchemin.
- Utilisez des lignes de connexion avec `stroke-width: 1px` et la couleur `outline-variant`.

---
*Généré par Stitch pour HeritageArchive*