export type Gender = 'M' | 'F';

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  maiden_name?: string | null;
  gender: Gender;
  birth_date?: string | null;
  birth_place?: string | null;
  death_date?: string | null;
  death_place?: string | null;
  father_id?: number | null;
  mother_id?: number | null;
  spouse_of_id?: number | null;
  biography?: string | null;
  accomplishments?: string | null;
  profession?: string | null;
  education?: string | null;
  photo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PersonFormData {
  first_name: string;
  last_name: string;
  maiden_name?: string;
  gender: Gender;
  birth_date?: string;
  birth_place?: string;
  death_date?: string;
  death_place?: string;
  father_id?: number | null;
  mother_id?: number | null;
  spouse_of_id?: number | null;
  biography?: string;
  accomplishments?: string;
  profession?: string;
  education?: string;
  photo?: string;
}

export interface Marriage {
  id: number;
  spouse1_id: number;
  spouse2_id: number;
  marriage_date?: string | null;
  marriage_place?: string | null;
  divorce_date?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'addition' | 'document' | 'photo' | 'edit' | 'marriage';
  user: string;
  timestamp: string;
  description: string;
  person_id?: number;
  person_name?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  year?: number;
  title: string;
  location?: string;
  description?: string;
  type: 'birth' | 'marriage' | 'child' | 'education' | 'career' | 'death' | 'other';
  relatedPersonId?: number;
}

export interface ChildrenGroup {
  spouse: Person | null;
  children: Person[];
}

export interface PersonDetail extends Person {
  full_name: string;
  age: number | null;
  is_alive: boolean;
  is_blood_family: boolean;
  generation: number;
  father?: Person | null;
  mother?: Person | null;
  spouse_of?: Person | null;
  spouses: Person[];
  siblings: Person[];
  children: Person[];
  children_by_spouse: ChildrenGroup[];
  timeline: TimelineEvent[];
}

export interface DashboardStats {
  totalMembers: number;
  generations: number;
  patriarchsCount: number;
  bloodCount: number;
  spousesCount: number;
  aliveCount: number;
  deceasedCount: number;
  genderRatio: { male: number; female: number };
  originPlaces: string[];
  photosCount: number;
  missingDataHints: {
    id: string;
    personId: number;
    personName: string;
    title: string;
    description: string;
    type: 'missing_parents' | 'missing_birth' | 'missing_photo' | 'missing_bio';
  }[];
}

export interface TreeNodeData {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  maiden_name?: string | null;
  gender: Gender;
  birth_date?: string | null;
  death_date?: string | null;
  birth_place?: string | null;
  profession?: string | null;
  biography?: string | null;
  accomplishments?: string | null;
  photo?: string | null;
  photo_url?: string | null;
  father_id?: number | null;
  mother_id?: number | null;
  spouse_of_id?: number | null;
  is_blood: boolean;
  generation: number;
  children_count: number;
  children_by_spouse: {
    spouse: {
      id: number;
      name: string;
      photo?: string | null;
      photo_url?: string | null;
      gender: Gender;
    } | null;
    children: {
      id: number;
      name: string;
      gender: Gender;
      birth_date?: string | null;
      death_date?: string | null;
      photo?: string | null;
      photo_url?: string | null;
    }[];
  }[];
}

export type EventCategory =
  | 'reunion'
  | 'commemoration'
  | 'celebration'
  | 'birth'
  | 'wedding'
  | 'cultural'
  | 'other';

export interface FamilyEvent {
  id: number;
  title: string;
  description: string;
  event_date: string;
  category: EventCategory;
  location?: string | null;
  photo?: string | null;
  photos?: string[];
  related_person_ids?: number[];
  is_past: boolean;
  days_until?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FamilyEventFormData {
  title: string;
  description: string;
  event_date: string;
  category: EventCategory;
  location?: string;
  photo?: string;
  photos?: string[];
  related_person_ids?: number[];
}

// ==========================================
// Foyer Explorer Types
// ==========================================

export interface FoyerChildData {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  birth_date?: string | null;
  death_date?: string | null;
  photo?: string | null;
  photo_url?: string | null;
  profession?: string | null;
  hasDescendants: boolean;
  descendantsCount: number;
  isPartiallyDocumented: boolean;
}

export interface FoyerSpouseData {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  birth_date?: string | null;
  death_date?: string | null;
  photo?: string | null;
  photo_url?: string | null;
  profession?: string | null;
}

export interface FoyerChildrenGroup {
  spouse: FoyerSpouseData | null;
  children: FoyerChildData[];
}

export interface FoyerData {
  /** La personne au centre du foyer */
  person: TreeNodeData;
  /** Ses conjoints / unions */
  spouses: FoyerSpouseData[];
  /** Enfants groupés par conjoint */
  childrenGroups: FoyerChildrenGroup[];
  /** Nombre total d'enfants */
  totalChildrenCount: number;
}
