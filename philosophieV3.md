
# Philosophie V3 — L’arbre comme une exploration de la famille

Le principe fondamental serait :

> **On ne demande jamais à l'utilisateur de "lire" un immense arbre. On lui permet d'explorer sa famille naturellement.**

L'arbre doit donner l'impression d'être **un espace vivant dans lequel on se déplace**, pas un diagramme qu'on essaie de faire tenir sur l'écran.

---

# 1. La structure générale

Je voudrais seulement **3 niveaux d'expérience**.

### Niveau 1 — La carte familiale

C'est la vue d'ensemble.

Elle répond à :

> **« Comment ma famille est-elle organisée ? »**

On ne cherche pas à afficher les 300 personnes avec leurs détails.

On montre les **grandes lignées**.

Par exemple :

```text
                         ┌──────────────┐
                         │  FAMILLE     │
                         │  PRINCIPALE   │
                         └──────┬───────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
        Lignée A            Lignée B            Lignée C
        34 membres          86 membres          21 membres
             │                  │                  │
          [Explorer]         [Explorer]         [Explorer]
```

Cette vue doit être extrêmement calme.

Elle permet de comprendre **la géographie de la famille**.

---

# 2. Niveau 2 — Le voisinage d'une personne

C'est pour moi **le cœur de l'application**.

Tu recherches :

> Jean LISSANON

L'application centre Jean.

Et au lieu de montrer 150 personnes autour de lui, elle montre son **voisinage familial immédiat**.

```text
                    GRAND-PARENTS
                         │
                         │
                     PARENTS
                         │
                         │
              ┌────── JEAN ──────┐
              │                   │
           CONJOINT             FRATRIE
              │
              │
           ENFANTS
              │
        ┌─────┴─────┐
        │           │
     PETIT 1     PETIT 2
```

L'utilisateur comprend immédiatement :

**qui est Jean et comment il est connecté à sa famille.**

---

# 3. Niveau 3 — Explorer une branche

Jean a 5 enfants.

L'utilisateur touche :

> **Enfants**

L'arbre se développe.

```text
                       JEAN
                         │
          ┌──────────────┼──────────────┐
          │              │              │
        Paul           Marie          Joseph
          │              │
       ┌──┴──┐        ┌──┴──┐
       │     │        │     │
      ...   ...      ...   ...
```

Puis il peut entrer dans **la famille de Paul**.

L'application ne lui montre pas toute la famille.

Elle **déplace le centre d'attention**.

---

# 4. L'idée fondamentale : le centre de l'arbre

Il y a toujours une personne ou une branche qui constitue le **centre de l'attention**.

Par exemple :

```text
                  ○ Grand-père

                       │

                ┌──────┴──────┐
                │             │
             ○ Parent       ○ Oncle

                │

              ★ JEAN ★

                │

          ┌─────┴─────┐
          │           │
        ○ Paul       ○ Marie
```

Le `★` représente la personne actuellement explorée.

Lorsque tu sélectionnes Marie :

```text
                 ○ Parents

                     │

              ★ MARIE ★

                /       \
             ○ Paul     ○ Jean
                         │
                    ┌────┴────┐
                    ○         ○
```

**L'arbre se réorganise autour de Marie.**

C'est ça que je veux comme expérience.

---

# 5. Pas de "mode 1 / mode 2 / mode 3 / mode 4"

Je supprimerais complètement cette logique.

Pas :

> Vue Foyer
> Vue Grandes Branches
> Vue Graphe
> Vue Déroulante

L'utilisateur ne devrait même pas avoir besoin de savoir comment l'arbre est techniquement construit.

Il doit simplement avoir :

```text
                    🔍 Rechercher

                         Jean
                          │
              ┌───────────┼───────────┐
              │           │           │
           Parents      Fratrie     Enfants
```

Puis il **explore**.

---

# 6. Desktop

Sur ordinateur, on peut profiter de l'espace.

Je verrais :

