'use client';

import { FamilyEvent, Person, PersonDetail, TreeNodeData } from '@/types';
import { Language } from './translations';

/**
 * High-accuracy dictionary of common genealogical, historical, professional,
 * event, and location translations between French and English.
 */
const EXACT_PHRASES_FR_TO_EN: Record<string, string> = {
  // Common Event Titles & Themes
  "Célébration de l'indépendance": "Independence Day Celebration",
  "Célébration de l'Indépendance": "Independence Day Celebration",
  "Celebration de l'independance": "Independence Day Celebration",
  "Fête de l'Indépendance": "Independence Day Celebration",
  "Fête de l'indépendance": "Independence Day Celebration",
  "Grande Réunion Familiale": "Grand Family Reunion",
  "Grande réunion familiale": "Grand Family Reunion",
  "Grande Reunion Familiale": "Grand Family Reunion",
  "Retrouvailles Annuelles": "Annual Family Reunion",
  "Retrouvailles annuelles": "Annual Family Reunion",
  "Hommage au Patriarche": "Tribute to the Patriarch",
  "Hommage au Patriarche Paul": "Tribute to Patriarch Paul",
  "Commémoration des Ancêtres": "Ancestors Commemoration",
  "Pèlerinage aux Sources": "Pilgrimage to Ancestral Roots",
  "Pelerinage aux sources": "Pilgrimage to Ancestral Roots",
  "Célébration Familiale": "Family Celebration",
  "Célébration de Mariage": "Wedding Celebration",
  "Fête des Moissons": "Harvest Festival",
  "Fête de Fin d'Année": "End of Year Celebration",
  "Arbre de Noël Familial": "Family Christmas Gathering",
  "Anniversaire des 80 ans": "80th Birthday Celebration",
  "Célébration des 50 ans": "50th Anniversary Celebration",
  "Obsèques & Hommage": "Funeral & Memorial Tribute",
  "Sortie de Nouveau-né": "Newborn Outing & Blessing Ceremony",
  "Baptême Traditionnel": "Traditional Christening Ceremony",

  // Professions & Occupations
  "Enseignant": "Teacher / Educator",
  "Enseignante": "Teacher / Educator",
  "Professeur": "Professor / Teacher",
  "Professeur de mathématiques": "Mathematics Professor",
  "Ingénieur": "Engineer",
  "Ingénieur en mines": "Mining Engineer",
  "Ingénieur des mines": "Mining Engineer",
  "Ingénieur en électrotechnique": "Electrical Engineer",
  "Ingénieur agronome": "Agronomist Engineer",
  "Ingénieur informatique": "Software Engineer",
  "Commerçante": "Trader / Businesswoman",
  "Commerçant": "Merchant / Businessman",
  "Médecin": "Medical Doctor / Physician",
  "Infirmier": "Nurse",
  "Infirmière": "Nurse",
  "Sage-femme": "Midwife",
  "Avocat": "Lawyer / Attorney",
  "Magistrat": "Magistrate / Judge",
  "Comptable": "Accountant",
  "Économiste": "Economist",
  "Fonctionnaire": "Civil Servant",
  "Administrateur civil": "Civil Administrator",
  "Diplomate": "Diplomat",
  "Entrepreneur": "Entrepreneur",
  "Artisan": "Craftsman / Artisan",
  "Menuisier": "Carpenter",
  "Cultivateur": "Farmer / Cultivator",
  "Agriculteur": "Farmer",
  "Étudiant": "Student",
  "Étudiante": "Student",
  "Militaire": "Military Officer",
  "Policier": "Police Officer",
  "Conseiller pédagogique": "Educational Consultant / Pedagogical Advisor",

  // Places & Cities
  "Cotonou, Bénin": "Cotonou, Benin",
  "Porto-Novo, Bénin": "Porto-Novo, Benin",
  "Abomey, Bénin": "Abomey, Benin",
  "Bohicon, Bénin": "Bohicon, Benin",
  "Ouidah, Bénin": "Ouidah, Benin",
  "Parakou, Bénin": "Parakou, Benin",
  "Logbozounkpa, Bénin": "Logbozounkpa, Benin",
  "Abidjan, Côte d'Ivoire": "Abidjan, Ivory Coast",
  "Paris, France": "Paris, France",
  "Lomé, Togo": "Lome, Togo",
  "Dakar, Sénégal": "Dakar, Senegal",
  "Accra, Ghana": "Accra, Ghana",
  "Lagos, Nigeria": "Lagos, Nigeria",
  "Cotonou": "Cotonou",
  "Porto-Novo": "Porto-Novo",
  "Abomey": "Abomey",
  "Bohicon": "Bohicon",
  "Ouidah": "Ouidah",
  "Logbozounkpa": "Logbozounkpa",
  "Bénin": "Benin",

  // Activity Log Descriptions
  "Initialisation de l'arbre avec 52 membres de la famille LISSANON.": "Initialized family tree with 52 members of the LISSANON family.",
  "Mise à jour de l'arbre généalogique.": "Updated family tree records.",
  "Ajout d'un nouveau membre dans la lignée.": "Added a new member to the family lineage."
};

