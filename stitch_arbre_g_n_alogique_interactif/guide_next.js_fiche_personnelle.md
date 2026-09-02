# Guide d'implémentation : Fiche Personnelle (Profile Detail)

Ce guide décrit l'implémentation de la page de profil détaillée d'un ancêtre.

## Mise en page (`/person/[id]/page.tsx`)

La page utilise un layout asymétrique avec un focus sur la biographie et la chronologie.

### 1. Sections Principales
- **Hero Section**: Photo de profil (style cadre ancien) et informations vitales.
- **Life Story**: Bloc de texte avec lettrine (`initial-letter` ou `first-letter:text-5xl`).
- **Timeline (Chronologie)** : Liste verticale des événements marquants.
- **Quick Actions**: Boutons "Voir dans l'arbre" et "Éditer".

### 2. Types TypeScript
```typescript
interface PersonDetail {
  id: string;
  fullName: string;
  birthDate: string;
  deathDate?: string;
  occupation: string;
  biography: string;
  events: TimelineEvent[];
}

interface TimelineEvent {
  date: string;
  title: string;
  location: string;
  description?: string;
}
```

### 3. Détails de Design
- **Typographie**: Utilisez `Literata` pour les corps de texte biographiques pour renforcer l'aspect historique.
- **Composant Timeline**: Utilisez des bordures gauches (`border-l-2`) et des points d'ancrage (`rounded-full`) pour créer le fil conducteur visuel.

---
*Généré par Stitch pour HeritageArchive*