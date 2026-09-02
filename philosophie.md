## Philosophie de l’arbre généalogique

L’arbre ne doit pas être pensé comme **un grand dessin contenant tous les membres de la famille**. Plus la famille grandit, plus cette approche devient illisible.

Il doit être pensé comme **une carte interactive de la mémoire familiale**.

### 1. L’arbre montre la structure, pas tout le détail

L’objectif premier est que l’utilisateur comprenne immédiatement :

* d’où vient une personne ;
* quelle est sa descendance ;
* à quelle branche elle appartient ;
* comment les différentes branches de la famille sont reliées.

L’arbre doit donc privilégier **la compréhension des relations** plutôt que la quantité d'informations affichées.

---

### 2. L’arbre doit s’adapter à la taille de la famille

Avec 20 membres, on peut montrer beaucoup de détails.

Avec 200 membres, il faut simplifier.

Avec 1 000 membres, il faut permettre de naviguer par **branches, générations et personnes**.

Donc l'arbre doit être **progressif** :

> Plus on s'éloigne, plus la représentation est synthétique.
> Plus on se rapproche, plus elle devient détaillée.

L'utilisateur ne doit jamais avoir l'impression de regarder un mur de cartes.

---

### 3. Une personne devient un point d’entrée dans la famille

Chaque personne est une porte vers une partie de l'arbre.

Si je clique sur une personne, l'arbre doit pouvoir répondre naturellement à :

> **« Montre-moi sa famille. »**

On peut alors se concentrer sur :

* ses parents ;
* ses grands-parents ;
* ses frères et sœurs ;
* ses conjoints ;
* ses enfants ;
* ses petits-enfants ;
* sa branche familiale.

L'arbre devient donc **explorable autour d'une personne**, plutôt qu'un dessin statique.

---

### 4. La navigation doit être centrée sur les relations

L'utilisateur ne doit pas avoir besoin de comprendre un algorithme ou de "lire" l'arbre comme un schéma mathématique.

Il doit pouvoir penser simplement :

> « C'est son père. »
> « Ce sont ses enfants. »
> « Cette personne appartient à cette branche. »
> « Je veux voir ses descendants. »

Les relations doivent donc être **visuellement évidentes et cohérentes**.

---

### 5. Les grandes branches doivent pouvoir disparaître temporairement

Une branche qui contient 80 personnes ne doit pas obligatoirement occuper tout l'écran.

Elle peut être représentée comme :

```text
Ancêtre
   │
   ├── Branche A · 24 membres
   │
   ├── Branche B · 86 membres
   │
   └── Branche C · 31 membres
```

Puis l'utilisateur choisit d'explorer la branche qui l'intéresse.

Cela permet à l'arbre de rester utilisable **même lorsque la famille devient immense**.

---

### 6. L'arbre doit donner une sensation de continuité familiale

Le design ne doit pas donner l'impression d'un organigramme d'entreprise.

Il doit évoquer :

> **une histoire qui se transmet de génération en génération.**

L'interface doit donc être :

* élégante ;
* sobre ;
* chaleureuse ;
* patrimoniale ;
* moderne ;
* intemporelle.

Pas enfantine, pas "gadget", pas surchargée.

---

### 7. L'arbre est vivant et évolutif

C'est particulièrement important pour ton projet.

Aujourd'hui, tu n'as qu'une partie de la famille.

Demain, quelqu'un pourra ajouter :

> un frère, une sœur, un enfant, un conjoint, un parent...

L'arbre doit donc être conçu **pour une famille qui continue de grandir**, et non pour l'état actuel de la base.

---

### La philosophie en une phrase

> **L’arbre de HeritageArchive n’est pas un dessin de toute la famille : c’est une carte vivante permettant d’explorer l’histoire, les relations et les différentes branches de la famille, à n’importe quelle échelle.**

Et le principe le plus important serait :

> **« Montrer suffisamment pour comprendre, cacher suffisamment pour ne jamais perdre l'utilisateur. »**
