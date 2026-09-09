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

  // Specific Celebration Titles
  "CELEBRATION DE L'AN IV DU DECES DE LISSANON COMLAN PAUL (LCP)": "CELEBRATION OF THE 4TH ANNIVERSARY OF THE PASSING OF LISSANON COMLAN PAUL (LCP)",
  "Célébration de l'an IV du décès de LISSANON Comlan Paul (LCP)": "Celebration of the 4th Anniversary of the Passing of LISSANON Comlan Paul (LCP)",
  "Célébration de l'an IV du décès de Paul Comlan LISSANON": "Celebration of the 4th Anniversary of the Passing of Paul Comlan LISSANON",
  "Hommage et Célébration de l'an IV": "Tribute and Celebration of the 4th Anniversary",
};

/**
 * Paul Comlan LISSANON's full bilingual biographies & Historical Anniversary Narrative
 */
export const PAUL_LISSANON_MEMORIAL_EN = `CELEBRATION OF THE 4TH ANNIVERSARY OF THE PASSING OF LISSANON COMLAN PAUL (LCP)

BRIEF HISTORY OF THE LIFE OF LCP

Born in the village of Lissazounmé in Abomey, to mother Nanvo, a homemaker, and father Alamandoganha Mataguessi, 1st Dah of the LISSANON family. A former Tax Collector in Allada, Alamandoganha Mataguessi was the reformer of the organizational and governance structure of the AHANGNAN - SACLA - ADIKO and LISSANON communities.

Comlan Paul was born after several miscarriages and stillbirths suffered by his mother. At birth, he was seriously ill for a prolonged period and was nearly given up for dead when his mother's guardian, AGBLA, visiting his friend Alamandoganha Mataguessi, prophesied that this child would not share the fate of the seven (7) previous siblings who had all passed away shortly after birth. AGBLA committed himself tirelessly through traditional healing treatments, and the child miraculously survived.
Comlan Paul was therefore an Abiku child in accordance with our ancestral traditions.

It must be recalled that his mother was for a long time caught in a leadership struggle and dispute between her biological father and the guardian who raised her, AGBLA, such that the matter was eventually resolved before the traditional customary court. When asked by the judge who her true father was, she went and embraced her biological father and progenitor. Her birth certificate was then officially issued under her biological father, to the detriment of her guardian.
This created deep resentment, and when she later married, her guardian placed a curse upon her, which according to local tradition accounted for the successive miscarriages and stillbirths she experienced.
As for his son Comlan Paul, miraculously snatched from the jaws of death, his father designated him as the child chosen to attend modern formal schooling and bring back great blessings for the family. In the words of Alamandoganha Mataguessi to his son: "With this school pen, you shall climb mountains and you shall become the pride and envy of all your brothers."

Thus, he was sent to take his first steps in formal education in Calavi under the care of a maternal uncle.
Domestic hardships in the uncle's household resulted in young Paul finding himself on the streets, sleeping in a makeshift garage. Nearby in Calavi, an elderly night watchman took notice of him and helped him as best as he could.

One day, a relative from the village of Lissazounmé, a traditional practitioner commonly known as Houssato, spotted him and informed his parents upon returning to the village. Alerted, they dispatched Comlan Paul's elder sister, Aunt Sahèton, to his rescue. She boarded the very first train to fetch her younger brother, who was languishing on the streets of Calavi.
Convinced that his destiny lay in formal education, his father Alamandoganha Mataguessi sent him back to resume his schooling in Abomey, where he completed primary school a few years later, earning the Primary School Certificate (CEP).
Unaware of administrative enrollment procedures, he returned to Lissazounmé and resumed farming. By a fortunate turn of events, one of his former schoolmasters passing through Lissazounmé saw him playing soccer and called out: "Comlan, come here! Don't you know classes have already resumed at Collège Père Aupiais where you have been admitted?"
He was astonished and naive in the face of this news. The teacher patiently explained the admission process to him. He then rushed to explain everything to his mother, as his father had already passed away and been laid to rest.
The next morning, his mother took him to the train station, where he boarded the train alone towards Gbégamey station in Cotonou. Thus began his new academic life. During vacations, he returned to the village to visit his mother, placed under the care of his elder brother Canut, with whom he worked in the fields. School terms in Cotonou and holidays in Lissazounmé: this was Comlan's routine until he earned his Scientific Baccalaureate (Series S) with honors.
Destiny steered his life towards education: after a venture to Senegal where he sat for the West African Regional Bank exam, he joined Benin's teaching corps. He retired in 1992 after thirty (30) years of dedicated service and was awarded the Grand Knight Medal of the National Order of Merit of Benin.
One morning in June 2022, following intense emotional stress, he suffered a transient ischemic attack followed by a stroke the next day. He spent three (3) months in a deep coma, including two (2) months in the hospital and one (1) month at his residence in Logbozounkpa.
On August 31, 2022, he drew his last breath around 11:15 AM in his living room.

His Career & The Turning Point
LISSANON Comlan Paul was the first State Representative and former Deputy of the Agbangnizoun Municipality.
He taught notably in Kandi (North), Abomey (Zou), Adjohoun (Porto-Novo), Wankon (Abomey), Akpakpa-Centre (Cotonou), Gbégamey (Cotonou), and concluded his career at Collège Père Aupiais (Cotonou).
His appointment as the founding Principal of CEG WANKON proved to be the fateful turning point of his entire life.
At Wankon, he served simultaneously as Principal, Dean of Studies, Accountant, and General Supervisor for the newly established school.
He had purchased a new automobile that he drove himself or with his driver—a distinguished intellectual executive leading an orderly life.
One day, traveling on a motorcycle with his brother-in-law Minkpetin Sènou Alphonse on the way back from school after distributing merit scholarship funds, he lost the handbag containing the remaining scholarship money for deserving pupils.
This was the start of the ordeal.
What humiliation did he not endure?
Intense stress, threats of dismissal and imprisonment, mockery from jealous colleagues, slander of all kinds, unwarranted condemnation by some village peers, suspicion of theft against himself and his young wife... It was the beginning of a long ordeal.
What customary sanctuary, Bokonon, or traditional shrine did he not consult to recover the lost bag or calm the storm?
It felt as if the sky had fallen on his head, and ironically, he had virtually no literate advisor to come to his aid.
Driven by jealousy, some students who had already received their stipend dishonestly claimed they had received nothing, knowing the sign-off sheets had been lost with the bag.

Though severely shaken, he weathered the storm thanks to his schoolmate from Collège Père Aupiais, Crinot Lazarre, an official in the Ministry of Education who helped him navigate the legal proceedings.
Paul liquidated assets, pawned possessions, and borrowed heavily to repay every single student scholarship from his own pocket.
He even abandoned his car with a local mechanic in Lissazounmé and never claimed it back until his dying day. He managed the repayments over several years following the crisis.
He eventually transferred to Cotonou to teach Mathematics at Akpakpa Centre, later serving at CEG Gbégamey and ultimately returning to the institution that educated him, Collège Père Aupiais.

After official investigations fully cleared and exonerated him, the State invited him to lead the CEG of Agbangnizoun, but scarred by his painful experience, he declined and chose to dedicate himself exclusively to classroom teaching, declining subsequent political and administrative appointments.

His arrival in Cotonou in 1974 was among the most grueling chapters of his life as he continually serviced debts while supporting his family. His young wife Guézinton was heavily pregnant with a challenging pregnancy. The family found shelter at the residence of François ZOHOUN (C/769) in Gbégamey, owned by the father of his close classmate, Professor Isidore ZOHOUN.
Paul Comlan was a revered educator of immense erudition who taught without notes, mastering his subjects completely. He taught and mentored many of Benin's foremost leaders, including former President Thomas Boni YAYI, Minister Abdoulaye BIO TCHANE, National Assembly President Joseph DJOGBENOU, numerous ministry directors, army generals, judges, and physicians—many of whom gathered to pay their final respects at Cocotomey Catholic Church on October 21, 2022.

Comlan Paul embodied profound generosity and selfless altruism, housing and supporting dozens of underprivileged youth from Lissazounmé throughout his life. He walked miles across Cotonou neighborhoods (Tokpa, Gbégamey, Cadjèhoun, Sainte-Rita, Fifadji, Ganhito) to deliver home tutoring to support his extended dependents and prioritize his children's education above all personal comfort.
For the record, here are the affectionate nicknames he gave his children:

SOME NICKNAMES FOR HIS CHILDREN:
January for Janvier
Laure Melaure de mekolaure - Laure de Laurette for Laure
Genin Djèckogè, Djèmindjè de Mekodjè for Angèle
Claudou douclo, Claudio Gentillé de Yougoslavie for Claude
Vaquhoun Loum Valoum for Valère
Simequosoeu for Alexis
Elevepi for Eric
Hervevor des Hervévores for Hervé
Leahountitire for Laetitia
Salomonco de Saloum for Salomon
Attaquin for Regina
To name but a few, as the nicknames evolved with his affectionate moods...

The tribulations of life tested his seven (7) years of Catholic devotion at Collège Père Aupiais where he was baptized and confirmed. Over two decades, he sought traditional spiritual paths across local sanctuaries.

Marriages and Family Life
In his family life, Paul's first wife was Rosalie SEGBEDJI (Maman Daassi), with whom he had three (3) children: Janvier, Laure, and late Angèle.

He separated from his second wife, Antoinette ACAKPO (a certified midwife), following marital difficulties, with no children from the union.

He united with his third wife, Lucienne Lokossi DEGBO (Guézinton of Dègbocodji), with whom he had eight (8) children, in order: Claude, Valère, Alexis, late Eric, Hervé, Salomon, Laetitia, and Régina.

Regarding his spiritual life,
Divine grace touched him once again after two decades, and he renewed his deep Christian faith. He celebrated a legal and religious marriage with his wife Lucienne (Guézinton) in 2002, dedicating his life fully to God and declining traditional chieftaincy (Dah) enstoolment in Lissazounmé in accordance with his Christian convictions.

He was laid to rest on October 21, 2022, at his residence in Fifadji, Lissazounmé, according to Catholic funeral rites.
These are some key milestones from the life of Patriarch Paul Comlan LISSANON.
May he rest in peace and his inspiring legacy continue to shine upon all our lives.
May blessings abound!

Editor's Notes:
A person's life is an infinite book and not everything can be captured. We thank everyone for their kind understanding. This biography will continue to be enriched by memories and testimonies for future generations. Text proposed by Alexis LISSANON; reviewed by Valère, Claude, and Janvier LISSANON; formatted and published by Claude LISSANON on 28/08/2026.

Program of the 4th Anniversary Commemoration of LCP's Passing in Logbozounkpa
7:00 AM - 8:30 AM: Memorial Mass at the Catholic Church of Logbozounkpa
8:30 AM - 9:00 AM: Fellowship at church exit
9:30 AM - 10:00 AM: Arrival and reception at the family residence in Logbozounkpa
10:00 AM - 10:15 AM: Welcome address by Janvier LISSANON
10:15 AM - 10:30 AM: Musical interlude
10:30 AM - 10:45 AM: Traditional blessing & remembrance by Janvier LISSANON
10:45 AM - 11:15 AM: Projection and commemorative discussion on the life of LCP presented by Hervé assisted by the grandchildren
11:15 AM - 11:45 AM: Refreshment break
11:45 AM - 12:05 PM: Prayers and praise session led by the Charismatic Renewal of Agla Akplome under the direction of Shepherd Hervé LISSANON
12:05 PM - 12:10 PM: Closing remarks by Janvier LISSANON
Media and photo coverage coordinated by Paola and Fridzel`;