```text
┌────────────────────────────────────────────────────────────┐
│ HeritageArchive                    🔍 Rechercher           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                                                            │
│                    GRAND-PARENTS                           │
│                         │                                  │
│                         │                                  │
│                  ┌──────┴──────┐                           │
│                  │             │                           │
│                PARENT        ONCLE                         │
│                  │                                         │
│                  │                                         │
│              ┌───★ JEAN ★───┐                             │
│              │              │                              │
│           CONJOINT       FRATRIE                           │
│              │                                             │
│              │                                             │
│          ┌───┴────┐                                        │
│          │        │                                        │
│        ENFANT   ENFANT                                     │
│                                                            │
│                                     ┌────────────────────┐ │
│                                     │ Jean Lissanon      │ │
│                                     │ 1952–2021          │ │
│                                     │                    │ │
│                                     │ [Profil]           │ │
│                                     └────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

Le panneau de personne apparaît **seulement lorsqu'on sélectionne quelqu'un**.

Il ne doit pas prendre toute la place.

---

# 7. Mobile

C'est ici que je changerais vraiment d'approche.

**Pas de gigantesque arbre miniature.**

Pas :

```text
[      immense canvas      ]
[  pinch zoom everywhere   ]
```

Ça fonctionne techniquement, mais l'expérience est mauvaise.

Sur mobile :

### Écran initial

```text
┌───────────────────────────┐
│ HeritageArchive      🔍   │
│                           │
│ Ma famille                │
│                           │
│        ◉                  │
│     Jean                  │
│                           │
│    ─── Parents ───        │
│                           │
│   ◉              ◉        │
│ Père           Mère       │
│                           │
│    ─── Enfants ───        │
│                           │
│   ◉       ◉       ◉       │
│ Paul    Marie    Joseph   │
│                           │
│                           │
│   [Explorer la branche]   │
└───────────────────────────┘
```

On peut faire défiler **verticalement**.

---

# 8. Le mobile doit devenir relationnel

Sur mobile, au lieu d'essayer d'afficher :

```text
             A
          /     \
        B         C
      /  \      /  \
     D    E    F    G
   / | \
  ...
```

on peut faire :

```text
JEAN LISSANON

1952 — 2021

──────────────

Parents

Père
Mère

──────────────

Fratrie

[Paul] [Marie] [Joseph]

──────────────

Conjoint

[Anne]

──────────────

Enfants

[Marc]
[Sarah]
[David]

──────────────

