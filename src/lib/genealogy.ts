import { Person, PersonDetail, ChildrenGroup, TimelineEvent, DashboardStats, TreeNodeData } from '@/types';

/**
 * Calcule le nom d'affichage d'une personne avec nom de jeune fille si applicable
 */
export function getFullName(person: { first_name: string; last_name: string; maiden_name?: string | null; gender?: string }): string {
  if (person.gender === 'F' && person.maiden_name && person.maiden_name.trim() !== '') {
    return `${person.first_name} ${person.last_name} (née ${person.maiden_name})`;
  }
  return `${person.first_name} ${person.last_name}`;
}

/**
 * Détermine si la personne appartient à la lignée sanguine
 */
export function isBloodFamily(person: { spouse_of_id?: number | null }): boolean {
  return person.spouse_of_id === null || person.spouse_of_id === undefined;
}

/**
 * Détermine si la personne est vivante
 */
export function isAlive(person: { death_date?: string | null }): boolean {
  return !person.death_date;
}

/**
 * Calcule l'âge d'une personne (à son décès ou aujourd'hui)
 */
export function getAge(person: { birth_date?: string | null; death_date?: string | null }): number | null {
  if (!person.birth_date) return null;

  try {
    const birthDate = new Date(person.birth_date);
    if (isNaN(birthDate.getTime())) return null;

    const endDate = person.death_date ? new Date(person.death_date) : new Date();
    if (isNaN(endDate.getTime())) return null;

    let age = endDate.getFullYear() - birthDate.getFullYear();
    const m = endDate.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 0 ? age : null;
  } catch {
    return null;
  }
}

/**
 * Récupère les enfants d'une personne
 */
export function getChildren(personId: number, allPersons: Person[]): Person[] {
  const person = allPersons.find(p => p.id === personId);
  if (!person) return [];

  if (person.gender === 'M') {
    return allPersons.filter(p => p.father_id === personId).sort((a, b) => (a.birth_date || '').localeCompare(b.birth_date || ''));
  } else {
    return allPersons.filter(p => p.mother_id === personId).sort((a, b) => (a.birth_date || '').localeCompare(b.birth_date || ''));
  }
}

/**
 * Récupère les frères et sœurs (même père OU même mère)
 */
export function getSiblings(personId: number, allPersons: Person[]): Person[] {
  const person = allPersons.find(p => p.id === personId);
  if (!person) return [];

  return allPersons.filter(p => {
    if (p.id === personId) return false;
    const sameFather = person.father_id && p.father_id === person.father_id;
    const sameMother = person.mother_id && p.mother_id === person.mother_id;
    return Boolean(sameFather || sameMother);
  }).sort((a, b) => (a.birth_date || '').localeCompare(b.birth_date || ''));
}

/**
 * Trouve les conjoints (via les enfants communs ou spouse_of_id)
 */
export function getSpouses(personId: number, allPersons: Person[]): Person[] {
  const person = allPersons.find(p => p.id === personId);
  if (!person) return [];

  const spouseIds = new Set<number>();

  // Via spouse_of
  if (person.spouse_of_id) {
    spouseIds.add(person.spouse_of_id);
  }
  allPersons.filter(p => p.spouse_of_id === personId).forEach(p => spouseIds.add(p.id));

  // Via les enfants communs
  if (person.gender === 'M') {
    allPersons
      .filter(p => p.father_id === personId && p.mother_id)
      .forEach(p => spouseIds.add(p.mother_id!));
  } else {
    allPersons
      .filter(p => p.mother_id === personId && p.father_id)
      .forEach(p => spouseIds.add(p.father_id!));
  }

  return Array.from(spouseIds)
    .map(id => allPersons.find(p => p.id === id))
    .filter((p): p is Person => p !== undefined);
}

/**
 * Groupe les enfants par conjoint (logique centrale Django)
 */
