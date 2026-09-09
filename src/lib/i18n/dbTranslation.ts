'use client';

import { FamilyEvent, Person, PersonDetail, TreeNodeData, TimelineEvent, EventCategory } from '@/types';
import { Language } from './translations';
import { Users, Award, Sparkles, Baby, Heart, Compass, Calendar } from 'lucide-react';

/**
 * Universal Dictionary mapping French words & common phrases to English
 */
const EXACT_PHRASES: Record<string, string> = {
  // Event Titles & Occasions
  "Célébration de l'indépendance": "Independence Day Celebration",
  "Célébration de l'Indépendance": "Independence Day Celebration",
  "Celebration de l'independance": "Independence Day Celebration",
  "Fête de l'Indépendance": "Independence Day Celebration",
  "Fête de l'indépendance": "Independence Day Celebration",
  "Fête nationale": "National Holiday Celebration",
  "Grande Réunion Familiale": "Grand Family Reunion",
  "Grande réunion familiale": "Grand Family Reunion",
  "Grande Reunion Familiale": "Grand Family Reunion",
  "Réunion de famille": "Family Reunion",
  "Réunion familiale": "Family Gathering",
  "Retrouvailles Annuelles": "Annual Family Reunion",
  "Retrouvailles annuelles": "Annual Family Reunion",
  "Retrouvailles Familiales": "Family Reunion Gathering",
  "Hommage au Patriarche": "Tribute to the Patriarch",
  "Hommage au Patriarche Paul": "Tribute to Patriarch Paul",
  "Hommage aux Ancêtres": "Tribute to the Ancestors",
  "Commémoration des Ancêtres": "Ancestors Commemoration",
  "Pèlerinage aux Sources": "Pilgrimage to Ancestral Roots",
  "Pelerinage aux sources": "Pilgrimage to Ancestral Roots",
  "Célébration Familiale": "Family Celebration",
  "Célébration de Mariage": "Wedding Celebration",
  "Fête des Moissons": "Harvest Festival",
  "Fête de Fin d'Année": "End of Year Celebration",
  "Arbre de Noël Familial": "Family Christmas Gathering",
  "Arbre de Noël": "Christmas Gathering",
  "Anniversaire des 80 ans": "80th Birthday Celebration",
  "Célébration des 50 ans": "50th Anniversary Celebration",
  "Anniversaire de mariage": "Wedding Anniversary",
  "Obsèques & Hommage": "Funeral & Memorial Tribute",
  "Sortie de Nouveau-né": "Newborn Outing & Blessing Ceremony",
  "Baptême Traditionnel": "Traditional Christening Ceremony",
  "Présentation du nouveau-né": "Presentation of the Newborn",
  "Rassemblement des descendants": "Descendants Gathering",
  "Jubilé d'or": "Golden Jubilee",
  "Jubilé d'argent": "Silver Jubilee",

  // Professions & Occupations
  "Enseignant": "Teacher / Educator",
  "Enseignante": "Teacher / Educator",
  "Professeur": "Professor / Teacher",
  "Professeur de mathématiques": "Mathematics Professor",
  "Professeur de sciences": "Science Professor",
  "Professeur de français": "French Teacher",
  "Instituteur": "Primary School Teacher",
  "Institutrice": "Primary School Teacher",
  "Ingénieur": "Engineer",
  "Ingénieure": "Engineer",
  "Ingénieur en mines": "Mining Engineer",
  "Ingénieur des mines": "Mining Engineer",
  "Ingénieur en électrotechnique": "Electrical Engineer",
  "Ingénieur électrotechnique": "Electrical Engineer",
  "Ingénieur agronome": "Agronomist Engineer",
  "Ingénieur informatique": "Software Engineer",
  "Ingénieur génie civil": "Civil Engineer",
  "Commerçante": "Trader / Businesswoman",
  "Commerçant": "Merchant / Businessman",
  "Médecin": "Medical Doctor / Physician",
  "Chirurgien": "Surgeon",
  "Infirmier": "Nurse",
  "Infirmière": "Nurse",
  "Sage-femme": "Midwife",
  "Pharmacien": "Pharmacist",
  "Pharmacienne": "Pharmacist",
  "Avocat": "Lawyer / Attorney",
  "Avocate": "Lawyer / Attorney",
  "Magistrat": "Magistrate / Judge",
  "Juriste": "Legal Consultant",
  "Comptable": "Accountant",
  "Expert-comptable": "Chartered Accountant",
  "Économiste": "Economist",
  "Fonctionnaire": "Civil Servant",
  "Administrateur civil": "Civil Administrator",
  "Diplomate": "Diplomat",
  "Entrepreneur": "Entrepreneur",
  "Entrepreneure": "Entrepreneur",
  "Chef d'entreprise": "Business Executive",
  "Artisan": "Craftsman / Artisan",
  "Artisane": "Craftswoman / Artisan",
  "Menuisier": "Carpenter",
  "Maçon": "Mason / Builder",
  "Électricien": "Electrician",
  "Plombier": "Plumber",
  "Mécanicien": "Mechanic",
  "Tailleur": "Tailor",
  "Couturière": "Seamstress / Dressmaker",
  "Styliste": "Fashion Designer",
  "Cultivateur": "Farmer / Cultivator",
  "Cultivatrice": "Farmer / Cultivator",
  "Agriculteur": "Farmer",
  "Agricultrice": "Farmer",
  "Éleveur": "Breeder / Livestock Farmer",
  "Étudiant": "Student",
  "Étudiante": "Student",
  "Élève": "Pupil / Student",
  "Militaire": "Military Officer",
  "Gendarme": "Gendarme / Officer",
  "Policier": "Police Officer",
  "Douanier": "Customs Officer",
  "Conseiller pédagogique": "Educational Consultant / Pedagogical Advisor",
  "Directeur d'école": "School Principal",
  "Directrice d'école": "School Principal",
  "Inspecteur": "Inspector",
  "Secrétaire": "Secretary",
  "Chauffeur": "Driver",
  "Artiste": "Artist",
  "Musicien": "Musician",
  "Pasteur": "Pastor",
  "Prêtre": "Priest",

  // Places & Cities
  "Cotonou, Bénin": "Cotonou, Benin",
  "Porto-Novo, Bénin": "Porto-Novo, Benin",
  "Abomey, Bénin": "Abomey, Benin",
  "Bohicon, Bénin": "Bohicon, Benin",
  "Ouidah, Bénin": "Ouidah, Benin",
  "Parakou, Bénin": "Parakou, Benin",
  "Logbozounkpa, Bénin": "Logbozounkpa, Benin",
  "Djidja, Bénin": "Djidja, Benin",
  "Natitingou, Bénin": "Natitingou, Benin",
  "Allada, Bénin": "Allada, Benin",
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
  "Parakou": "Parakou",
  "Logbozounkpa": "Logbozounkpa",
  "Bénin": "Benin",
  "Côte d'Ivoire": "Ivory Coast",
  "Sénégal": "Senegal",
  "France": "France",
  "Afrique": "Africa",

  // Relationship & Status
  "Patriarche": "Patriarch",
  "Matriarche": "Matriarch",
  "Chef de foyer": "Head of Household",
  "Époux": "Husband / Spouse",
  "Épouse": "Wife / Spouse",
  "Conjoint": "Spouse",
  "Conjointe": "Spouse",
  "Conjoint(e)": "Spouse",
  "Frère": "Brother",
  "Sœur": "Sister",
  "Fils": "Son",
  "Fille": "Daughter",
  "Enfant": "Child",
  "Enfants": "Children",
  "Père": "Father",
  "Mère": "Mother",
  "Parents": "Parents",
  "Grand-père": "Grandfather",
  "Grand-mère": "Grandmother",
  "Oncle": "Uncle",
  "Tante": "Aunt",
  "Cousin": "Cousin",
  "Cousine": "Cousin",
  "Neveu": "Nephew",
  "Nièce": "Niece",
  "Descendant": "Descendant",
  "Descendants": "Descendants",
  "Lignée": "Lineage",
  "Génération": "Generation",
  "de sang": "bloodline",
  "par alliance": "by marriage",
  "Autre union": "Other union",

  // Education, Diplomas & Universities
  "Médecine générale à FSS": "General Medicine at FSS",
  "Médecine générale": "General Medicine",
  "Gestion comptable à ENEAM": "Accounting & Financial Management at ENEAM",
  "Gestion comptable": "Accounting & Financial Management",
  "Génie électrique à EPAC": "Electrical Engineering at EPAC",
  "Génie éléctrique à EPAC": "Electrical Engineering at EPAC",
  "Génie électrique": "Electrical Engineering",
  "Génie agronomique à FSA": "Agronomic Engineering at FSA",
  "Génie agromonique à FSA": "Agronomic Engineering at FSA",
  "Génie agronomique": "Agronomic Engineering",
  "Génie Informatique et Télécommunication à EPAC": "Computer Science & Telecommunications Engineering at EPAC",
  "Génie Informatique et Télécommunication": "Computer Science & Telecommunications Engineering",
  "Informatique et Télécommunication à INSTI": "Computer Science & Telecommunications at INSTI",
  "Informatique et Télécommunication": "Computer Science & Telecommunications",
  "Formation & Études": "Education & Studies",
  "Formation & Etudes": "Education & Studies",
  "Activité professionnelle": "Professional Career",
  "Activite professionnelle": "Professional Career",

  // Activity Log Descriptions
  "Initialisation de l'arbre avec 52 membres de la famille LISSANON.": "Initialized family tree with 52 members of the LISSANON family.",
  "Mise à jour de l'arbre généalogique.": "Updated family tree records.",
  "Ajout d'un nouveau membre dans la lignée.": "Added a new member to the family lineage.",

  // Vital Status & Milestones
  "Décédé": "Passed away",
  "Décédée": "Passed away",
  "Décédé(e)": "Passed away",
  "Décès": "Passing",
  "Naissance": "Birth",
  "Vivant": "Living",
  "Vivante": "Living",
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
 * Regex pipeline to transform event titles, standard narratives, and timeline patterns into clean English
 */
const PATTERN_REPLACEMENTS: [RegExp, string][] = [
  // Full Event Titles & Occasions (non-anchored for flexibility with dates/places)
  [/Célébration de l['’]indépendance/gi, "Independence Day Celebration"],
  [/Celebration de l['’]independance/gi, "Independence Day Celebration"],
  [/Fête de l['’]indépendance/gi, "Independence Day Celebration"],
  [/Fete de l['’]independance/gi, "Independence Day Celebration"],
  [/Fête nationale/gi, "National Holiday Celebration"],
  [/Grande Réunion Familiale/gi, "Grand Family Reunion"],
  [/Grande Reunion Familiale/gi, "Grand Family Reunion"],
  [/Grande réunion familiale/gi, "Grand Family Reunion"],
  [/Réunion Familiale/gi, "Family Reunion"],
  [/Reunion Familiale/gi, "Family Reunion"],
  [/Réunion de famille/gi, "Family Reunion"],
  [/Retrouvailles Familiales/gi, "Family Reunion Gathering"],
  [/Retrouvailles annuelles/gi, "Annual Family Reunion"],
  [/Retrouvailles Annuelles/gi, "Annual Family Reunion"],
  [/Retrouvailles/gi, "Family Gathering"],
  [/Célébration Familiale/gi, "Family Celebration"],
  [/Célébration de Mariage/gi, "Wedding Celebration"],
  [/Anniversaire de mariage/gi, "Wedding Anniversary"],
  [/Anniversaire des (\d+) ans/gi, "$1th Birthday Celebration"],
  [/Célébration des (\d+) ans/gi, "$1th Anniversary Celebration"],
  [/Jubilé d['’]or/gi, "Golden Jubilee"],
  [/Jubilé d['’]argent/gi, "Silver Jubilee"],
  [/Hommage au Patriarche\s+Paul/gi, "Tribute to Patriarch Paul"],
  [/Hommage au Patriarche/gi, "Tribute to the Patriarch"],
  [/Hommage aux Ancêtres/gi, "Tribute to the Ancestors"],
  [/Hommage aux ancêtres/gi, "Tribute to the Ancestors"],
  [/Commémoration des Ancêtres/gi, "Ancestors Commemoration"],
  [/Commémoration des ancêtres/gi, "Ancestors Commemoration"],
  [/Pèlerinage aux Sources/gi, "Pilgrimage to Ancestral Roots"],
  [/Pèlerinage aux sources/gi, "Pilgrimage to Ancestral Roots"],
  [/Sortie de Nouveau-né/gi, "Newborn Outing & Blessing Ceremony"],
  [/Sortie de nouveau-né/gi, "Newborn Outing & Blessing Ceremony"],
  [/Sortie de nouveau-ne/gi, "Newborn Outing & Blessing Ceremony"],
  [/Sortie d['’]enfant/gi, "Child Presentation & Blessing Ceremony"],
  [/Baptême Traditionnel/gi, "Traditional Christening Ceremony"],
  [/Baptême traditionnel/gi, "Traditional Christening Ceremony"],
  [/Présentation du nouveau-né/gi, "Presentation of the Newborn"],
  [/Présentation du nouveau-ne/gi, "Presentation of the Newborn"],
  [/Rassemblement des descendants/gi, "Descendants Gathering"],
  [/Arbre de Noël Familial/gi, "Family Christmas Gathering"],
  [/Arbre de Noël/gi, "Christmas Gathering"],
  [/Arbre de Noel/gi, "Christmas Gathering"],
  [/Fête des Moissons/gi, "Harvest Festival"],
  [/Fête de Fin d['’]Année/gi, "End of Year Celebration"],
  [/Fête de fin d['’]année/gi, "End of Year Celebration"],
  [/Obsèques & Hommage/gi, "Funeral & Memorial Tribute"],
  [/Obsèques et Hommage/gi, "Funeral & Memorial Tribute"],
  [/Obsèques/gi, "Funeral"],
  [/Obseques/gi, "Funeral"],
  [/Messe d['’]action de grâce/gi, "Thanksgiving Mass"],
  [/Mariage de\s+/gi, "Wedding of "],
  [/Baptême de\s+/gi, "Christening of "],
  [/Hommage à\s+/gi, "Tribute to "],
  [/Hommage a\s+/gi, "Tribute to "],
  [/Obsèques de\s+/gi, "Funeral of "],

  // Common Event Narrative / Description Phrases
  [/Rassemblement de tous les descendants/gi, "Gathering of all descendants"],
  [/Rassemblement de toute la famille/gi, "Gathering of the entire family"],
  [/Rassemblement de la famille/gi, "Family gathering"],
  [/Rassemblement familial/gi, "Family gathering"],
  [/Grande réunion annuelle/gi, "Grand annual reunion"],
  [/Grande célébration annuelle/gi, "Grand annual celebration"],
  [/Célébration annuelle/gi, "Annual celebration"],
  [/Moment de partage, de communion et de réjouissances/gi, "A moment of sharing, fellowship, and celebration"],
  [/Moment de partage et de convivialité/gi, "A moment of sharing and fellowship"],
  [/Partage d['’]un grand repas traditionnel/gi, "Sharing of a grand traditional meal"],
  [/Partage d['’]un repas familial/gi, "Sharing of a family meal"],
  [/Partage d['’]un repas/gi, "Sharing of a meal"],
  [/Prières et recueillement en hommage aux ancêtres/gi, "Prayers and remembrance in tribute to the ancestors"],
  [/Prières et recueillement/gi, "Prayers and remembrance"],
  [/Prières pour les ancêtres/gi, "Prayers for the ancestors"],
  [/En hommage aux ancêtres/gi, "In tribute to the ancestors"],
  [/En hommage au Patriarche/gi, "In tribute to the Patriarch"],
  [/Pour honorer la mémoire de/gi, "To honor the memory of"],
  [/En présence de tous les membres de la famille/gi, "In the presence of all family members"],
  [/En présence de toute la famille/gi, "In the presence of the whole family"],
  [/autour du Patriarche/gi, "around the Patriarch"],
  [/autour du patriarche/gi, "around the Patriarch"],
  [/Discours des doyens et partage de souvenirs/gi, "Speeches from the elders and sharing of memories"],
  [/Discours et témoignages/gi, "Speeches and testimonies"],
  [/Bénédiction des familles et des enfants/gi, "Blessing of families and children"],
  [/Présentation des nouveaux membres et des nouveaux-nés/gi, "Presentation of new members and newborns"],
  [/Chants, danses et festivités traditionnelles/gi, "Songs, dances, and traditional festivities"],
  [/dans la joie et l['’]allégresse/gi, "in joy and celebration"],
  [/à la maison familiale/gi, "at the family residence"],
  [/au domicile du patriarche/gi, "at the patriarch's residence"],
  [/au domicile familial/gi, "at the family home"],

  // Timeline generated sentence patterns (with optional trailing dots/punctuations)
  [/^Naissance d['’]un enfant\s*:\s*(.*?)\.?$/i, "Birth of a child: $1"],
  [/^Naissance de son fils\s+(.*?)\.?$/i, "Birth of their son $1"],
  [/^Naissance de sa fille\s+(.*?)\.?$/i, "Birth of their daughter $1"],
  [/^Naissance de\s+(.*?)\.?$/i, "Birth of $1"],
  [/^Naissance\s+à\s+(.*?)\.?$/i, "Birth in $1"],
  [/^Naissance\s+au\s+(.*?)\.?$/i, "Birth in $1"],
  [/^Naissance\s+en\s+(.*?)\.?$/i, "Birth in $1"],
  [/^Naissance\.?$/i, "Birth"],
  [/^Formation & Études\.?$/i, "Education & Studies"],
  [/^Formation & Etudes\.?$/i, "Education & Studies"],
  [/^Activité professionnelle\.?$/i, "Professional Career"],
  [/^Activite professionnelle\.?$/i, "Professional Career"],
  [/^Exercice du métier de\s+(.*?)\.?$/i, "Working as $1"],
  [/^Exercice du metier de\s+(.*?)\.?$/i, "Working as $1"],
  [/^Décédé\(e\)\s+à l['’]âge de\s+(\d+)\s+ans\s+à\s+(.*?)\.?$/i, "Passed away at the age of $1 years old in $2"],
  [/^Décédée\s+à l['’]âge de\s+(\d+)\s+ans\s+à\s+(.*?)\.?$/i, "Passed away at the age of $1 years old in $2"],
  [/^Décédé\s+à l['’]âge de\s+(\d+)\s+ans\s+à\s+(.*?)\.?$/i, "Passed away at the age of $1 years old in $2"],
  [/^Décédé\(e\)\s+à l['’]âge de\s+(\d+)\s+ans\.?$/i, "Passed away at the age of $1 years old"],
  [/^Décédée\s+à l['’]âge de\s+(\d+)\s+ans\.?$/i, "Passed away at the age of $1 years old"],
  [/^Décédé\s+à l['’]âge de\s+(\d+)\s+ans\.?$/i, "Passed away at the age of $1 years old"],
  [/^Décédé\(e\)\s+à\s+(.*?)\.?$/i, "Passed away in $1"],
  [/^Décédée\s+à\s+(.*?)\.?$/i, "Passed away in $1"],
  [/^Décédé\s+à\s+(.*?)\.?$/i, "Passed away in $1"],
  [/^Décédé\(e\)\.?$/i, "Passed away"],
  [/^Décédée\.?$/i, "Passed away"],
  [/^Décédé\.?$/i, "Passed away"],
  [/^Décès\s+à\s+(.*?)\.?$/i, "Passed away in $1"],
  [/^Décès\.?$/i, "Passing"],
  [/^Enfants avec\s+(.*?)\.?$/i, "Children with $1"],

  // Location string patterns in sentences / titles
  [/\s+à\s+Cotonou,\s*Bénin/gi, " in Cotonou, Benin"],
  [/\s+à\s+Porto-Novo,\s*Bénin/gi, " in Porto-Novo, Benin"],
  [/\s+à\s+Abomey,\s*Bénin/gi, " in Abomey, Benin"],
  [/\s+à\s+Cotonou/gi, " in Cotonou"],
  [/\s+à\s+Porto-Novo/gi, " in Porto-Novo"],
  [/\s+à\s+Abomey/gi, " in Abomey"],
  [/\s+à\s+Bohicon/gi, " in Bohicon"],
  [/\s+à\s+Ouidah/gi, " in Ouidah"],
  [/\s+à\s+Parakou/gi, " in Parakou"],
  [/\s+à\s+Logbozounkpa/gi, " in Logbozounkpa"],
  [/\s+à\s+Paris/gi, " in Paris"],
  [/\s+à\s+Abidjan/gi, " in Abidjan"],
  [/\s+au\s+Bénin/gi, " in Benin"],
  [/\s+en\s+Côte d['’]Ivoire/gi, " in Ivory Coast"],
  [/\s+en\s+France/gi, " in France"],
  [/,\s*Bénin$/i, ", Benin"],
  [/,\s*Côte d['’]Ivoire$/i, ", Ivory Coast"],
  [/,\s*Sénégal$/i, ", Senegal"],
  [/,\s*France$/i, ", France"],
];

/**
 * Translates structured database fields, titles, narratives and locations into English when in 'en' mode.
 */
export function translateDbText(text: string | null | undefined, lang: Language): string {
  if (!text || typeof text !== 'string') return '';
  if (lang === 'fr') return text;

  const trimmed = text.trim();
  if (EXACT_PHRASES[trimmed]) {
    return EXACT_PHRASES[trimmed];
  }

  let result = text;
  let matched = false;
  for (const [pattern, repl] of PATTERN_REPLACEMENTS) {
    if (pattern.test(result)) {
      result = result.replace(pattern, repl);
      matched = true;
    }
  }

  return matched ? result : text;
}

/**
 * Universal Event Category Formatter & Badge Provider
 */
export function getCategoryBadgeData(cat: string | undefined | null, t: (k: any) => string) {
  const c = (cat || '').toLowerCase().trim();
  if (c.includes('reunion') || c.includes('rassemblement') || c.includes('retrouvaille') || c.includes('foyer')) {
    return { label: t('evform_cat_reunion'), bg: 'bg-[#173124] text-white', icon: Users };
  }
  if (c.includes('commem') || c.includes('hommage') || c.includes('tribute') || c.includes('obsequ') || c.includes('obsèqu')) {
    return { label: t('evform_cat_commemoration'), bg: 'bg-[#7a5739] text-white', icon: Award };
  }
  if (c.includes('celeb') || c.includes('cél') || c.includes('fete') || c.includes('fête') || c.includes('anniv') || c.includes('jubil')) {
    return { label: t('evform_cat_celebration'), bg: 'bg-[#c69214] text-white', icon: Sparkles };
  }
  if (c.includes('birth') || c.includes('naiss') || c.includes('bapt') || c.includes('nouveau-ne') || c.includes('nouveau-né')) {
    return { label: t('evform_cat_birth'), bg: 'bg-[#2980b9] text-white', icon: Baby };
  }
  if (c.includes('wed') || c.includes('mar') || c.includes('fian') || c.includes('epous') || c.includes('épous')) {
    return { label: t('evform_cat_wedding'), bg: 'bg-[#c0392b] text-white', icon: Heart };
  }
  if (c.includes('cult') || c.includes('trad') || c.includes('moiss') || c.includes('arbre')) {
    return { label: t('evform_cat_cultural'), bg: 'bg-[#496455] text-white', icon: Compass };
  }
  return { label: t('evform_cat_other'), bg: 'bg-[#727973] text-white', icon: Calendar };
}

/**
 * Translates event categories to user language
 */
export function translateEventCategory(category: string | undefined | null, lang: Language): string {
  if (!category) return '';
  const c = category.toLowerCase().trim();
  if (lang === 'fr') {
    if (c.includes('reunion') || c.includes('rassemblement')) return 'Rassemblement';
    if (c.includes('commem') || c.includes('hommage')) return 'Commémoration';
    if (c.includes('celeb') || c.includes('cél') || c.includes('fete') || c.includes('fête')) return 'Célébration';
    if (c.includes('birth') || c.includes('naiss') || c.includes('bapt')) return 'Naissance & Baptême';
    if (c.includes('wed') || c.includes('mar')) return 'Mariage & Fiançailles';
    if (c.includes('cult') || c.includes('trad')) return 'Tradition & Culture';
    return 'Autre événement';
  } else {
    if (c.includes('reunion') || c.includes('rassemblement')) return 'Family Reunion';
    if (c.includes('commem') || c.includes('hommage')) return 'Commemoration & Tribute';
    if (c.includes('celeb') || c.includes('cél') || c.includes('fete') || c.includes('fête')) return 'Celebration & Jubilee';
    if (c.includes('birth') || c.includes('naiss') || c.includes('bapt')) return 'Birth & Christening';
    if (c.includes('wed') || c.includes('mar')) return 'Wedding & Betrothal';
    if (c.includes('cult') || c.includes('trad')) return 'Tradition & Culture';
    return 'Other Event';
  }
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
 * Translates timeline events into English cleanly
 */
export function translateTimelineEvent(event: TimelineEvent, lang: Language): TimelineEvent {
  if (!event || lang === 'fr') return event;

  let title = event.title;
  let description = event.description;
  let location = event.location ? translateDbText(event.location, lang) : event.location;

  // 1. Process Event Title
  if (title) {
    const trimmedTitle = title.trim();
    if (trimmedTitle === 'Naissance') {
      title = 'Birth';
    } else if (trimmedTitle === 'Décès' || trimmedTitle === 'Décédé' || trimmedTitle === 'Décédée') {
      title = 'Passing';
    } else if (trimmedTitle === 'Formation & Études' || trimmedTitle === 'Formation & Etudes') {
      title = 'Education & Studies';
    } else if (trimmedTitle === 'Activité professionnelle' || trimmedTitle === 'Activite professionnelle') {
      title = 'Professional Career';
    } else if (/^Naissance d['’]un enfant\s*:\s*(.*)$/i.test(trimmedTitle)) {
      title = trimmedTitle.replace(/^Naissance d['’]un enfant\s*:\s*(.*)$/i, 'Birth of a child: $1');
    } else {
      title = translateDbText(title, lang);
    }
  }

  // 2. Process Event Description
  if (description) {
    const d = description.trim();

    // Death / Passing patterns
    const deathAgeLocMatch = d.match(/^Décéd[ée]\(?e?\)?\s+à l['’]âge de\s+(\d+)\s+ans\s+à\s+([^.]+)\.?$/i);
    if (deathAgeLocMatch) {
      const age = deathAgeLocMatch[1];
      const loc = translateDbText(deathAgeLocMatch[2].trim(), lang);
      description = `Passed away at the age of ${age} years old in ${loc}.`;
    } else {
      const deathAgeMatch = d.match(/^Décéd[ée]\(?e?\)?\s+à l['’]âge de\s+(\d+)\s+ans\.?$/i);
      if (deathAgeMatch) {
        description = `Passed away at the age of ${deathAgeMatch[1]} years old.`;
      } else {
        const deathLocMatch = d.match(/^(?:Décéd[ée]\(?e?\)?|Décès)\s+à\s+([^.]+)\.?$/i);
        if (deathLocMatch) {
          const loc = translateDbText(deathLocMatch[1].trim(), lang);
          description = `Passed away in ${loc}.`;
        } else if (/^(?:Décéd[ée]\(?e?\)?|Décès)\.?$/i.test(d)) {
          description = `Passed away.`;
        } else {
          // Career pattern: "Exercice du métier de Enseignant."
          const careerMatch = d.match(/^Exercice du m[ée]tier de\s+([^.]+)\.?$/i);
          if (careerMatch) {
            const prof = translateDbText(careerMatch[1].trim(), lang);
            description = `Working as ${prof}.`;
          } else {
            // Child birth pattern: "Naissance de son fils Alexis à Abomey." or "Naissance de sa fille Clara à Cotonou."
            const childBirthLocMatch = d.match(/^Naissance de s(?:on|a)\s+(fils|fille)\s+(.*?)\s+à\s+([^.]+)\.?$/i);
            if (childBirthLocMatch) {
              const genderNoun = childBirthLocMatch[1].toLowerCase() === 'fils' ? 'son' : 'daughter';
              const childName = childBirthLocMatch[2].trim();
              const loc = translateDbText(childBirthLocMatch[3].trim(), lang);
              description = `Birth of their ${genderNoun} ${childName} in ${loc}.`;
            } else {
              const childBirthMatch = d.match(/^Naissance de s(?:on|a)\s+(fils|fille)\s+([^.]+)\.?$/i);
              if (childBirthMatch) {
                const genderNoun = childBirthMatch[1].toLowerCase() === 'fils' ? 'son' : 'daughter';
                const childName = childBirthMatch[2].trim();
                description = `Birth of their ${genderNoun} ${childName}.`;
              } else {
                // General birth pattern: "Naissance de Paul Comlan LISSANON à Cotonou."
                const birthLocMatch = d.match(/^Naissance de\s+(.*?)\s+à\s+([^.]+)\.?$/i);
                if (birthLocMatch) {
                  const personName = birthLocMatch[1].trim();
                  const loc = translateDbText(birthLocMatch[2].trim(), lang);
                  description = `Birth of ${personName} in ${loc}.`;
                } else {
                  const birthMatch = d.match(/^Naissance de\s+([^.]+)\.?$/i);
                  if (birthMatch) {
                    description = `Birth of ${birthMatch[1].trim()}.`;
                  } else {
                    description = translateDbText(description, lang);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    ...event,
    title,
    description,
    location,
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
  let education = (person as any).education ? translateDbText((person as any).education, lang) : (person as any).education;

  if (isPaul) {
    biography = PAUL_LISSANON_EN.biography;
    accomplishments = PAUL_LISSANON_EN.accomplishments;
    education = PAUL_LISSANON_EN.education;
  }

  const result: any = {
    ...person,
    profession,
    birth_place,
    ...(death_place !== undefined ? { death_place } : {}),
    ...(biography !== undefined ? { biography } : {}),
    ...(accomplishments !== undefined ? { accomplishments } : {}),
    ...(education !== undefined ? { education } : {}),
  };

  // If PersonDetail, recursively translate timeline, parents, spouses, siblings, children
  if (Array.isArray((person as any).timeline)) {
    result.timeline = (person as any).timeline.map((ev: TimelineEvent) => translateTimelineEvent(ev, lang));
  }

  if ((person as any).father) {
    result.father = translatePersonData((person as any).father, lang);
  }
  if ((person as any).mother) {
    result.mother = translatePersonData((person as any).mother, lang);
  }
  if (Array.isArray((person as any).spouses)) {
    result.spouses = (person as any).spouses.map((s: Person) => translatePersonData(s, lang));
  }
  if (Array.isArray((person as any).siblings)) {
    result.siblings = (person as any).siblings.map((s: Person) => translatePersonData(s, lang));
  }
  if (Array.isArray((person as any).children)) {
    result.children = (person as any).children.map((c: Person) => translatePersonData(c, lang));
  }
  if (Array.isArray((person as any).children_by_spouse)) {
    result.children_by_spouse = (person as any).children_by_spouse.map((group: any) => ({
      spouse: group.spouse ? translatePersonData(group.spouse, lang) : null,
      children: Array.isArray(group.children) ? group.children.map((c: Person) => translatePersonData(c, lang)) : [],
    }));
  }

  return result as T;
}
