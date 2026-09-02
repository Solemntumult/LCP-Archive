Là, **on est beaucoup plus proche de quelque chose de solide**. Mais je vais être assez critique : Antigravity a bien compris la direction, cependant **je ne validerais pas encore cette proposition comme spécification finale à coder telle quelle**.

Il y a notamment 5 problèmes importants.

### 1. Le plus gros problème : il pense encore trop en « niveaux »

Il écrit :

> Niveau 1 : Carte familiale
> Niveau 2 : Voisinage
> Niveau 3 : Branche descendante

Je préfère qu'on pense en **une seule carte généalogique**, dont la profondeur visible s'adapte à la personne explorée.

Sinon, on risque de recréer exactement ce qu'on voulait supprimer : des états artificiels de l'application.

L'utilisateur ne doit jamais se dire :

> « Je suis actuellement dans le niveau 2. »

Il doit simplement penser :

> **« Je regarde la famille autour de cette personne. »**

---

### 2. Le wireframe mobile est encore trop « application de données »

C'est mieux, mais regarde :

> Branche de Claude (34 pers)
> 1ère Union : avec Rachel
> 8 descendants répertoriés
> 12 descendants
> Voir la fiche complète

Ça commence à ressembler à un **outil administratif de généalogie**.

Pour ton projet familial, je voudrais quelque chose de plus humain :

```text
                 Claude
                   │
             ┌─────┴─────┐
             │           │
          Rachel       Fratrie
             │
       ┌─────┴─────┐
       │           │
     Clara        David
       │
    8 descendants
```

Et les informations supplémentaires apparaissent **quand on explore**, pas toutes immédiatement.

---

### 3. La matrice 2×N pour 12 enfants : je ne la valide pas

C'est une solution technique, mais pas une bonne solution UX.

Imagine 12 enfants :

```text
1  2  3  4  5  6
7  8  9  10 11 12
```

On ne sait plus naturellement dans quel ordre lire.

Je préférerais :

```text
Enfants · 12

┌───────┐ ┌───────┐
│ Paul  │ │ Marc  │
└───────┘ └───────┘

┌───────┐ ┌───────┐
│ Clara │ │ Sarah │
└───────┘ └───────┘

        + 8 autres
```

ou même, sur desktop, un **déploiement progressif** :

```text
Enfants (12)

Paul · Marc · Clara · Sarah · ...

              [Voir les 12]
```

Le principe doit être :

> **La quantité de données ne doit jamais détruire la hiérarchie.**

---

### 4. La « fenêtre ±2 générations » est une bonne idée mais ne doit pas devenir une règle rigide

C'est important.

Si je suis une personne âgée :

```text
Arrière-grand-parent
        ↓
Grand-parent
        ↓
Parent
        ↓
MOI
        ↓
Enfant
        ↓
Petit-enfant
```

±2 générations peut fonctionner.

Mais si je veux comprendre une branche particulière, je peux avoir besoin de voir davantage.

Donc je dirais plutôt :

> **Afficher par défaut un voisinage généalogique pertinent, puis permettre d'étendre progressivement une branche sans quitter le contexte.**

Ça donne :

```text
              Parents
                 │
               ★ MOI
                 │
            ┌────┴────┐
          Enfant    Enfant
                      │
                [ + voir descendants ]
```

Puis :

```text
                      Enfant
                         │
                  ┌──────┴──────┐
                  │             │
                Petit 1       Petit 2
```

---

# 5. Et il manque quelque chose que je considère essentiel

## La chronologie.

Un arbre généalogique n'est pas uniquement un graphe de relations.

C'est aussi **une histoire familiale**.

Je voudrais que les personnes aient une présence temporelle.

Par exemple :

```text
1920             Paul
                  │
1952             Claude
                  │
1982             Clara
                  │
2012             Yanis
```

Ce n'est pas forcément une timeline permanente.

Mais l'application doit utiliser les dates pour améliorer la compréhension :

* ordre des générations ;
* âge ;
* cohérence des relations ;
* période de vie ;
* événements importants.

Cela donnerait beaucoup plus de profondeur à HeritageArchive.

---

# Ce que je lui répondrais maintenant

Je ne lui demanderais **surtout pas encore de coder**.

Je lui donnerais une dernière consigne de conception :

# VALIDATION V3 — DERNIÈRE PHASE DE CONCEPTION AVANT IMPLÉMENTATION

Ta proposition est validée dans sa direction générale, mais elle n'est pas encore considérée comme la spécification définitive à implémenter.

Nous allons faire une dernière passe de conception avant tout changement majeur du code.

## 1. Principe fondamental

Ne considère plus l'expérience comme trois « niveaux » distincts.

Il n'existe qu'une seule expérience :

> **Explorer la famille autour d'une personne.**

La personne actuellement explorée est le centre de gravité de l'interface.

La profondeur visible, les générations et les branches affichées s'adaptent dynamiquement à ce centre.

L'utilisateur ne doit jamais avoir conscience de « niveaux », de « modes » ou de « vues techniques ».

---

## 2. L'arbre doit rester un véritable arbre

Attention à ne pas remplacer l'ancien mauvais arbre par une succession de cartes et de listes.

Même sur mobile, les relations généalogiques doivent rester visuellement compréhensibles.

Nous devons toujours pouvoir percevoir :