export function getChildrenBySpouse(personId: number, allPersons: Person[]): ChildrenGroup[] {
  const person = allPersons.find(p => p.id === personId);
  if (!person) return [];

  const groups: ChildrenGroup[] = [];

  if (person.gender === 'M') {
    // Pour un homme : grouper par mères
    const children = allPersons.filter(p => p.father_id === personId);
    const motherIds = Array.from(new Set(children.map(c => c.mother_id).filter((id): id is number => id !== null)));

    for (const motherId of motherIds) {
      const mother = allPersons.find(p => p.id === motherId) || null;
      const spouseChildren = children
        .filter(c => c.mother_id === motherId)
        .sort((a, b) => (a.birth_date || '').localeCompare(b.birth_date || ''));

      if (spouseChildren.length > 0) {
        groups.push({
          spouse: mother,
          children: spouseChildren,
        });
      }
    }

    // Enfants sans mère identifiée
    const noMotherChildren = children
      .filter(c => !c.mother_id)
      .sort((a, b) => (a.birth_date || '').localeCompare(b.birth_date || ''));

    if (noMotherChildren.length > 0) {
      groups.push({
        spouse: null,
        children: noMotherChildren,
      });
    }
  } else {
    // Pour une femme : grouper par pères
    const children = allPersons.filter(p => p.mother_id === personId);
    const fatherIds = Array.from(new Set(children.map(c => c.father_id).filter((id): id is number => id !== null)));

    for (const fatherId of fatherIds) {
      const father = allPersons.find(p => p.id === fatherId) || null;
      const spouseChildren = children
        .filter(c => c.father_id === fatherId)
        .sort((a, b) => (a.birth_date || '').localeCompare(b.birth_date || ''));

      if (spouseChildren.length > 0) {
        groups.push({
          spouse: father,
          children: spouseChildren,
        });
      }
    }

    // Enfants sans père identifié
    const noFatherChildren = children
      .filter(c => !c.father_id)
      .sort((a, b) => (a.birth_date || '').localeCompare(b.birth_date || ''));

    if (noFatherChildren.length > 0) {
      groups.push({
        spouse: null,
        children: noFatherChildren,
      });
    }
  }

  return groups;
}

/**
 * Calcule la génération d'une personne (0 = patriarches racines)
 * Les conjoints/alliés adoptent automatiquement la même génération que leur partenaire.
 */
export function getGeneration(
  personId: number,
  allPersons: Person[],
  memo: Record<number, number> = {},
  visiting: Set<number> = new Set()
): number {
  if (memo[personId] !== undefined) return memo[personId];
  if (visiting.has(personId)) return 0;
  visiting.add(personId);

  const person = allPersons.find((p) => p.id === personId);
  if (!person) return 0;

  // 1. Si la personne a des parents de sang connus
  if (person.father_id || person.mother_id) {
    let maxParentGen = -1;
    if (person.father_id) {
      maxParentGen = Math.max(
        maxParentGen,
        getGeneration(person.father_id, allPersons, memo, visiting)
      );
    }
    if (person.mother_id) {
      maxParentGen = Math.max(
        maxParentGen,
        getGeneration(person.mother_id, allPersons, memo, visiting)
      );
    }
    const gen = maxParentGen + 1;
    memo[personId] = gen;
    return gen;
  }

  // 2. Si pas de parents enregistrés, hériter de la génération de son conjoint
  const spouseIds = new Set<number>();
  if (person.spouse_of_id) spouseIds.add(person.spouse_of_id);
  for (const other of allPersons) {
    if (other.spouse_of_id === personId) spouseIds.add(other.id);
    if (other.father_id === personId && other.mother_id) spouseIds.add(other.mother_id);
    if (other.mother_id === personId && other.father_id) spouseIds.add(other.father_id);
  }

  const spouseGens: number[] = [];
  for (const sId of spouseIds) {
    const sp = allPersons.find((p) => p.id === sId);
    if (sp && (sp.father_id || sp.mother_id)) {
      spouseGens.push(getGeneration(sId, allPersons, memo, visiting));
    }
  }

  if (spouseGens.length > 0) {
    const gen = Math.max(...spouseGens);
    memo[personId] = gen;
    return gen;
  }

  memo[personId] = 0;
  return 0;
}

/**
 * Construit la timeline chronologique d'une personne
 */
