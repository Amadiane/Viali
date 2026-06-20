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


from rest_framework import serializers
from Base.models import PartnerStatusHistory

class PartnerStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerStatusHistory
        fields = ['id', 'is_active', 'changed_at', 'partner']




#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

from rest_framework import serializers
from .models import News,  Value, EquipeMember

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


from rest_framework import serializers
from .models import Mission

class MissionSerializer(serializers.ModelSerializer):
    display_title   = serializers.CharField(read_only=True)
    image_url       = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()  # ← DOIT être ici

    class Meta:
        model = Mission
        fields = [
            'id',
            'title_fr', 'title_en',
            'content_valeur_fr', 'content_valeur_en',
            'content_mission_fr', 'content_mission_en',
            'image', 'image_url',
            'cover_image', 'cover_image_url',
            'is_active', 'created_at', 'updated_at',
            'display_title',
        ]

    @staticmethod
    def _clean(url):
        if not url:
            return None
        s = str(url)
        idx = s.find("https://")
        if idx > 0:
            return s[idx:]
        if s.startswith("http"):
            return s
        return None

    def get_image_url(self, obj):
        if not obj.image:
            return None
        return self._clean(obj.image.url) or str(obj.image.url)

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None
        return self._clean(obj.cover_image.url) or str(obj.cover_image.url)

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
    # Sortie pour affichage
    image_url = serializers.SerializerMethodField(read_only=True)
    display_title = serializers.ReadOnlyField()

    class Meta:
        model = ThonRecipe
        fields = [
            "id",
            "title_fr",
            "title_en",
            "display_title",
            "image",      # incoming: fichier uploadé ou URL
            "image_url",  # outgoing: URL pour affichage
            "is_active",
            "created_at",
            "updated_at",
            "updated_by",
        ]
        read_only_fields = ["created_at", "updated_at", "updated_by", "image_url", "display_title"]

    def get_image_url(self, obj):
        if obj.image:
            try:
                # Si ImageField / CloudinaryField
                return obj.image.url
            except Exception:
                return str(obj.image)  # fallback si string URL
        return None

    def create(self, validated_data):
        image = validated_data.pop("image", None)
        instance = ThonRecipe.objects.create(**validated_data)
        if image:
            instance.image = image
            instance.save()
        return instance

    def update(self, instance, validated_data):
        image = validated_data.pop("image", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if image:
            instance.image = image
        instance.save()
        return instance







from rest_framework import serializers
from .models import SardineProduct


class SardineProductSerializer(serializers.ModelSerializer):
    image_url          = serializers.SerializerMethodField()
    image_recette1_url = serializers.SerializerMethodField()
    image_recette2_url = serializers.SerializerMethodField()

    class Meta:
        model  = SardineProduct
        fields = [
            "id",
            "title_fr", "title_en",
            "content_fr", "content_en",
            "ingredient_fr", "ingredient_en",
            # ── nouveau ──
            "caracteristique_fr", "caracteristique_en",
            # ── ingrédients structurés ──
            "ingredienttitle1_fr", "ingredienttitle1_en",
            "ingredienttitle2_fr", "ingredienttitle2_en",
            "ingredientcontent_fr", "ingredientcontent_en",
            "ingredienttitle3_fr", "ingredienttitle3_en",
            # ── images ──
            "image", "image_url",
            "image_recette1", "image_recette1_url",
            "image_recette2", "image_recette2_url",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

    def get_image_recette1_url(self, obj):
        return obj.image_recette1.url if obj.image_recette1 else None

    def get_image_recette2_url(self, obj):
        return obj.image_recette2.url if obj.image_recette2 else None

        

from rest_framework import serializers
from .models import ThonProduct, CapitaineProduct


class ThonProductSerializer(serializers.ModelSerializer):
    image_url          = serializers.SerializerMethodField()
    image_recette1_url = serializers.SerializerMethodField()
    image_recette2_url = serializers.SerializerMethodField()

    class Meta:
        model  = ThonProduct
        fields = [
            "id",
            "title_fr", "title_en",
            "content_fr", "content_en",
            "ingredient_fr", "ingredient_en",
            # ── caractéristique ──
            "caracteristique_fr", "caracteristique_en",
            # ── ingrédients structurés ──
            "ingredienttitle1_fr", "ingredienttitle1_en",
            "ingredienttitle2_fr", "ingredienttitle2_en",
            "ingredientcontent_fr", "ingredientcontent_en",
            "ingredienttitle3_fr", "ingredienttitle3_en",
            # ── images ──
            "image", "image_url",
            "image_recette1", "image_recette1_url",
            "image_recette2", "image_recette2_url",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

    def get_image_recette1_url(self, obj):
        return obj.image_recette1.url if obj.image_recette1 else None

    def get_image_recette2_url(self, obj):
        return obj.image_recette2.url if obj.image_recette2 else None


class CapitaineProductSerializer(serializers.ModelSerializer):
    image_url          = serializers.SerializerMethodField()
    image_recette1_url = serializers.SerializerMethodField()
    image_recette2_url = serializers.SerializerMethodField()

    class Meta:
        model  = CapitaineProduct
        fields = [
            "id",
            "title_fr", "title_en",
            "content_fr", "content_en",
            "ingredient_fr", "ingredient_en",
            # ── caractéristique ──
            "caracteristique_fr", "caracteristique_en",
            # ── ingrédients structurés ──
            "ingredienttitle1_fr", "ingredienttitle1_en",
            "ingredienttitle2_fr", "ingredienttitle2_en",
            "ingredientcontent_fr", "ingredientcontent_en",
            "ingredienttitle3_fr", "ingredienttitle3_en",
            # ── images ──
            "image", "image_url",
            "image_recette1", "image_recette1_url",
            "image_recette2", "image_recette2_url",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

    def get_image_recette1_url(self, obj):
        return obj.image_recette1.url if obj.image_recette1 else None

    def get_image_recette2_url(self, obj):
        return obj.image_recette2.url if obj.image_recette2 else None


from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "category",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]



# serializers.py
from rest_framework import serializers
from .models import Community

class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = [
            "id",
            "name",
            "email",
            "role",
            "message",
            "is_replied",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]




from rest_framework import serializers
from .models import Newsletter

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = [
            "id",
            "email",
            "created_at",
            "is_confirmed",
            "is_replied",
        ]
        read_only_fields = ["created_at"]

















# home_serializers.py

from rest_framework import serializers
from .models import (
    Partner, News, Mission, Value, EquipeMember, ProfessionalArea,
    SardineRecipe, ThonRecipe, SardineProduct, ThonProduct,
)

# -------------------------------
# SERIALIZER AVEC IMAGE URL
# -------------------------------

class BaseImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if hasattr(obj, "image") and obj.image:
            try:
                return obj.image.url
            except:
                return None
        return None


# -------------------------------
# SERIALIZERS INDIVIDUELS
# -------------------------------

class PartnerSerializer(BaseImageSerializer):
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = "__all__"

    def get_cover_image_url(self, obj):
        return obj.cover_image.url if obj.cover_image else None


class NewsSerializer(BaseImageSerializer):
    class Meta:
        model = News
        fields = "__all__"


class MissionSerializer(BaseImageSerializer):
    class Meta:
        model = Mission
        fields = "__all__"


class ValueSerializer(BaseImageSerializer):
    class Meta:
        model = Value
        fields = "__all__"


class EquipeMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = EquipeMember
        fields = "__all__"

    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None


class ProfessionalAreaSerializer(BaseImageSerializer):
    class Meta:
        model = ProfessionalArea
        fields = "__all__"


class SardineRecipeSerializer(BaseImageSerializer):
    class Meta:
        model = SardineRecipe
        fields = "__all__"


class ThonRecipeSerializer(BaseImageSerializer):
    class Meta:
        model = ThonRecipe
        fields = "__all__"


class SardineProductSerializer(BaseImageSerializer):
    class Meta:
        model = SardineProduct
        fields = "__all__"


class ThonProductSerializer(BaseImageSerializer):
    class Meta:
        model = ThonProduct
        fields = "__all__"


# -------------------------------
# HOME FULL SERIALIZER
# -------------------------------

class HomeFullSerializer(serializers.Serializer):

    latest_news = serializers.SerializerMethodField()
    missions = serializers.SerializerMethodField()
    valeurs = serializers.SerializerMethodField()
    partners = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    professional_areas = serializers.SerializerMethodField()
    sardine_recipes = serializers.SerializerMethodField()
    thon_recipes = serializers.SerializerMethodField()
    sardine_products = serializers.SerializerMethodField()
    thon_products = serializers.SerializerMethodField()

    # --- NEWS (3) ---
    def get_latest_news(self, obj):
        qs = News.objects.filter(is_active=True).order_by("-created_at")[:3]
        return NewsSerializer(qs, many=True).data

    # --- MISSIONS (3) ---
    def get_missions(self, obj):
        qs = Mission.objects.filter(is_active=True).order_by("-created_at")[:3]
        return MissionSerializer(qs, many=True).data

    # --- VALUES (5) ---
    def get_valeurs(self, obj):
        qs = Value.objects.filter(is_active=True).order_by("-created_at")[:5]
        return ValueSerializer(qs, many=True).data

    # --- PARTENAIRES (All actifs) ---
    def get_partners(self, obj):
        qs = Partner.objects.filter(is_active=True).order_by("-created_at")
        return PartnerSerializer(qs, many=True).data

    # --- EQUIPE (5) ---
    def get_team(self, obj):
        qs = EquipeMember.objects.filter(is_active=True).order_by("full_name")[:5]
        return EquipeMemberSerializer(qs, many=True).data

    # --- PROFESSIONAL AREAS ---
    def get_professional_areas(self, obj):
        qs = ProfessionalArea.objects.all().order_by("name_fr")
        return ProfessionalAreaSerializer(qs, many=True).data

    # --- RECETTES SARDINE ---
    def get_sardine_recipes(self, obj):
        qs = SardineRecipe.objects.filter(is_active=True)[:6]
        return SardineRecipeSerializer(qs, many=True).data

    # --- RECETTES THON ---
    def get_thon_recipes(self, obj):
        qs = ThonRecipe.objects.filter(is_active=True)[:6]
        return ThonRecipeSerializer(qs, many=True).data

    # --- PRODUITS SARDINE ---
    def get_sardine_products(self, obj):
        qs = SardineProduct.objects.filter(is_active=True)
        return SardineProductSerializer(qs, many=True).data

    # --- PRODUITS THON ---
    def get_thon_products(self, obj):
        qs = ThonProduct.objects.filter(is_active=True)
        return ThonProductSerializer(qs, many=True).data















from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            "id",
            "action_type",
            "page",
            "label",
            "user",
            "ip_address",
            "user_agent",
            "referrer",
            "meta",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]





from rest_framework import serializers
from .models import Recherche, RecherchePartner, ContactProfessionnel

class RecherchePartnerSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = RecherchePartner
        fields = [
            'id', 'name', 'is_active', 'cover_image',
            'cover_image_url', 'website_url', 'created_at', 'updated_at'
        ]

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None

class RechercheSerializer(serializers.ModelSerializer):
    # Ajouter des champs explicites pour les images Cloudinary
    image_1_url = serializers.SerializerMethodField()
    image_2_url = serializers.SerializerMethodField()
    image_3_url = serializers.SerializerMethodField()
    image_4_url = serializers.SerializerMethodField()
    image_5_url = serializers.SerializerMethodField()

    class Meta:
        model = Recherche
        fields = '__all__'
        # Ou spécifiez explicitement tous les champs
        # fields = [
        #     'id',
        #     'title1_fr', 'title1_en',
        #     'title2_fr', 'title2_en',
        #     'title3_fr', 'title3_en',
        #     'title4_fr', 'title4_en',
        #     'title5_fr', 'title5_en',
        #     'content1_fr', 'content1_en',
        #     'content2_fr', 'content2_en',
        #     'content3_fr', 'content3_en',
        #     'content4_fr', 'content4_en',
        #     'content5_fr', 'content5_en',
        #     'image_1', 'image_2', 'image_3', 'image_4', 'image_5',
        #     'image_1_url', 'image_2_url', 'image_3_url', 'image_4_url', 'image_5_url',
        # ]

    def get_image_1_url(self, obj):
        """Retourne l'URL complète de l'image 1"""
        if obj.image_1:
            return obj.image_1.url
        return None

    def get_image_2_url(self, obj):
        """Retourne l'URL complète de l'image 2"""
        if obj.image_2:
            return obj.image_2.url
        return None

    def get_image_3_url(self, obj):
        """Retourne l'URL complète de l'image 3"""
        if obj.image_3:
            return obj.image_3.url
        return None

    def get_image_4_url(self, obj):
        """Retourne l'URL complète de l'image 4"""
        if obj.image_4:
            return obj.image_4.url
        return None

    def get_image_5_url(self, obj):
        """Retourne l'URL complète de l'image 5"""
        if obj.image_5:
            return obj.image_5.url
        return None





# serializers.py
class ContactProfessionnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactProfessionnel
        fields = '__all__'
        read_only_fields = ['created_at']





from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import GammePage


def build_cloudinary_url(value, **options):
    if not value:
        return None
    try:
        url, _ = cloudinary_url(
            value.public_id,
            format="webp", quality="auto", fetch_format="auto",
            **options,
        )
        return url
    except Exception:
        return str(value) if value else None


class CloudinaryURLField(serializers.CharField):
    """
    Accepte une URL Cloudinary (string) en écriture
    et la stocke telle quelle dans le CloudinaryField.
    """
    def to_internal_value(self, data):
        # On stocke juste l'URL brute — Cloudinary la reconnaît
        return super().to_internal_value(data)


class GammePageSerializer(serializers.ModelSerializer):
    # Champs image acceptent une URL string en entrée
    imagecoverproduct = CloudinaryURLField(required=False, allow_blank=True)
    image_tartinable  = CloudinaryURLField(required=False, allow_blank=True)
    image_sauce       = CloudinaryURLField(required=False, allow_blank=True)
    image_poisson     = CloudinaryURLField(required=False, allow_blank=True)

    # URLs en lecture
    imagecoverproduct_url = serializers.SerializerMethodField()
    image_tartinable_url  = serializers.SerializerMethodField()
    image_sauce_url       = serializers.SerializerMethodField()
    image_poisson_url     = serializers.SerializerMethodField()

    class Meta:
        model  = GammePage
        fields = [
            "id",
            "title_fr", "title_en",
            "descriptionstitle_fr", "descriptionstitle_en",
            "descriptionstatinale_fr", "descriptionstatinale_en",
            "descriptionsSauces_fr", "descriptionsSauces_en",
            "imagecoverproduct", "imagecoverproduct_url",
            "image_tartinable",  "image_tartinable_url",
            "image_sauce",       "image_sauce_url",
            "image_poisson",     "image_poisson_url",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_imagecoverproduct_url(self, obj):
        return build_cloudinary_url(obj.imagecoverproduct, width=1600, crop="fill")

    def get_image_tartinable_url(self, obj):
        return build_cloudinary_url(obj.image_tartinable, width=800, crop="fill")

    def get_image_sauce_url(self, obj):
        return build_cloudinary_url(obj.image_sauce, width=800, crop="fill")

    def get_image_poisson_url(self, obj):
        return build_cloudinary_url(obj.image_poisson, width=400)






from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import RillettePage


def build_cloudinary_url(value, **options):
    if not value:
        return None
    try:
        url, _ = cloudinary_url(
            value.public_id,
            format="webp", quality="auto", fetch_format="auto",
            **options,
        )
        return url
    except Exception:
        return str(value) if value else None


class CloudinaryURLField(serializers.CharField):
    def to_internal_value(self, data):
        return super().to_internal_value(data)


class RillettePageSerializer(serializers.ModelSerializer):
    # Champs image acceptent URL string en entrée
    imagecoverrillette = CloudinaryURLField(required=False, allow_blank=True)
    image_sardine      = CloudinaryURLField(required=False, allow_blank=True)
    image_thon         = CloudinaryURLField(required=False, allow_blank=True)
    image_capitaine    = CloudinaryURLField(required=False, allow_blank=True)

    # URLs résolues en lecture
    imagecoverrillette_url = serializers.SerializerMethodField()
    image_sardine_url      = serializers.SerializerMethodField()
    image_thon_url         = serializers.SerializerMethodField()
    image_capitaine_url    = serializers.SerializerMethodField()

    class Meta:
        model  = RillettePage
        fields = [
            "id",
            "title_fr", "title_en",
            "descriptionstitle_fr", "descriptionstitle_en",
            "sardinetitle_fr", "sardinetitle_en",
            "thontitle_fr", "thontitle_en",
            "capitainetitle_fr", "capitainetitle_en",
            "descriptionssardinerillette_fr", "descriptionssardinerillette_en",
            "descriptionsthonrillette_fr", "descriptionsthonrillette_en",
            "descriptionscapitainerillette_fr", "descriptionscapitainerillette_en",
            "imagecoverrillette", "imagecoverrillette_url",
            "image_sardine",     "image_sardine_url",
            "image_thon",        "image_thon_url",
            "image_capitaine",   "image_capitaine_url",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_imagecoverrillette_url(self, obj):
        return build_cloudinary_url(obj.imagecoverrillette, width=1600, crop="fill")

    def get_image_sardine_url(self, obj):
        return build_cloudinary_url(obj.image_sardine, width=800, crop="fill")

    def get_image_thon_url(self, obj):
        return build_cloudinary_url(obj.image_thon, width=800, crop="fill")

    def get_image_capitaine_url(self, obj):
        return build_cloudinary_url(obj.image_capitaine, width=800, crop="fill")