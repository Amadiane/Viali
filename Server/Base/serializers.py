from rest_framework import serializers
from .models import Partner

class PartnerSerializer(serializers.ModelSerializer):
    # Ce champ calculé permet de renvoyer l'URL complète de l'image Cloudinary
    cover_image_url = serializers.SerializerMethodField()

    # Affiche le nom selon la langue active
    display_name = serializers.CharField(source='display_name', read_only=True)

    class Meta:
        model = Partner  # On dit quel modèle ce serializer représente
        fields = [
            'id',  # id de l'objet
            'name_fr',  # nom français
            'name_en',  # nom anglais
            'display_name', # nom choisi selon la langue
            'website_url',  # site du partenaire
            'cover_image',  # champ Cloudinary brut
            'cover_image_url',  # URL calculée pour frontend
            'is_active',  # statut actif ou non
            'created_at',  # date de création
            'updated_at',  # date de modification
        ]

    def get_cover_image_url(self, obj):
        """
        Retourne l'URL complète de l'image pour le frontend.
        Si l'image n'existe pas, renvoie None.
        """
        if obj.cover_image:
            return obj.cover_image.url
        return None