export function getTimelineEvents(person: Person, allPersons: Person[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Naissance
  if (person.birth_date) {
    const year = new Date(person.birth_date).getFullYear();
    events.push({
      id: `birth-${person.id}`,
      date: person.birth_date,
      year: isNaN(year) ? undefined : year,
      title: 'Naissance',
      location: person.birth_place || undefined,
      description: `Naissance de ${getFullName(person)}${person.birth_place ? ` à ${person.birth_place}` : ''}.`,
      type: 'birth',
    });
  }

  // Éducation & Formation
  if (person.education) {
    events.push({
      id: `edu-${person.id}`,
      date: person.birth_date || '1970-01-01',
      title: 'Formation & Études',
      description: person.education,
      type: 'education',
    });
  }

  // Profession / Carrière
  if (person.profession) {
    events.push({
      id: `career-${person.id}`,
      date: person.birth_date || '1980-01-01',
      title: 'Activité professionnelle',
      description: `Exercice du métier de ${person.profession}.`,
      type: 'career',
    });
  }

  // Naissance des enfants
  const children = getChildren(person.id, allPersons);
  for (const child of children) {
    if (child.birth_date) {
      const childYear = new Date(child.birth_date).getFullYear();
      events.push({
        id: `child-${child.id}`,
        date: child.birth_date,
        year: isNaN(childYear) ? undefined : childYear,
        title: `Naissance d'un enfant : ${getFullName(child)}`,
        location: child.birth_place || undefined,
        description: `Naissance de son ${child.gender === 'M' ? 'fils' : 'fille'} ${child.first_name}${child.birth_place ? ` à ${child.birth_place}` : ''}.`,
        type: 'child',
        relatedPersonId: child.id,
      });
    }
  }

  // Décès
  if (person.death_date) {
    const deathYear = new Date(person.death_date).getFullYear();
    const ageAtDeath = getAge(person);
    events.push({
      id: `death-${person.id}`,
      date: person.death_date,
      year: isNaN(deathYear) ? undefined : deathYear,
      title: 'Décès',
      location: person.death_place || undefined,
      description: `Décédé${person.gender === 'F' ? 'e' : ''} à l'âge de ${ageAtDeath ? `${ageAtDeath} ans` : 'inconnu'}${person.death_place ? ` à ${person.death_place}` : ''}.`,
      type: 'death',
    });
  }

  // Tri chronologique
  return events.sort((a, b) => {
    if (a.date && b.date) return a.date.localeCompare(b.date);
    if (a.year && b.year) return a.year - b.year;
    return 0;
  });
}

/**
 * Récupère le profil détaillé d'une personne
 */
export function getPersonDetail(id: number, allPersons: Person[]): PersonDetail | null {
  const person = allPersons.find(p => p.id === id);
  if (!person) return null;

  const father = person.father_id ? allPersons.find(p => p.id === person.father_id) || null : null;
  const mother = person.mother_id ? allPersons.find(p => p.id === person.mother_id) || null : null;
  const spouseOf = person.spouse_of_id ? allPersons.find(p => p.id === person.spouse_of_id) || null : null;

  const spouses = getSpouses(person.id, allPersons);
  const siblings = getSiblings(person.id, allPersons);
  const children = getChildren(person.id, allPersons);
  const childrenBySpouse = getChildrenBySpouse(person.id, allPersons);
  const timeline = getTimelineEvents(person, allPersons);
  const generation = getGeneration(person.id, allPersons);

  return {
    ...person,
    full_name: getFullName(person),
    age: getAge(person),
    is_alive: isAlive(person),
    is_blood_family: isBloodFamily(person),
    generation,
    father,
    mother,
    spouse_of: spouseOf,
    spouses,
    siblings,
    children,
    children_by_spouse: childrenBySpouse,
    timeline,
  };
}

/**
 * Prépare les données pour le graphe ou l'arbre interactif
 */
export function getTreeDataFormatted(allPersons: Person[]): TreeNodeData[] {
  const memo: Record<number, number> = {};

  return allPersons.map(person => {
    const childrenBySpouse = getChildrenBySpouse(person.id, allPersons);
    const generation = getGeneration(person.id, allPersons, memo);
    const children = getChildren(person.id, allPersons);

    // Déterminer is_blood (a un parent ou est un ancêtre avec des enfants)
    const isBlood = Boolean(
      person.father_id ||
      person.mother_id ||
      (!person.father_id && !person.mother_id && children.length > 0 && !person.spouse_of_id)
    );

    return {
      id: person.id,
      name: getFullName(person),
      first_name: person.first_name,
      last_name: person.last_name,
      maiden_name: person.maiden_name,
      gender: person.gender,
      birth_date: person.birth_date,
      death_date: person.death_date,
      birth_place: person.birth_place,
      profession: person.profession,
      biography: person.biography,
      accomplishments: person.accomplishments,
      photo_url: person.photo,
      father_id: person.father_id,
      mother_id: person.mother_id,
      spouse_of_id: person.spouse_of_id,
      is_blood: isBlood,
      generation,
      children_count: children.length,
      children_by_spouse: childrenBySpouse.map(group => ({
        spouse: group.spouse ? {
          id: group.spouse.id,
          name: getFullName(group.spouse),
          photo_url: group.spouse.photo,
          gender: group.spouse.gender,
        } : null,
        children: group.children.map(child => ({
          id: child.id,
          name: getFullName(child),
          gender: child.gender,
          birth_date: child.birth_date,
          death_date: child.death_date,
          photo_url: child.photo,
        })),
      })),
    };
  });
}

/**
 * Calcule les statistiques complètes pour le Dashboard (recommandations Stitch)
 */
export function getDashboardStats(allPersons: Person[]): DashboardStats {
  const memo: Record<number, number> = {};

  let maxGen = 0;
  let males = 0;
  let females = 0;
  let aliveCount = 0;
  let deceasedCount = 0;
  let photos = 0;
  let bloodCount = 0;
  let spousesCount = 0;
  const placesSet = new Set<string>();

  const hints: DashboardStats['missingDataHints'] = [];

  for (const p of allPersons) {
    const gen = getGeneration(p.id, allPersons, memo);
    if (gen > maxGen) maxGen = gen;

    if (p.gender === 'M') males++;
    else females++;

    if (isAlive(p)) aliveCount++;
    else deceasedCount++;

    if (p.photo) photos++;

    if (isBloodFamily(p)) bloodCount++;
    else spousesCount++;

    if (p.birth_place && p.birth_place.trim()) placesSet.add(p.birth_place.trim());
    if (p.death_place && p.death_place.trim()) placesSet.add(p.death_place.trim());

    // Vérifier les données manquantes pour hints
    if (!p.birth_date) {
      hints.push({
        id: `hint-birth-${p.id}`,
        personId: p.id,
        personName: getFullName(p),
        title: 'Date de naissance inconnue',
        description: `Ajoutez la date de naissance de ${getFullName(p)} pour enrichir la chronologie.`,
        type: 'missing_birth',
      });
    }

    if (!p.photo) {
      hints.push({
        id: `hint-photo-${p.id}`,
        personId: p.id,
        personName: getFullName(p),
        title: 'Photo de profil manquante',
        description: `Une photo d'archive pour ${getFullName(p)} valoriserait l'arbre familial.`,
        type: 'missing_photo',
      });
    }

    if (!p.biography || p.biography.trim().length === 0) {
      hints.push({
        id: `hint-bio-${p.id}`,
        personId: p.id,
        personName: getFullName(p),
        title: 'Histoire de vie à compléter',
        description: `Racontez la biographie et les accomplissements de ${getFullName(p)}.`,
        type: 'missing_bio',
      });
    }
  }

  const patriarchsCount = allPersons.filter(p => !p.father_id && !p.mother_id && !p.spouse_of_id).length;

  return {
    totalMembers: allPersons.length,
    generations: maxGen + 1,
    patriarchsCount,
    bloodCount,
    spousesCount,
    aliveCount,
    deceasedCount,
    genderRatio: { male: males, female: females },
    originPlaces: Array.from(placesSet),
    photosCount: photos,
    missingDataHints: hints.slice(0, 6),
  };
}
