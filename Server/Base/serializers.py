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
from .models import News,  Value, EquipeMember
# Mission,
# , ProfessionalArea

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
# serializers.py
from rest_framework import serializers
from .models import Mission

class MissionSerializer(serializers.ModelSerializer):
    display_title = serializers.CharField(read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Mission
        fields = [
            'id',
            'title_fr',
            'title_en',
            'content_fr',
            'content_en',
            'image',
            'image_url',
            'is_active',  # ✅ inclusion
            'created_at',
            'updated_at',
            'display_title',
        ]

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


# serializers.py
from rest_framework import serializers
from .models import Value

class ValueSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    display_title = serializers.CharField(read_only=True)

    class Meta:
        model = Value
        fields = [
            "id",
            "title_fr",
            "title_en",
            "content_fr",
            "content_en",
            "image",
            "image_url",
            "display_title",
            "is_active",   # ✅ inclus dans serializer
            "created_at",
            "updated_at"
        ]

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None


# # ------------------------------
# # EquipeMember Serializer
# # ------------------------------
# serializers.py

class EquipeMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    display_position = serializers.CharField(read_only=True)

    class Meta:
        model = EquipeMember
        fields = "__all__"

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None



# # ------------------------------
# # ProfessionalArea Serializer
# # ------------------------------
# serializers.py
from rest_framework import serializers
from .models import ProfessionalArea

class ProfessionalAreaSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProfessionalArea
        fields = '__all__'
        extra_fields = ['image_url']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


from rest_framework import serializers
from .models import SardineRecipe

class SardineRecipeSerializer(serializers.ModelSerializer):
    # Accept an URL string from frontend (Cloudinary secure_url)
    image = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    image_url = serializers.SerializerMethodField(read_only=True)
    display_title = serializers.ReadOnlyField()

    class Meta:
        model = SardineRecipe
        fields = [
            "id",
            "title_fr",
            "title_en",
            "display_title",
            "image",      # incoming: secure_url string provided by frontend
            "image_url",  # outgoing: URL to use in UI
            "is_active",
            "created_at",
            "updated_at",
            "updated_by",
        ]
        read_only_fields = ["created_at", "updated_at", "updated_by", "image_url", "display_title"]

    def get_image_url(self, obj):
        # CloudinaryField exposes .url or .secure_url depending on config
        if obj.image:
            try:
                return obj.image.url
            except Exception:
                # fallback if direct attribute not available
                return str(obj.image)
        return None

    def create(self, validated_data):
        # Pop image_url if present — it's a string from frontend
        image_url = validated_data.pop("image", None)
        instance = SardineRecipe.objects.create(**validated_data)
        if image_url:
            # Assign the URL to the CloudinaryField — CloudinaryField accepts a direct URL string
            instance.image = image_url
            instance.save()
        return instance

    def update(self, instance, validated_data):
        image_url = validated_data.pop("image", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if image_url:
            instance.image = image_url

        instance.save()
        return instance


from rest_framework import serializers
from .models import ThonRecipe

class ThonRecipeSerializer(serializers.ModelSerializer):
    # Accepte soit un fichier uploadé, soit un URL Cloudinary
    image = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    image_url = serializers.SerializerMethodField(read_only=True)
    display_title = serializers.ReadOnlyField()

    class Meta:
        model = ThonRecipe
        fields = [
            "id",
            "title_fr",
            "title_en",
            "display_title",
            "image",      # incoming: string URL depuis frontend
            "image_url",  # outgoing: pour l'affichage
            "is_active",
            "created_at",
            "updated_at",
            "updated_by",
        ]
        read_only_fields = ["created_at", "updated_at", "updated_by", "image_url", "display_title"]

    def get_image_url(self, obj):
        if obj.image:
            try:
                return obj.image.url  # si CloudinaryField
            except Exception:
                return str(obj.image)  # fallback URL string
        return None

    def create(self, validated_data):
        image_url = validated_data.pop("image", None)
        instance = ThonRecipe.objects.create(**validated_data)
        if image_url:
            instance.image = image_url
            instance.save()
        return instance

    def update(self, instance, validated_data):
        image_url = validated_data.pop("image", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if image_url:
            instance.image = image_url
        instance.save()
        return instance







from rest_framework import serializers
from .models import SardineProduct

class SardineProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = SardineProduct
        fields = [
            "id",
            "title_fr",
            "title_en",
            "content_fr",
            "content_en",
            "image",
            "image_url",  # ✅ ajouté pour le frontend
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url  # CloudinaryField fournit .url
        return None
