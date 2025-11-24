from rest_framework import serializers
from .models import Partner

class PartnerSerializer(serializers.ModelSerializer):
    # URL complète de l'image Cloudinary
    cover_image_url = serializers.SerializerMethodField()

    # Nom affiché selon la langue
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = Partner
        fields = [
            'id',
            'name_fr',
            'name_en',
            'display_name',
            'website_url',
            'cover_image',
            'cover_image_url',
            'is_active',
            'created_at',
            'updated_at',
        ]

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None


#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

from rest_framework import serializers
from .models import News
# , Mission, Value, EquipeMember, ProfessionalArea

# ------------------------------
# News Serializer
# ------------------------------
class NewsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    display_title = serializers.CharField(read_only=True)

    class Meta:
        model = News
        fields = "__all__"  # 👈 contient automatiquement is_active

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None


    @property
    def display_title(self):
        lang = self.context.get('request').LANGUAGE_CODE if self.context.get('request') else 'en'
        return self.title_fr if lang.startswith('fr') else self.title_en or self.title_fr

# ------------------------------
# Mission Serializer
# ------------------------------
# class MissionSerializer(serializers.ModelSerializer):
#     image_url = serializers.SerializerMethodField()
#     display_title = serializers.CharField(read_only=True)

#     class Meta:
#         model = Mission
#         fields = "__all__"

#     def get_image_url(self, obj):
#         if obj.image:
#             return obj.image.url
#         return None

# # ------------------------------
# # Value Serializer
# # ------------------------------
# class ValueSerializer(serializers.ModelSerializer):
#     image_url = serializers.SerializerMethodField()
#     display_title = serializers.CharField(read_only=True)

#     class Meta:
#         model = Value
#         fields = "__all__"

#     def get_image_url(self, obj):
#         if obj.image:
#             return obj.image.url
#         return None

# # ------------------------------
# # EquipeMember Serializer
# # ------------------------------
# class EquipeMemberSerializer(serializers.ModelSerializer):
#     photo_url = serializers.SerializerMethodField()

#     class Meta:
#         model = EquipeMember
#         fields = "__all__"

#     def get_photo_url(self, obj):
#         if obj.photo:
#             return obj.photo.url
#         return None

# # ------------------------------
# # ProfessionalArea Serializer
# # ------------------------------
# class ProfessionalAreaSerializer(serializers.ModelSerializer):
#     image_url = serializers.SerializerMethodField()

#     class Meta:
#         model = ProfessionalArea
#         fields = "__all__"

#     def get_image_url(self, obj):
#         if obj.image:
#             return obj.image.url
#         return None
