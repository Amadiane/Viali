from django.contrib import admin
from .models import Partner

@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('id', 'display_name', 'website_url', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')  # filtres sur le côté droit
    search_fields = ('name_fr', 'name_en')  # recherche rapide
    readonly_fields = ('created_at', 'updated_at')  # champs non éditables
    ordering = ('-created_at',)  # tri par défaut

    fieldsets = (
        (None, {
            'fields': ('name_fr', 'name_en', 'is_active', 'website_url', 'cover_image')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )


# from django.contrib import admin
# from .models import News
# # , Mission, Value, EquipeMember, ProfessionalArea

# admin.site.register(News)
# # admin.site.register(Mission)
# # admin.site.register(Value)
# # admin.site.register(EquipeMember)
# # admin.site.register(ProfessionalArea)