/**
 * Paul Comlan LISSANON's full bilingual biographies
 */
const PAUL_LISSANON_EN = {
  biography: `Paul LISSANON is an iconic figure in education in Benin, renowned for his exemplary career since the 1960s. Following brilliant academic studies and training in the country's first teacher training colleges, he devoted more than four decades to educating young Beninese. Renowned for his innovative pedagogical methods and his lifelong commitment to continuous teacher training, he contributed significantly to modernizing Beninese schooling and mentoring several generations of educators.

Biography — Paul LISSANON

Born in 1942 in Abomey, Paul LISSANON completed his primary and secondary schooling in his home region.

In 1962, he entered the École Normale Supérieure of Porto-Novo, where he earned the secondary education teaching certification (CAPES).

He began his distinguished career as a mathematics teacher at the Collège de Cotonou, and subsequently taught across multiple prestigious institutions in Benin.

Passionate about educational reform, Paul LISSANON participated actively in numerous professional seminars and contributed to authoring the first local school textbooks in Benin starting in the 1980s.

Throughout his career, he served as a senior pedagogical advisor and trained aspiring teachers at the National Teachers College.

Retiring in 2005, he remained highly active in the national association of former educators, delivering lectures on educational development in Benin.

Officially recognized by the State, Paul LISSANON was awarded the title of Knight of the National Order of Benin in 2010 for outstanding service rendered to the Nation.

Selected Bibliography
Lissanon, P. (1985). Active methods for teaching mathematics in Benin. Porto-Novo: National Editions.
Lissanon, P. (1992). The evolution of the Beninese educational system since independence. African Education Review, 14(2), 45-60.
Lissanon, P. & National Association of Teachers of Benin. (2008). Continuing professional development guide for secondary teachers. Cotonou: ANEB.`,

  accomplishments: `Introduction of innovative pedagogical methods tailored to the Beninese context, significantly enhancing student understanding and achievement in scientific disciplines.

Active leadership in developing the first local school textbooks used in secondary schools and high schools across Benin starting in the 1980s.

Organization and facilitation of numerous professional development workshops for teachers, strengthening instructional competencies and pedagogical modernization.

Founding member of the National Association of Teachers of Benin, advocating for the teaching profession and teacher empowerment.

Supervision and mentorship of multiple cohorts of young teachers at the École Normale of Porto-Novo, directly elevating educational quality nationwide.

Distinguished keynote speaker on the evolution of African educational systems, regularly invited by academic institutions and universities.

Recipient of national honors for exceptional service to education, notably the Medal of Knight of the National Order of Benin in 2010.`,

  education: `From the 1940s onwards, teacher education in Benin underwent pivotal transformations shaped by historical and post-independence milestones.

During this era, teacher training primarily took place in normal schools that prepared primary educators. With Benin's independence in 1960, formalized higher institutions were established to train secondary teachers (ENS Porto-Novo).

Paul LISSANON underwent rigorous academic and professional training, obtaining secondary teaching credentials (CAPES) in Mathematics.

His lifelong dedication to continuous learning and academic mentorship positioned him as a pillar of professional excellence in Benin's educational history.`
};

/**
 * Rule-based translator for sentences & descriptions when no exact match exists
 */
