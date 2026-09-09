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
 * High-performance regex pipeline to transform French phrases into natural English
 */
const PATTERN_REPLACEMENTS: [RegExp, string][] = [
  // Specific Event Names & Expressions
  [/Célébration de l['’]indépendance/gi, "Independence Day Celebration"],
  [/Celebration de l['’]independance/gi, "Independence Day Celebration"],
  [/Fête de l['’]indépendance/gi, "Independence Day Celebration"],
  [/Fete de l['’]independance/gi, "Independence Day Celebration"],
  [/Grande Réunion Familiale/gi, "Grand Family Reunion"],
  [/Grande Reunion Familiale/gi, "Grand Family Reunion"],
  [/Réunion Familiale/gi, "Family Reunion"],
  [/Reunion Familiale/gi, "Family Reunion"],
  [/Retrouvailles Familiales/gi, "Family Gathering"],
  [/Retrouvailles/gi, "Reunion & Gathering"],
  [/Célébration Familiale/gi, "Family Celebration"],
  [/Célébration/gi, "Celebration"],
  [/Celebration/gi, "Celebration"],
  [/Commémoration/gi, "Commemoration"],
  [/Commemoration/gi, "Commemoration"],
  [/Hommage au Patriarche/gi, "Tribute to the Patriarch"],
  [/Hommage/gi, "Tribute"],
  [/Mariage & Fiançailles/gi, "Wedding & Betrothal"],
  [/Mariage/gi, "Wedding"],
  [/Naissance & Baptême/gi, "Birth & Christening"],
  [/Naissance/gi, "Birth"],
  [/Tradition & Culture/gi, "Tradition & Culture"],
  [/Autre événement/gi, "Other Event"],
  [/Pèlerinage aux sources/gi, "Pilgrimage to Ancestral Roots"],
  [/Pèlerinage/gi, "Pilgrimage"],
  [/Pelerinage/gi, "Pilgrimage"],

  // Timeline sentence patterns
  [/Naissance d['’]un enfant\s*:\s*/gi, "Birth of a child: "],
  [/Naissance de son fils\s+/gi, "Birth of their son "],
  [/Naissance de sa fille\s+/gi, "Birth of their daughter "],
  [/Naissance de\s+/gi, "Birth of "],
  [/^Naissance\s+à\s+/i, "Birth in "],
  [/^Naissance\s+au\s+/i, "Birth in "],
  [/^Naissance\s+en\s+/i, "Birth in "],
  [/^Naissance$/i, "Birth"],
  [/Formation & Études/gi, "Education & Studies"],
  [/Formation & Etudes/gi, "Education & Studies"],
  [/Activité professionnelle/gi, "Professional Career"],
  [/Activite professionnelle/gi, "Professional Career"],
  [/Exercice du métier de\s+/gi, "Working as "],
  [/Exercice du metier de\s+/gi, "Working as "],
  [/Décédé\(e\)\s+à l['’]âge de\s+(\d+)\s+ans/gi, "Passed away at the age of $1 years old"],
  [/Décédée\s+à l['’]âge de\s+(\d+)\s+ans/gi, "Passed away at the age of $1 years old"],
  [/Décédé\s+à l['’]âge de\s+(\d+)\s+ans/gi, "Passed away at the age of $1 years old"],
  [/Décédé\(e\)/gi, "Passed away"],
  [/Décédée/gi, "Passed away"],
  [/Décédé/gi, "Passed away"],
  [/Décès\s+à\s+/gi, "Passed away in "],
  [/^Décès$/gi, "Passed away"],
  [/Enfants avec\s+/gi, "Children with "],

  // Common prepositions & connectives
  [/\s+à l['’]âge de\s+(\d+)\s+ans/gi, " at the age of $1 years old"],
  [/\s+à l['’]âge de\s+/gi, " at the age of "],
  [/\s+à\s+Cotonou/gi, " in Cotonou"],
  [/\s+à\s+Porto-Novo/gi, " in Porto-Novo"],
  [/\s+à\s+Abomey/gi, " in Abomey"],
  [/\s+à\s+Bohicon/gi, " in Bohicon"],
  [/\s+à\s+Ouidah/gi, " in Ouidah"],
  [/\s+à\s+Parakou/gi, " in Parakou"],
  [/\s+à\s+Logbozounkpa/gi, " in Logbozounkpa"],
  [/\s+à\s+Djidja/gi, " in Djidja"],
  [/\s+à\s+Natitingou/gi, " in Natitingou"],
  [/\s+à\s+Allada/gi, " in Allada"],
  [/\s+à\s+Lomé/gi, " in Lome"],
  [/\s+à\s+Dakar/gi, " in Dakar"],
  [/\s+à\s+Paris/gi, " in Paris"],
  [/\s+à\s+Accra/gi, " in Accra"],
  [/\s+à\s+Lagos/gi, " in Lagos"],
  [/\s+au\s+Bénin/gi, " in Benin"],
  [/\s+en\s+Côte d['’]Ivoire/gi, " in Ivory Coast"],
  [/\s+en\s+France/gi, " in France"],
  [/\s+au\s+Sénégal/gi, " in Senegal"],
  [/,\s*Bénin/gi, ", Benin"],
  [/,\s*Côte d['’]Ivoire/gi, ", Ivory Coast"],
  [/,\s*Sénégal/gi, ", Senegal"],
  [/,\s*France/gi, ", France"],

  // Titles & Titles roles
  [/\bPatriarche\b/gi, "Patriarch"],
  [/\bMatriarche\b/gi, "Matriarch"],
  [/\bChef de foyer\b/gi, "Head of Household"],
  [/\bConjoint\(e\)\b/gi, "Spouse"],
  [/\bConjoint\b/gi, "Spouse"],
  [/\bConjointe\b/gi, "Spouse"],
  [/\bÉpouse\b/gi, "Spouse"],
  [/\bEpouse\b/gi, "Spouse"],
  [/\bÉpoux\b/gi, "Spouse"],
  [/\bEpoux\b/gi, "Spouse"],
  [/\bFrère\b/gi, "Brother"],
  [/\bFrere\b/gi, "Brother"],
  [/\bSœur\b/gi, "Sister"],
  [/\bSoeur\b/gi, "Sister"],
  [/\bFils\b/g, "Son"],
  [/\bFille\b/g, "Daughter"],
  [/\bEnfants\b/gi, "Children"],
  [/\bDescendance\b/gi, "Descendants"],
  [/\bLignée\b/gi, "Lineage"],
  [/\bLignee\b/gi, "Lineage"],
  [/\bGénération\b/gi, "Generation"],
  [/\bGeneration\b/gi, "Generation"],

  // Professions & Key terms
  [/\bEnseignant\(e\)\b/gi, "Teacher / Educator"],
  [/\bEnseignant\b/gi, "Teacher"],
  [/\bEnseignante\b/gi, "Teacher"],
  [/\bProfesseur\b/gi, "Professor"],
  [/\bIngénieur\b/gi, "Engineer"],
  [/\bIngenieur\b/gi, "Engineer"],
  [/\bCommerçant\(e\)\b/gi, "Trader / Merchant"],
  [/\bCommerçant\b/gi, "Trader / Merchant"],
  [/\bCommerçante\b/gi, "Trader / Businesswoman"],
  [/\bCommercant\b/gi, "Trader / Merchant"],
  [/\bCommercante\b/gi, "Trader / Businesswoman"],
  [/\bMédecin\b/gi, "Physician / Medical Doctor"],
  [/\bMedecin\b/gi, "Physician / Medical Doctor"],
  [/\bÉtudiant\(e\)\b/gi, "Student"],
  [/\bÉtudiant\b/gi, "Student"],
  [/\bÉtudiante\b/gi, "Student"],
  [/\bEtudiant\b/gi, "Student"],
  [/\bEtudiante\b/gi, "Student"],
  [/\bBénin\b/g, "Benin"],
  [/\bBenin\b/g, "Benin"],
  [/\bCôte d['’]Ivoire\b/g, "Ivory Coast"],
  [/\bCote d['’]Ivoire\b/g, "Ivory Coast"],
  [/\bSénégal\b/g, "Senegal"],
  [/\bSenegal\b/g, "Senegal"],
  [/\bAfrique\b/g, "Africa"],

  // Activity logs
  [/Création de l['’]événement familial/gi, "Creation of family event"],
  [/Mise à jour de l['’]événement/gi, "Update of family event"],
  [/Suppression de l['’]événement/gi, "Deletion of family event"],
];

/**
 * Word-level bilingual vocabulary dictionary for French -> English fallback translation
 */
const WORD_TRANSLATIONS: Record<string, string> = {
  // Family & People
  famille: "family",
  ancetres: "ancestors",
  ancêtres: "ancestors",
  ancêtre: "ancestor",
  ancetre: "ancestor",
  enfants: "children",
  enfant: "child",
  fils: "son",
  fille: "daughter",
  filles: "daughters",
  parents: "parents",
  parent: "parent",
  pere: "father",
  père: "father",
  mere: "mother",
  mère: "mother",
  frere: "brother",
  frère: "brother",
  freres: "brothers",
  frères: "brothers",
  soeur: "sister",
  sœur: "sister",
  soeurs: "sisters",
  sœurs: "sisters",
  oncle: "uncle",
  oncles: "uncles",
  tante: "aunt",
  tantes: "aunts",
  cousin: "cousin",
  cousine: "cousin",
  cousins: "cousins",
  cousines: "cousins",
  neveu: "nephew",
  neveux: "nephews",
  niece: "niece",
  nièce: "niece",
  nieces: "nieces",
  nièces: "nieces",
  epoux: "husband",
  époux: "husband",
  epouse: "wife",
  épouse: "wife",
  conjoint: "spouse",
  conjointe: "spouse",
  conjoints: "spouses",
  allies: "allies",
  alliés: "allies",
  descendants: "descendants",
  descendant: "descendant",
  descendance: "descendants",
  lignee: "lineage",
  lignée: "lineage",
  foyer: "household",
  foyers: "households",
  generation: "generation",
  génération: "generation",
  generations: "generations",
  générations: "generations",
  doyen: "elder",
  doyenne: "elder",
  patriarche: "patriarch",
  patriarches: "patriarchs",
  matriarche: "matriarch",
  matriarches: "matriarchs",
  membre: "member",
  membres: "members",

  // Events & Celebrations
  rassemblement: "gathering",
  rassemblements: "gatherings",
  reunion: "reunion",
  réunion: "reunion",
  reunions: "reunions",
  réunions: "reunions",
  retrouvailles: "reunion",
  fete: "celebration",
  fête: "celebration",
  fetes: "celebrations",
  fêtes: "celebrations",
  celebration: "celebration",
  célébration: "celebration",
  celebrations: "celebrations",
  célébrations: "celebrations",
  commemoration: "commemoration",
  commémoration: "commemoration",
  commemorations: "commemorations",
  commémorations: "commemorations",
  hommage: "tribute",
  hommages: "tributes",
  souvenir: "memory",
  souvenirs: "memories",
  memoire: "memory",
  mémoire: "memory",
  messe: "mass",
  priere: "prayer",
  prière: "prayer",
  prieres: "prayers",
  prières: "prayers",
  benediction: "blessing",
  bénédiction: "blessing",
  benedictions: "blessings",
  bénédictions: "blessings",
  mariage: "wedding",
  mariages: "weddings",
  noces: "wedding",
  bapteme: "christening",
  baptême: "christening",
  naissance: "birth",
  naissances: "births",
  presentation: "presentation",
  présentation: "presentation",
  sortie: "outing",
  deces: "death",
  décès: "death",
  obseques: "funeral",
  obsèques: "funeral",
  jubile: "jubilee",
  jubilé: "jubilee",
  pelerinage: "pilgrimage",
  pèlerinage: "pilgrimage",
  arbre: "tree",
  noel: "Christmas",
  Noël: "Christmas",
  anniversaire: "anniversary",
  anniversaires: "anniversaries",
  discours: "speech",
  repas: "dinner",
  banquet: "banquet",
  ceremonie: "ceremony",
  cérémonie: "ceremony",
  ceremonies: "ceremonies",
  cérémonies: "ceremonies",

  // Verbs & Actions
  celebrer: "celebrate",
  célébrer: "celebrate",
  celebre: "celebrated",
  célèbre: "celebrates",
  celebree: "celebrated",
  célébrée: "celebrated",
  celebres: "celebrated",
  célébrés: "celebrated",
  celebrent: "celebrate",
  célèbrent: "celebrate",
  feter: "celebrate",
  fêter: "celebrate",
  feteux: "festive",
  fetees: "celebrated",
  fêtées: "celebrated",
  fetes_: "celebrated",
  fêtés: "celebrated",
  reunir: "gather",
  réunir: "gather",
  reuni: "gathered",
  réuni: "gathered",
  reunie: "gathered",
  réunie: "gathered",
  reunis: "gathered",
  réunis: "gathered",
  reunies: "gathered",
  réunies: "gathered",
  rassembler: "assemble",
  rassemble: "assembles",
  rassemblee: "assembled",
  rassemblée: "assembled",
  rassembles: "assembled",
  rassemblés: "assembled",
  honorer: "honor",
  honore: "honored",
  honoré: "honored",
  honoree: "honored",
  honorée: "honored",
  honores: "honored",
  honorés: "honored",
  organiser: "organize",
  organise: "organized",
  organisé: "organized",
  organisee: "organized",
  organisée: "organized",
  organises: "organized",
  organisés: "organized",
  partager: "share",
  partage: "sharing",
  partagé: "shared",
  partagée: "shared",
  partages: "shared",
  partagés: "shared",
  partagent: "share",
  accueillir: "welcome",
  accueilli: "welcomed",
  accueillie: "welcomed",
  accueillis: "welcomed",
  participer: "participate",
  participe: "participates",
  participe_: "participated",
  participé: "participated",
  prier: "pray",
  prient: "pray",
  chanter: "sing",
  chantent: "sing",
  danser: "dance",
  dansent: "dance",
  decede: "passed away",
  décédé: "passed away",
  decedee: "passed away",
  décédée: "passed away",
  decedes: "passed away",
  décédés: "passed away",
  ne: "born",
  né: "born",
  nee: "born",
  née: "born",
  nes: "born",
  nés: "born",
  nees: "born",
  nées: "born",
  vivre: "live",
  vecu: "lived",
  vécu: "lived",
  vivant: "alive",
  vivante: "alive",
  vivants: "alive",
  vivantes: "alive",
  ajouter: "add",
  ajoutez: "add",
  ajout: "addition",
  marquer: "mark",
  marquant: "marking",
  raconter: "tell",
  racontez: "tell",
  enrichir: "enrich",

  // Adjectives & Descriptions
  grand: "grand",
  grande: "grand",
  grands: "grand",
  grandes: "grand",
  petit: "small",
  petite: "small",
  petits: "small",
  petites: "small",
  premier: "first",
  premiere: "first",
  première: "first",
  premiers: "first",
  premieres: "first",
  premières: "first",
  deuxieme: "second",
  deuxième: "second",
  troisieme: "third",
  troisième: "third",
  dernier: "last",
  derniere: "last",
  dernière: "last",
  derniers: "last",
  dernieres: "last",
  dernières: "last",
  nouveau: "new",
  nouvelle: "new",
  nouveaux: "new",
  nouvelles: "new",
  annuel: "annual",
  annuelle: "annual",
  annuels: "annual",
  annuelles: "annual",
  traditionnel: "traditional",
  traditionnelle: "traditional",
  traditionnels: "traditional",
  traditionnelles: "traditional",
  solennel: "solemn",
  solennelle: "solemn",
  solennels: "solemn",
  solennelles: "solemn",
  memorables: "memorable",
  mémorables: "memorable",
  mémorable: "memorable",
  inoubliable: "unforgettable",
  chaleureux: "warm",
  chaleureuse: "warm",
  fraternel: "fraternal",
  fraternelle: "fraternal",
  fraternels: "fraternal",
  fraternelles: "fraternal",
  familial: "family",
  familiale: "family",
  familiaux: "family",
  familiales: "family",
  national: "national",
  nationale: "national",
  nationaux: "national",
  nationales: "national",
  anciennes: "ancient",
  anciens: "former",
  ancien: "former",
  ancienne: "former",
  beau: "beautiful",
  belle: "beautiful",
  beaux: "beautiful",
  belles: "beautiful",
  bon: "good",
  bonne: "good",
  bons: "good",
  bonnes: "good",
  heureux: "happy",
  heureuse: "happy",
  joyeux: "joyful",
  joyeuse: "joyful",
  magnifique: "magnificent",
  historique: "historic",
  historiques: "historic",

  // Emotions, abstract, general nouns
  joie: "joy",
  bonheur: "happiness",
  amour: "love",
  paix: "peace",
  concorde: "harmony",
  communion: "communion",
  respect: "respect",
  unite: "unity",
  unité: "unity",
  histoire: "story",
  histoires: "stories",
  vie: "life",
  parcours: "journey",
  etudes: "education",
  études: "education",
  metier: "profession",
  métier: "profession",
  travail: "work",
  lieu: "place",
  lieux: "places",
  ville: "city",
  village: "village",
  pays: "country",
  maison: "home",
  eglise: "church",
  église: "church",
  paroisse: "parish",
  presence: "presence",
  présence: "presence",
  annee: "year",
  année: "year",
  annees: "years",
  années: "years",
  ans: "years old",
  mois: "months",
  jour: "day",
  journee: "day",
  journée: "day",
  soir: "evening",
  soiree: "evening",
  soirée: "evening",
  matin: "morning",

  // Connectives & Prepositions
  avec: "with",
  dans: "in",
  pour: "for",
  sans: "without",
  sous: "under",
  sur: "on",
  vers: "towards",
  chez: "at the home of",
  depuis: "since",
  pendant: "during",
  lors: "during",
  selon: "according to",
  tous: "all",
  toutes: "all",
  tout: "all",
  toute: "all",
  chaque: "every",
  plusieurs: "several",
  beaucoup: "many",
  tres: "very",
  très: "very",
  aussi: "also",
  ainsi: "thus",
  alors: "then",
  apres: "after",
  après: "after",
  avant: "before",
  aujourdhui: "today",
  "aujourd'hui": "today",
  hier: "yesterday",
  demain: "tomorrow",
  son: "their",
  sa: "their",
  ses: "their",
  leur: "their",
  leurs: "their",
  notre: "our",
  nos: "our",
  votre: "your",
  vos: "your",
  mon: "my",
  ma: "my",
  mes: "my",
  un: "a",
  une: "a",
  des: "the",
  les: "the",
  le: "the",
  la: "the",
  et: "and",
  ou: "or",
  mais: "but",
  est: "is",
  sont: "are",
  etait: "was",
  était: "was",
  etaient: "were",
  étaient: "were",
  fut: "was",
  furent: "were",
  a: "has",
  ont: "have",
  avait: "had",
  avaient: "had",
};

/**
 * Translates any French text string into natural English when in 'en' mode.
 */
export function translateDbText(text: string | null | undefined, lang: Language): string {
  if (!text || typeof text !== 'string') return '';
  if (lang === 'fr') return text;

  const trimmed = text.trim();
  if (EXACT_PHRASES[trimmed]) {
    return EXACT_PHRASES[trimmed];
  }

  let result = text;
  for (const [pattern, repl] of PATTERN_REPLACEMENTS) {
    result = result.replace(pattern, repl);
  }

  // Token-level fallback translation for any remaining French words
  result = result.replace(/[a-zA-ZÀ-ÿ]+/g, (match) => {
    const lower = match.toLowerCase();
    const translated = WORD_TRANSLATIONS[lower];
    if (translated) {
      // Preserve uppercase or capitalize first letter if original was capitalized
      if (match === match.toUpperCase() && match.length > 1) {
        return translated.toUpperCase();
      }
      if (match[0] === match[0].toUpperCase()) {
        return translated.charAt(0).toUpperCase() + translated.slice(1);
      }
      return translated;
    }
    return match;
  });

  return result;
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

/**
 * Translates timeline events
 */
export function translateTimelineEvent(event: TimelineEvent, lang: Language): TimelineEvent {
  if (!event || lang === 'fr') return event;

  return {
    ...event,
    title: translateDbText(event.title, lang),
    description: translateDbText(event.description, lang),
    location: event.location ? translateDbText(event.location, lang) : event.location,
  };
}
