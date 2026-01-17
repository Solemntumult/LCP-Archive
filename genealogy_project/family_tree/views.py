from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.http import JsonResponse
from django.db import models
from .models import Person, Marriage
from .forms import PersonForm, MarriageForm


class FamilyTreeView(ListView):
    model = Person
    template_name = 'family_tree/tree.html'
    context_object_name = 'people'

    def get_queryset(self):
        # Récupérer tous les membres de la famille
        return Person.objects.all().select_related('father', 'mother')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Trouver la génération racine (grands-parents sans parents ET qui sont de la famille de sang)
        root_people = Person.objects.filter(
            father__isnull=True,
            mother__isnull=True,
            spouse_of__isnull=True  # Seulement la famille de sang
        ).order_by('birth_date')
        context['root_people'] = root_people
        return context


class PersonDetailView(DetailView):
    model = Person
    template_name = 'family_tree/person_detail.html'
    context_object_name = 'person'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        person = self.object
        context['children'] = person.get_children()
        context['children_by_spouse'] = person.get_children_by_spouse()
        context['siblings'] = person.get_siblings()
        context['spouses'] = person.get_spouses()
        return context


class PersonCreateView(CreateView):
    model = Person
    form_class = PersonForm
    template_name = 'family_tree/person_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['action'] = 'Ajouter'
        return context

    def get_initial(self):
        initial = super().get_initial()
        # Si un parent_id est fourni, pré-remplir le parent
        parent_id = self.request.GET.get('parent_id')
        parent_gender = self.request.GET.get('parent_gender')
        if parent_id and parent_gender:
            if parent_gender == 'M':
                initial['father'] = parent_id
            else:
                initial['mother'] = parent_id
        return initial


class PersonUpdateView(UpdateView):
    model = Person
    form_class = PersonForm
    template_name = 'family_tree/person_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['action'] = 'Modifier'
        return context


class PersonDeleteView(DeleteView):
    model = Person
    success_url = reverse_lazy('tree')
    template_name = 'family_tree/person_confirm_delete.html'


def get_tree_data(request):
    """API endpoint pour récupérer les données de l'arbre en JSON"""
    # Récupérer TOUTES les personnes
    people = Person.objects.all()
    data = []

    for person in people:
        # Vérifier si c'est un membre de la famille de sang
        is_blood = (person.father_id is not None or person.mother_id is not None or
                    (person.father_id is None and person.mother_id is None and
                     Person.objects.filter(models.Q(father=person) | models.Q(mother=person)).exists()))

        # Récupérer les enfants groupés par conjoint
        children_by_spouse = []
        try:
            for group in person.get_children_by_spouse():
                spouse_data = None
                if group['spouse']:
                    spouse_data = {
                        'id': group['spouse'].id,
                        'name': group['spouse'].full_name,
                        'photo_url': group['spouse'].photo_url if group['spouse'].photo else None,
                        'gender': group['spouse'].gender,
                    }

                # Inclure TOUS les enfants
                children_data = []
                for child in group['children']:
                    children_data.append({
                        'id': child.id,
                        'name': child.full_name,
                        'gender': child.gender,
                        'birth_date': child.birth_date.isoformat() if child.birth_date else None,
                        'death_date': child.death_date.isoformat() if child.death_date else None,
                        'photo_url': child.photo.url if child.photo else None,
                    })

                if children_data:
                    children_by_spouse.append({
                        'spouse': spouse_data,
                        'children': children_data
                    })
        except Exception as e:
            print(f"Erreur pour {person.full_name}: {e}")
            continue

        person_data = {
            'id': person.id,
            'name': person.full_name,
            'gender': person.gender,
            'birth_date': person.birth_date.isoformat() if person.birth_date else None,
            'death_date': person.death_date.isoformat() if person.death_date else None,
            'father_id': person.father.id if person.father else None,
            'mother_id': person.mother.id if person.mother else None,
            'photo_url': person.photo.url if person.photo else None,
            'children_by_spouse': children_by_spouse,
            'is_blood': is_blood,
        }

        data.append(person_data)

    return JsonResponse(data, safe=False)


def search_person(request):
    """Recherche de personnes - inclut TOUT LE MONDE"""
    query = request.GET.get('q', '')
    if query:
        # Rechercher dans TOUTES les personnes (famille de sang ET conjoints)
        people = Person.objects.filter(
            first_name__icontains=query
        ) | Person.objects.filter(
            last_name__icontains=query
        ) | Person.objects.filter(
            maiden_name__icontains=query
        )
    else:
        people = Person.objects.all()

    results = [{
        'id': p.id,
        'name': p.full_name,
        'birth_year': p.birth_date.year if p.birth_date else None,
        'is_spouse': p.spouse_of is not None
    } for p in people[:20]]  # Limiter à 20 résultats

    return JsonResponse(results, safe=False)


class TreeGraphView(ListView):
    """Vue pour l'arbre généalogique en graphe visuel"""
    model = Person
    template_name = 'family_tree/tree_graph.html'
    context_object_name = 'people'

    def get_queryset(self):
        return Person.objects.all().select_related('father', 'mother')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Trouver les racines
        root_people = Person.objects.filter(
            father__isnull=True,
            mother__isnull=True
        ).order_by('birth_date')
        context['root_people'] = root_people
        return context