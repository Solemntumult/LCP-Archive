# Guide d'implémentation : Tableau de bord (Dashboard)

Ce guide décrit comment implémenter l'écran du Tableau de bord de **LISSANONArchive** avec Next.js, React et TypeScript.

## Structure de la Page (`/dashboard/page.tsx`)

Le tableau de bord est structuré en une grille de widgets informatifs.

### 1. Composants requis
- `StatCard`: Affiche les métriques clés (Membres, Générations, Pays).
- `ActivityFeed`: Liste chronologique des dernières modifications.
- `HintCard`: Module d'aide pour les branches manquantes.
- `RecentGallery`: Grille d'images pour les derniers documents ajoutés.

### 2. Exemple de Type TypeScript
```typescript
interface DashboardStats {
  totalMembers: number;
  generations: number;
  originCountries: string[];
}

interface ActivityEvent {
  id: string;
  type: 'addition' | 'document' | 'photo';
  user: string;
  timestamp: string;
  description: string;
}
```

### 3. Logique d'implémentation
- **Data Fetching**: Utilisez les Server Components de Next.js pour récupérer les statistiques globales.
- **État local**: Gérez l'ouverture de la galerie ou le filtrage de l'activité avec `useState`.
- **Styling**: Utilisez les classes utilitaires Tailwind CSS définies dans le système de design (ex: `bg-surface-container-low`, `font-headline-md`).

---
*Généré par Stitch pour HeritageArchive*