const PAUL_LISSANON_EN = {
  biography: PAUL_LISSANON_MEMORIAL_EN,

  accomplishments: `Introduction of innovative pedagogical methods tailored to the Beninese context, significantly enhancing student understanding and achievement in scientific disciplines.

Active leadership in developing the first local school textbooks used in secondary schools and high schools across Benin starting in the 1980s.

Organization and facilitation of numerous professional development workshops for teachers, strengthening instructional competencies and pedagogical modernization.

Founding member of the National Association of Teachers of Benin, advocating for the teaching profession and teacher empowerment.

Supervision and mentorship of multiple cohorts of young teachers at the École Normale of Porto-Novo, directly elevating educational quality nationwide.

Distinguished keynote speaker on the evolution of African educational systems, regularly invited by academic institutions and universities.

Recipient of national honors for exceptional service to education, notably the Medal of Knight of the National Order of Benin in 2010.`,

  education: `Since the 1940s, teacher training and education in Benin have undergone pivotal transformations shaped by specific historical and political contexts, notably tied to the colonial and post-independence periods.

During this era, teacher training primarily took place in normal schools that prepared primary educators. With Benin's independence (formerly Dahomey) in 1960, the country progressively established formalized structures for teacher training in the national educational system. Primary Teacher Training Colleges (ENI) handled training for nursery and primary levels, while Higher Teacher Training Colleges (ENS) trained secondary school teachers.

Between the 1980s and 2000s, the Beninese educational system experienced severe challenges, including an erosion of educational quality and a lack of formal initial training for an entire generation of educators (1987–2010). This represented a major hurdle to teacher professionalization and teaching standards.

Initial teacher training in Benin aims to provide comprehensive academic and professional preparation, awarding specialized diplomas such as the Secondary Teaching Aptitude Certificate (BAPES) and the Secondary Education Teaching Certification (CAPES) for secondary school educators. The training typically spans several years following the Baccalaureate.

Furthermore, continuous professional development plays a vital role in upgrading the skills of practicing teachers to bridge initial training gaps and meet the evolving needs of the Beninese educational system.

In summary, the journey of a Beninese teacher from 1940 to graduation is characterized by:
- Initial training in normal schools (ENI for primary and ENS for secondary).
- A challenging period from 1987 to 2010 where many teachers were not officially trained.
- Awarding of professional teaching credentials such as BAPES or CAPES.
- Growing importance of continuing professional development for teacher upskilling.

This trajectory reflects continuous efforts to professionalize Beninese educators despite socioeconomic and institutional challenges.`
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

  const titleRaw = (event.title || '').trim();
  const descRaw = (event.description || '').trim();

  // Check if this event is the memorial / anniversary of Paul LISSANON
  const isPaulMemorial =
    titleRaw.toUpperCase().includes("AN IV") ||
    titleRaw.toUpperCase().includes("LISSANON COMLAN PAUL") ||
    titleRaw.toUpperCase().includes("LCP") ||
    descRaw.includes("Alamandoganha") ||
    descRaw.includes("BREF HISTORIQUE SUR LA VIE DE LCP");

  let title = translateDbText(event.title, lang);
  let description = translateDbText(event.description, lang);

  if (isPaulMemorial) {
    title = "Celebration of the 4th Anniversary of the Passing of Paul Comlan LISSANON (LCP)";
    description = PAUL_LISSANON_MEMORIAL_EN;
  }

  return {
    ...event,
    title,
    description,
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

    // Education event pattern
    if (event.type === 'education' || d.includes("Depuis les années 1940") || d.includes("formation et l'éducation des enseignants")) {
      description = PAUL_LISSANON_EN.education;
    } else {
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