function translateFrenchTextToEnglish(text: string): string {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (EXACT_PHRASES_FR_TO_EN[trimmed]) {
    return EXACT_PHRASES_FR_TO_EN[trimmed];
  }

  let result = text;

  // Word & expression replacements
  const replacements: [RegExp, string][] = [
    [/Célébration de l['’]indépendance/gi, "Independence Day Celebration"],
    [/Fête de l['’]indépendance/gi, "Independence Celebration"],
    [/Grande Réunion Familiale/gi, "Grand Family Reunion"],
    [/Réunion Familiale/gi, "Family Reunion"],
    [/Retrouvailles Familiales/gi, "Family Gathering"],
    [/Retrouvailles/gi, "Gathering"],
    [/Célébration/gi, "Celebration"],
    [/Commémoration/gi, "Commemoration"],
    [/Hommage/gi, "Tribute"],
    [/Mariage/gi, "Wedding"],
    [/Naissance/gi, "Birth"],
    [/Pèlerinage/gi, "Pilgrimage"],
    [/Enseignant(e)?/gi, "Teacher"],
    [/Ingénieur/gi, "Engineer"],
    [/Commerçant(e)?/gi, "Trader / Merchant"],
    [/Médecin/gi, "Physician"],
    [/Étudiant(e)?/gi, "Student"],
    [/Bénin/g, "Benin"],
    [/Côte d['’]Ivoire/g, "Ivory Coast"],
    [/Sénégal/g, "Senegal"],
    [/Afrique/g, "Africa"],
    [/Patriarche/gi, "Patriarch"],
    [/Matriarche/gi, "Matriarch"],
    [/Chef de foyer/gi, "Head of Household"],
    [/Épouse/gi, "Spouse"],
    [/Époux/gi, "Spouse"],
    [/Foyer/gi, "Household"],
    [/Enfants/gi, "Children"],
    [/Descendants/gi, "Descendants"],
    [/Lignée/gi, "Lineage"],
    [/Génération/gi, "Generation"],
    [/Création de l['’]événement familial/gi, "Creation of family event"],
    [/Mise à jour de l['’]événement/gi, "Update of family event"],
    [/Suppression de l['’]événement/gi, "Deletion of family event"],
  ];

  for (const [pattern, repl] of replacements) {
    result = result.replace(pattern, repl);
  }

  return result;
}

/**
 * Translates event categories to user language
 */
export function translateEventCategory(category: string | undefined | null, lang: Language): string {
  if (!category) return '';
  if (lang === 'fr') {
    switch (category.toLowerCase()) {
      case 'reunion': return 'Rassemblement';
      case 'commemoration': return 'Commémoration';
      case 'celebration': return 'Célébration';
      case 'birth': return 'Naissance & Baptême';
      case 'wedding': return 'Mariage & Fiançailles';
      case 'cultural': return 'Tradition & Culture';
      case 'other': return 'Autre événement';
      default: return category;
    }
  } else {
    switch (category.toLowerCase()) {
      case 'reunion': return 'Family Reunion';
      case 'commemoration': return 'Commemoration & Tribute';
      case 'celebration': return 'Celebration & Jubilee';
      case 'birth': return 'Birth & Christening';
      case 'wedding': return 'Wedding & Betrothal';
      case 'cultural': return 'Tradition & Culture';
      case 'other': return 'Other Event';
      default: return category;
    }
  }
}

/**
 * Translates general dynamic database text according to selected language
 */
export function translateDbText(text: string | null | undefined, lang: Language): string {
  if (!text) return '';
  if (lang === 'fr') return text;
  return translateFrenchTextToEnglish(text);
}

/**
 * Translates an Event record dynamically
 */
export function translateEventData(event: FamilyEvent, lang: Language): FamilyEvent {
  if (!event || lang === 'fr') return event;

  return {
    ...event,
    title: translateDbText(event.title, lang),
    description: translateDbText(event.description, lang),
    location: event.location ? translateDbText(event.location, lang) : event.location,
    category: event.category,
  };
}

/**
 * Translates a Person record dynamically (supports Person, PersonDetail, TreeNodeData)
 */
export function translatePersonData<T extends Person | PersonDetail | TreeNodeData>(
  person: T,
  lang: Language
): T {
  if (!person || lang === 'fr') return person;

  const isPaul = person.id === 1 || (person.first_name === 'Paul' && person.last_name === 'LISSANON');

  const profession = person.profession ? translateDbText(person.profession, lang) : person.profession;
  const birth_place = person.birth_place ? translateDbText(person.birth_place, lang) : person.birth_place;
  const death_place = (person as any).death_place ? translateDbText((person as any).death_place, lang) : (person as any).death_place;

  let biography = (person as any).biography;
  let accomplishments = (person as any).accomplishments;
  let education = (person as any).education;

  if (isPaul) {
    biography = PAUL_LISSANON_EN.biography;
    accomplishments = PAUL_LISSANON_EN.accomplishments;
    education = PAUL_LISSANON_EN.education;
  } else {
    if (biography) biography = translateDbText(biography, lang);
    if (accomplishments) accomplishments = translateDbText(accomplishments, lang);
    if (education) education = translateDbText(education, lang);
  }

  return {
    ...person,
    profession,
    birth_place,
    ...(death_place !== undefined ? { death_place } : {}),
    ...(biography !== undefined ? { biography } : {}),
    ...(accomplishments !== undefined ? { accomplishments } : {}),
    ...(education !== undefined ? { education } : {}),
  } as T;
}