[Explorer les descendants]
```

C'est **beaucoup plus naturel sur un téléphone**.

---

# 9. Mais l'arbre visuel ne disparaît pas

C'est important.

Je ne veux pas transformer l'application en simple liste.

L'arbre visuel reste présent.

Mais il devient une **vue de navigation**, pas une obligation.

Sur mobile, on pourrait avoir un bouton :

```text
Arbre
```

qui ouvre une vue graphique centrée sur la personne.

Et surtout :

**l'arbre est déjà centré.**

Pas besoin de chercher pendant 20 secondes où se trouve Jean dans un canvas gigantesque.

---

# 10. La fiche personne

Lorsqu'on clique sur une personne :

```text
┌───────────────────────────┐
│                     ×     │
│                           │
│          PHOTO            │
│                           │
│      JEAN LISSANON        │
│       1952 — 2021         │
│                           │
│      Ingénieur            │
│                           │
│ ───────────────────────── │
│                           │
│ Sa famille                │
│                           │
│ Parents       2           │
│ Fratrie       4           │
│ Conjoint      1           │
│ Enfants       3           │
│                           │
│ ───────────────────────── │
│                           │
│ "Biographie..."           │
│                           │
│ [Voir dans l'arbre]       │
│ [Voir ses descendants]    │
└───────────────────────────┘
```

Sur mobile, cela peut être une **bottom sheet**.

Sur desktop, un panneau latéral.

Même concept, comportement adapté au support.

---

# 11. La navigation doit être extrêmement simple

À n'importe quel moment, l'utilisateur doit pouvoir faire :

### ← Retour

Revenir à la personne précédente.

### ⌂ Famille

Revenir à la vue générale.

### 🔍 Recherche

Chercher quelqu'un.

### ⊙ Centrer

Recentrer sur la personne actuelle.

C'est tout.

---

# 12. L'arbre doit raconter les générations

Je veux aussi une hiérarchie visuelle claire.

Par exemple :

```text
                 GÉNÉRATION 1

                      ●

                      │

                 GÉNÉRATION 2

             ●────────┴────────●

                      │

                 GÉNÉRATION 3

          ●───────────┼───────────●

                      │

                 GÉNÉRATION 4
```

Mais **les labels "Génération 1, 2..." ne sont pas obligatoires partout**.

La structure doit simplement être évidente.

---

# 13. Les couples doivent être traités comme des unités

Au lieu de :

```text
Jean

Anne

Jean
Anne
```

je préfère :

```text
      ● Jean ─── ● Anne
             │
       ┌─────┴─────┐
       │           │
      Paul        Marie
```

Le couple est visuellement identifiable.

Mais si Jean a plusieurs unions :

```text
      ● Jean
       /    \
      /      \
   ● Anne   ● Marie
      │        │
   enfants   enfants
```

Il faut éviter de dupliquer Jean artificiellement.

---

# 14. Les branches ne doivent pas être "des cartes"

Une grosse erreur actuelle est de traiter une branche comme une grosse carte UI.

Une branche doit plutôt être **une zone de l'arbre**.

Exemple :

```text
                    ANCÊTRE
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        │              │              │
     LIGNÉE A       LIGNÉE B       LIGNÉE C
        │              │              │
       ...            ...            ...
```

Puis :

> **Explorer la lignée B**

L'utilisateur entre réellement dans cette partie de l'arbre.

---

# 15. L'arbre doit être "calme"

C'est une notion importante pour le design.

Je ne veux pas :

* 15 couleurs ;
* 40 boutons ;
* des badges partout ;
* des emojis ;
* des icônes décoratives ;
* des cartes avec énormément d'informations ;
* des animations permanentes.

Je veux :

**beaucoup d'espace + quelques informations très importantes.**

L'arbre doit presque avoir l'impression d'être une **œuvre éditoriale interactive**.

---

# 16. Et surtout : l'arbre doit accepter l'incomplétude

Ta famille n'est actuellement qu'à environ 25 % documentée.

L'application ne doit pas donner l'impression que l'arbre est "cassé" parce qu'il manque des personnes.

Au contraire :

```text
                 Jean
                   │
           ┌───────┴───────┐
           │               │
         Paul            Marie
                           │
                      + 3 personnes
                      à documenter
```

Et lorsqu'une branche est incomplète :

> **Cette branche est encore en construction.**

Cela donne une sensation de **projet familial vivant**.

---

# 17. L'expérience idéale

Imagine que ta grand-mère ouvre l'application.

Elle ne doit pas se demander :

> "Comment je lis ce truc ?"

Elle doit pouvoir :

**1. Chercher une personne**

↓

**2. Toucher son nom**

↓

**3. Voir immédiatement ses parents, conjoint, enfants et frères/sœurs**

↓

**4. Toucher un enfant**

↓

**5. Entrer dans cette nouvelle branche**

↓

**6. Revenir en arrière**

C'est tout.

Si on réussit ça, **l'arbre devient intuitif sans avoir besoin d'un tutoriel**.

---

# 18. La phrase qui doit guider Antigravity

Je donnerais cette phrase à l'agent :

> **« Ne construis pas un arbre que l'utilisateur doit apprendre à lire. Construis une famille que l'utilisateur peut explorer. »**

Et une deuxième :

> **« Desktop et mobile ne doivent pas afficher la même chose : ils doivent offrir la même compréhension avec des interactions adaptées à leur écran. »**