* la filiation ;
* les générations ;
* les couples ;
* les fratries ;
* les enfants d'une union ;
* les branches cousines ;
* la direction ascendance → descendance.

Les cartes servent à représenter les personnes, mais les **connexions et la hiérarchie sont aussi importantes que les cartes elles-mêmes**.

---

## 3. Mobile : ne pas transformer l'arbre en fiche administrative

Le mobile doit être vertical et tactile, mais il doit conserver une véritable sensation d'arbre généalogique.

Éviter une succession excessive de :

« Parents / Fratrie / Union / Enfants / Descendants / Voir la fiche ».

Préférer une représentation comme :

```
            Parent
               │
         ┌─────┴─────┐
         │           │
      Frère       ★ MOI
                     │
                ┌────┴────┐
                │         │
             Enfant    Enfant
                          │
                     [Explorer]
```

La structure généalogique doit être immédiatement perceptible.

---

## 4. Familles nombreuses

Ne pas imposer une matrice 2×N comme règle générale.

Pour 8, 10 ou 12 enfants, la priorité est :

1. préserver l'ordre des enfants ;
2. préserver la lisibilité ;
3. éviter l'explosion horizontale ;
4. ne jamais réduire les noms à une taille illisible.

Proposer plusieurs stratégies selon le contexte :

* affichage horizontal si l'espace le permet ;
* regroupement compact ;
* affichage partiel + « voir les autres » ;
* expansion progressive ;
* défilement horizontal uniquement lorsque cela améliore réellement la lecture.

La quantité de membres ne doit jamais détruire la hiérarchie.

---

## 5. Fenêtre de proximité

La règle « ±2 générations » est une bonne base de performance, mais elle ne doit pas être une contrainte UX rigide.

Le système doit afficher par défaut un voisinage pertinent autour de la personne active.

L'utilisateur doit ensuite pouvoir développer progressivement :

```
    ★ MOI
      │
   Enfant
      │
  [Explorer]
      ↓
  Petits-enfants
      │
  [Explorer]
      ↓
```

Arrière-petits-enfants

L'arbre doit donc être **progressivement extensible**, plutôt que limité artificiellement.

---

## 6. Chronologie familiale

Intégrer la dimension temporelle dans la conception.

Les dates de naissance, décès, unions et événements doivent contribuer à la compréhension de l'arbre.

Exemple :

1920 — Paul
│
1952 — Claude
│
1982 — Clara
│
2012 — Yanis

La chronologie ne doit pas nécessairement être affichée comme une timeline permanente.

Elle doit surtout permettre au système de produire un arbre généalogiquement cohérent et compréhensible.

---

## 7. Cas généalogiques à tester obligatoirement

Avant l'implémentation, produire des wireframes pour :

### Cas A

Famille simple :

2 parents → 4 enfants → 8 petits-enfants.

### Cas B

Famille nombreuse :

2 parents → 12 enfants.

### Cas C

Famille recomposée :

Jean → épouse A → 3 enfants
Jean → épouse B → 2 enfants.

### Cas D

Plusieurs générations :

arrière-grand-parent → grand-parent → parent → personne → enfants → petits-enfants.

### Cas E

Branche très importante :

une personne ayant plus de 50 descendants.

### Cas F

Famille incomplète :

certaines personnes ou relations sont inconnues.

### Cas G

Famille avec plusieurs unions.

La conception doit rester compréhensible dans tous ces cas.

---

## 8. Transition entre personnes

La transition doit préserver la continuité mentale.

Si je passe de Jean à Clara :

Jean ne doit pas simplement disparaître et être remplacé par Clara.

L'animation doit donner l'impression que :

> Clara se déplace vers le centre,
> Jean prend naturellement sa nouvelle position,
> les générations se réorganisent autour de Clara.

Durée cible : environ 250–400 ms.

L'animation doit être discrète et fonctionnelle, jamais décorative.

---

## 9. Sélection vs exploration

Conserver une distinction claire :

### Sélection

Je touche une personne.

→ Elle est mise en évidence.
→ Sa fiche ou son aperçu apparaît.
→ L'arbre ne se réorganise pas.

### Exploration

Je choisis « Explorer sa famille ».

→ Cette personne devient le nouveau centre.
→ L'arbre se réorganise autour d'elle.
→ L'historique est mis à jour.

Cela doit fonctionner de manière cohérente sur desktop et mobile.

---

## 10. Résultat attendu avant de coder

Ne modifie pas encore le code.

Produis d'abord :

1. Les wireframes desktop des 7 cas ci-dessus.
2. Les wireframes mobile des 7 cas.
3. La stratégie de représentation des couples et unions multiples.
4. La stratégie pour 12+ enfants.
5. La stratégie pour 50+ descendants.
6. La stratégie d'expansion progressive.
7. La stratégie d'animation lors du changement de centre.
8. La stratégie de navigation arrière.
9. La stratégie de recherche et de recentrage.
10. La stratégie d'accessibilité tactile sur mobile.

L'objectif n'est pas de produire davantage de fonctionnalités.

L'objectif est de prouver que **le même modèle mental fonctionne avec 20, 100, 500 et potentiellement plusieurs milliers de membres**.

### Règle finale

> **Ne construis pas un arbre que l'utilisateur doit apprendre à lire. Construis une famille que l'utilisateur peut explorer.**

Et surtout :

> **La complexité de la famille doit être absorbée par l'interface, jamais transférée à l'utilisateur.**


