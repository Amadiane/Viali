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


from django.contrib import admin
from .models import SardineRecipe

@admin.register(SardineRecipe)
class SardineRecipeAdmin(admin.ModelAdmin):
    list_display = ("display_title", "is_active", "updated_by", "created_at", "updated_at", "image_preview")
    list_filter = ("is_active", "created_at")
    search_fields = ("title_fr", "title_en")
    readonly_fields = ("created_at", "updated_at", "image_preview")

    def image_preview(self, obj):
        if obj.image:
            return f"<img src='{obj.image.url}' width='80' style='border-radius:8px' />"
        return "No image"
    image_preview.allow_tags = True
    image_preview.short_description = "Preview"

    def save_model(self, request, obj, form, change):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)

