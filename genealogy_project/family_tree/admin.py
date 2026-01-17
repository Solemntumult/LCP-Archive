from django.contrib import admin
from .models import Person, Marriage


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'gender', 'birth_date', 'death_date', 'is_alive_display', 'is_blood_family_display',
                    'spouse_of', 'father', 'mother']
    list_filter = ['gender', 'birth_date', 'spouse_of']
    search_fields = ['first_name', 'last_name', 'maiden_name']
    date_hierarchy = 'birth_date'

    fieldsets = (
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'maiden_name', 'gender', 'photo')
        }),
        ('Dates et lieux', {
            'fields': ('birth_date', 'birth_place', 'death_date', 'death_place')
        }),
        ('Famille', {
            'fields': ('father', 'mother', 'spouse_of'),
            'description': 'Remplir "father" et "mother" pour la famille de sang OU "spouse_of" pour les conjoints externes'
        }),
        ('Biographie', {
            'fields': ('biography', 'accomplishments', 'profession', 'education'),
            'classes': ('collapse',)
        }),
    )

    @admin.display(boolean=True, description='Vivant')
    def is_alive_display(self, obj):
        return obj.is_alive

    @admin.display(boolean=True, description='Famille de sang')
    def is_blood_family_display(self, obj):
        return obj.is_blood_family


@admin.register(Marriage)
class MarriageAdmin(admin.ModelAdmin):
    list_display = ['spouse1', 'spouse2', 'marriage_date', 'marriage_place']
    search_fields = ['spouse1__first_name', 'spouse1__last_name', 'spouse2__first_name', 'spouse2__last_name']
    date_hierarchy = 'marriage_date'