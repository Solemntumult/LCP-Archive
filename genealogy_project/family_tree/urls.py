from django.urls import path
from . import views

urlpatterns = [
    # Arbre généalogique hiérarchique
    path('', views.FamilyTreeView.as_view(), name='tree'),

    # Arbre généalogique en graphe visuel
    path('graph/', views.TreeGraphView.as_view(), name='tree_graph'),

    # Détails d'une personne
    path('person/<int:pk>/', views.PersonDetailView.as_view(), name='person_detail'),

    # Créer/Modifier/Supprimer une personne
    path('person/add/', views.PersonCreateView.as_view(), name='person_add'),
    path('person/<int:pk>/edit/', views.PersonUpdateView.as_view(), name='person_edit'),
    path('person/<int:pk>/delete/', views.PersonDeleteView.as_view(), name='person_delete'),

    # API endpoints
    path('api/tree-data/', views.get_tree_data, name='tree_data'),
    path('api/search/', views.search_person, name='search_person'),
]