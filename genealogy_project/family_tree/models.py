from django.db import models
from django.urls import reverse


class Person(models.Model):
    GENDER_CHOICES = [
        ('M', 'Homme'),
        ('F', 'Femme'),
    ]

    # Informations de base
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom de famille")
    maiden_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nom de jeune fille")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name="Genre")

    # Dates importantes
    birth_date = models.DateField(null=True, blank=True, verbose_name="Date de naissance")
    birth_place = models.CharField(max_length=200, blank=True, verbose_name="Lieu de naissance")
    death_date = models.DateField(null=True, blank=True, verbose_name="Date de décès")
    death_place = models.CharField(max_length=200, blank=True, verbose_name="Lieu de décès")

    # Relations familiales
    father = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='children_as_father', verbose_name="Père")
    mother = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='children_as_mother', verbose_name="Mère")

    # Conjoint (pour les personnes qui ont épousé un membre de la famille)
    spouse_of = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='spouse', verbose_name="Conjoint(e) de",
                                  help_text="Si cette personne a épousé un membre de la famille (mais n'est pas de la lignée sanguine)")

    # Informations biographiques
    biography = models.TextField(blank=True, verbose_name="Biographie")
    accomplishments = models.TextField(blank=True, verbose_name="Accomplissements")
    profession = models.CharField(max_length=200, blank=True, verbose_name="Profession")
    education = models.TextField(blank=True, verbose_name="Formation/Éducation")

    # Photo
    photo = models.ImageField(upload_to='photos/', null=True, blank=True, verbose_name="Photo")

    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Personne"
        verbose_name_plural = "Personnes"
        ordering = ['birth_date']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def get_absolute_url(self):
        return reverse('person_detail', kwargs={'pk': self.pk})

    @property
    def full_name(self):
        if self.maiden_name and self.gender == 'F':
            return f"{self.first_name} {self.last_name} (née {self.maiden_name})"
        return f"{self.first_name} {self.last_name}"

    @property
    def is_blood_family(self):
        """Retourne True si la personne fait partie de la lignée sanguine"""
        return self.spouse_of is None

    @property
    def is_alive(self):
        return self.death_date is None

    @property
    def age(self):
        from datetime import date
        if not self.birth_date:
            return None
        end_date = self.death_date if self.death_date else date.today()
        age = end_date.year - self.birth_date.year
        if end_date.month < self.birth_date.month or (
                end_date.month == self.birth_date.month and end_date.day < self.birth_date.day):
            age -= 1
        return age

    def get_children(self):
        """Retourne tous les enfants de cette personne"""
        if self.gender == 'M':
            return Person.objects.filter(father=self)
        else:
            return Person.objects.filter(mother=self)

    def get_siblings(self):
        """Retourne tous les frères et sœurs (même père OU même mère)"""
        siblings = Person.objects.none()
        if self.father:
            siblings |= Person.objects.filter(father=self.father).exclude(pk=self.pk)
        if self.mother:
            siblings |= Person.objects.filter(mother=self.mother).exclude(pk=self.pk)
        return siblings.distinct()

    def get_spouses(self):
        """Retourne tous les conjoints (personnes avec qui cette personne a eu des enfants)"""
        spouses = []
        if self.gender == 'M':
            # Trouver toutes les mères de ses enfants
            spouses = Person.objects.filter(
                children_as_mother__father=self
            ).distinct()
        else:
            # Trouver tous les pères de ses enfants
            spouses = Person.objects.filter(
                children_as_father__mother=self
            ).distinct()
        return spouses

    def get_children_by_spouse(self):
        """Retourne les enfants groupés par conjoint"""
        children_groups = []

        print(f"\n=== get_children_by_spouse pour {self.full_name} (genre: {self.gender}) ===")

        try:
            if self.gender == 'M':
                # Pour un homme, grouper par mère
                mothers = Person.objects.filter(
                    children_as_mother__father=self
                ).distinct()

                print(f"  Nombre de mères trouvées: {mothers.count()}")

                for mother in mothers:
                    children = Person.objects.filter(father=self, mother=mother).order_by('birth_date')
                    print(f"  Avec {mother.full_name}: {children.count()} enfants")
                    if children.exists():
                        children_groups.append({
                            'spouse': mother,
                            'children': list(children)
                        })

                # Enfants sans mère identifiée
                children_no_mother = Person.objects.filter(father=self, mother__isnull=True).order_by('birth_date')
                print(f"  Sans mère: {children_no_mother.count()} enfants")
                if children_no_mother.exists():
                    children_groups.append({
                        'spouse': None,
                        'children': list(children_no_mother)
                    })
            else:
                # Pour une femme, grouper par père
                fathers = Person.objects.filter(
                    children_as_father__mother=self
                ).distinct()

                print(f"  Nombre de pères trouvés: {fathers.count()}")

                for father in fathers:
                    children = Person.objects.filter(mother=self, father=father).order_by('birth_date')
                    print(f"  Avec {father.full_name}: {children.count()} enfants")
                    if children.exists():
                        children_groups.append({
                            'spouse': father,
                            'children': list(children)
                        })

                # Enfants sans père identifié
                children_no_father = Person.objects.filter(mother=self, father__isnull=True).order_by('birth_date')
                print(f"  Sans père: {children_no_father.count()} enfants")
                if children_no_father.exists():
                    children_groups.append({
                        'spouse': None,
                        'children': list(children_no_father)
                    })

            print(f"  TOTAL: {len(children_groups)} groupes d'enfants")

        except Exception as e:
            print(f"  ERREUR: {str(e)}")
            return []

        return children_groups

    def get_generation(self):
        """Calcule la génération (0 = génération de départ, -1 = parents, etc.)"""
        if not self.father and not self.mother:
            return 0
        parent_gen = -1
        if self.father:
            parent_gen = max(parent_gen, self.father.get_generation())
        if self.mother:
            parent_gen = max(parent_gen, self.mother.get_generation())
        return parent_gen + 1


class Marriage(models.Model):
    """Modèle optionnel pour enregistrer les mariages officiels"""
    spouse1 = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='marriages_as_spouse1')
    spouse2 = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='marriages_as_spouse2')
    marriage_date = models.DateField(null=True, blank=True, verbose_name="Date de mariage")
    marriage_place = models.CharField(max_length=200, blank=True, verbose_name="Lieu de mariage")
    divorce_date = models.DateField(null=True, blank=True, verbose_name="Date de divorce")
    notes = models.TextField(blank=True, verbose_name="Notes")

    class Meta:
        verbose_name = "Mariage"
        verbose_name_plural = "Mariages"

    def __str__(self):
        return f"{self.spouse1} & {self.spouse2}"