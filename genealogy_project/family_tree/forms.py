from django import forms
from .models import Person, Marriage


class PersonForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = [
            'first_name', 'last_name', 'maiden_name', 'gender',
            'birth_date', 'birth_place', 'death_date', 'death_place',
            'father', 'mother', 'spouse_of', 'biography', 'accomplishments',
            'profession', 'education', 'photo'
        ]
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Prénom'}),
            'last_name': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Nom de famille'}),
            'maiden_name': forms.TextInput(
                attrs={'class': 'form-input', 'placeholder': 'Nom de jeune fille (optionnel)'}),
            'gender': forms.Select(attrs={'class': 'form-select'}),
            'birth_date': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
            'birth_place': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Lieu de naissance'}),
            'death_date': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
            'death_place': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Lieu de décès'}),
            'father': forms.Select(attrs={'class': 'form-select'}),
            'mother': forms.Select(attrs={'class': 'form-select'}),
            'spouse_of': forms.Select(attrs={'class': 'form-select'}),
            'biography': forms.Textarea(
                attrs={'class': 'form-textarea', 'rows': 5, 'placeholder': 'Racontez l\'histoire de vie...'}),
            'accomplishments': forms.Textarea(
                attrs={'class': 'form-textarea', 'rows': 4, 'placeholder': 'Accomplissements et réalisations...'}),
            'profession': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Profession'}),
            'education': forms.Textarea(
                attrs={'class': 'form-textarea', 'rows': 3, 'placeholder': 'Formation et éducation...'}),
            'photo': forms.FileInput(attrs={'class': 'form-file'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filtrer les choix de père (seulement les hommes)
        self.fields['father'].queryset = Person.objects.filter(gender='M')
        # Filtrer les choix de mère (seulement les femmes)
        self.fields['mother'].queryset = Person.objects.filter(gender='F')
        # Pour spouse_of, afficher tous les membres de la famille de sang
        self.fields['spouse_of'].queryset = Person.objects.filter(spouse_of__isnull=True)


class MarriageForm(forms.ModelForm):
    class Meta:
        model = Marriage
        fields = ['spouse1', 'spouse2', 'marriage_date', 'marriage_place', 'divorce_date', 'notes']
        widgets = {
            'spouse1': forms.Select(attrs={'class': 'form-select'}),
            'spouse2': forms.Select(attrs={'class': 'form-select'}),
            'marriage_date': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
            'marriage_place': forms.TextInput(attrs={'class': 'form-input'}),
            'divorce_date': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
            'notes': forms.Textarea(attrs={'class': 'form-textarea', 'rows': 3}),
        }