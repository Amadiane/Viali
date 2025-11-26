# My models

#Résumé mental — reconstruire toi-même
#Quand tu veux créer un modèle :
#Importe models et éventuellement timezone.
#Crée une classe héritant de models.Model.
#Définis tes champs : texte, image, lien, date, etc.
#Ajoute une classe Meta si tu veux personnaliser l’affichage.
#Ajoute un __str__ pour rendre le modèle plus lisible.

from django.db import models #module de base pour créer les modèles dans django (c'est lui qui donne CharField, TextField, DateTimeField,etc)
from django.utils import timezone #permet de récuperer la date/heure actuelle de manière sûre et compatible avec le fuseaux horaires de Django.
from django.utils import translation#contient les utilitaires pour la gestion des langues, notament get_language() qui renvoie la langue "active"
from cloudinary.models import CloudinaryField #ce champ permet spécialement d'enregistrer directement une image ou un fichier sur Cloudinary

class Partner (models.Model): #chaque class qui herite de models.Model devient une table dans la base de données
    name_fr = models.CharField(max_length=255, verbose_name="Nom (FR)") #CharFiel=texte court,max_length=255=limite à 255 caractères, verbose_name=nom visible dans l'admi django
    name_en = models.CharField(max_length=255, verbose_name="Name (EN)", blank=True, null=True) #blank=True=champ peut etre vide dans le formulaire et null=True= champ peut etre vide dans la base de donnees

    is_active = models.BooleanField(default=True)#pour gérer le statut 

    cover_image = CloudinaryField (
        'Cover Image',
        folder = 'partners',
        blank = True,
        null = True
    )

    website_url = models.URLField ( #URLFiel champ validant automatiquement que le contenu est une url valide
        help_text="Partner's official website link", #petit texte d'aide affiché dans le back office
        blank = True,
        null = True
    )

    created_at = models.DateTimeField (default=timezone.now) #permet d'enregistrer la date de création de l'objet 
    updated_at = models.DateTimeField (auto_now=True) #met à jour automatiquement la date de modification à chaque sauvegarde

    class Meta:
        verbose_name = "Partner"
        verbose_name_plural ="Partners"
        ordering = ['-created_at']

    @property #decorateur python qui transforme la fonctionne suivante en attribut calculé
    def display_name(self): #Déclare la methode/propriété qui va retourner le nom à afficher selon la langue
        # lang = translation.get_language () #recupere la langue active(string)
        # if lang == 'fr':#verifie si la langue active est français, si oui on choisi la version française comme prioritaire
        #     return self.name_fr or self.name_en #si name_fr existe non vide, non none, string non vide = retourne name_fr ou si non name_en 
        # return self.name_en or self.name_fr #executé quand la langue  n'est pas 'fr'
        lang = translation.get_language() or 'en'  # sécurité si None
        if lang.startswith('fr'):
            return self.name_fr or self.name_en or ""
        if lang.startswith('en'):
            return self.name_en or self.name_fr or ""
        # fallback générique
        return self.name_en or self.name_fr or ""

    def __str__(self):
        return self.name_en or self.name_fr


#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ----------------- NEWS -----------------
class News(models.Model):
    title_fr = models.CharField(max_length=255, verbose_name="Titre (FR)")
    title_en = models.CharField(max_length=255, verbose_name="Title (EN)", blank=True, null=True)

    content_fr = models.TextField(verbose_name="Contenu (FR)")
    content_en = models.TextField(verbose_name="Content (EN)", blank=True, null=True)

    image = CloudinaryField('Image', folder='news', blank=True, null=True)

    is_active = models.BooleanField(default=True)  # 👈 ajouté ici

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "News"
        verbose_name_plural = "News"
        ordering = ["-created_at"]

    @property
    def display_title(self):
        lang = translation.get_language() or "en"
        return self.title_fr if lang.startswith("fr") else self.title_en or self.title_fr

# ----------------- MISSION -----------------
# # models.py

class Mission(models.Model):
    title_fr = models.CharField(max_length=255, verbose_name="Titre (FR)")
    title_en = models.CharField(max_length=255, verbose_name="Title (EN)", blank=True, null=True)
    content_fr = models.TextField(verbose_name="Contenu (FR)")
    content_en = models.TextField(verbose_name="Content (EN)", blank=True, null=True)
    image = CloudinaryField('Image', folder='missions', blank=True, null=True)
    is_active = models.BooleanField(default=True)  # ✅ nouveau champ
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Mission"
        verbose_name_plural = "Missions"
        ordering = ['-created_at']

    @property
    def display_title(self):
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.title_fr or self.title_en or ""
        return self.title_en or self.title_fr or ""

    def __str__(self):
        return self.display_title

# # ----------------- VALUE -----------------
# models.py
from django.db import models
from django.utils import timezone, translation
from cloudinary.models import CloudinaryField

class Value(models.Model):
    title_fr = models.CharField(max_length=255, verbose_name="Titre (FR)")
    title_en = models.CharField(max_length=255, verbose_name="Title (EN)", blank=True, null=True)
    content_fr = models.TextField(verbose_name="Contenu (FR)")
    content_en = models.TextField(verbose_name="Content (EN)", blank=True, null=True)
    image = CloudinaryField('Image', folder='values', blank=True, null=True)
    is_active = models.BooleanField(default=True)  # ✅ Ajout du champ actif
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Value"
        verbose_name_plural = "Values"
        ordering = ['-created_at']

    @property
    def display_title(self):
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.title_fr or self.title_en or ""
        return self.title_en or self.title_fr or ""

    def __str__(self):
        return self.display_title

# # ----------------- EquipeMember -----------------
class EquipeMember(models.Model):
    full_name = models.CharField(max_length=255)
    position_fr = models.CharField(max_length=255, verbose_name="Poste (FR)")
    position_en = models.CharField(max_length=255, verbose_name="Position (EN)", blank=True, null=True)
    bio_fr = models.TextField(verbose_name="Biographie (FR)", blank=True, null=True)
    bio_en = models.TextField(verbose_name="Biography (EN)", blank=True, null=True)
    photo = CloudinaryField('Photo', folder='team', blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Membre d'équipe"
        verbose_name_plural = "Membres d'équipe"
        ordering = ['full_name']

    @property
    def display_position(self):
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.position_fr or self.position_en or ""
        return self.position_en or self.position_fr or ""

    def __str__(self):
        return self.full_name

# # ----------------- ProfessionalArea -----------------
# models.py
from django.db import models
from django.utils import timezone
from django.utils import translation
from cloudinary.models import CloudinaryField

class ProfessionalArea(models.Model):
    TARGET_GROUP_CHOICES = [
        ('companies', "Entreprises / Projet R&D"),
        ('points_of_sale', "Points de vente (Superette, Boutique, Grande surface)"),
        ('distributors', "Distributeurs (Grossiste)"),
    ]

    name_fr = models.CharField(max_length=255, verbose_name="Nom (FR)")
    name_en = models.CharField(max_length=255, verbose_name="Name (EN)", blank=True, null=True)
    description_fr = models.TextField(verbose_name="Description (FR)", blank=True, null=True)
    description_en = models.TextField(verbose_name="Description (EN)", blank=True, null=True)
    image = CloudinaryField('Image', folder='professional_areas', blank=True, null=True)
    target_group = models.CharField(max_length=255, choices=TARGET_GROUP_CHOICES, default='companies')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Professional Area"
        verbose_name_plural = "Professional Areas"
        ordering = ['name_fr']

    @property
    def display_name(self):
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.name_fr or self.name_en or ""
        return self.name_en or self.name_fr or ""

    def __str__(self):
        return self.display_name



from django.db import models
from django.utils import timezone, translation
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()

class SardineRecipe(models.Model):
    title_fr = models.CharField(max_length=255, verbose_name="Title (FR)")
    title_en = models.CharField(max_length=255, verbose_name="Title (EN)", blank=True, null=True)

    # Keep CloudinaryField — we'll set it from the serializer using the secure_url returned by Cloudinary
    image = CloudinaryField('Image', folder='sardine_recipes', blank=True, null=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_sardine_recipes"
    )

    class Meta:
        verbose_name = "Sardine Recipe"
        verbose_name_plural = "Sardine Recipes"
        ordering = ['-created_at']

    @property
    def display_title(self):
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.title_fr or self.title_en or ""
        return self.title_en or self.title_fr or ""

    def __str__(self):
        return self.display_title








from django.db import models
from django.utils import timezone, translation
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()

class ThonRecipe(models.Model):
    title_fr = models.CharField(max_length=255, verbose_name="Title (FR)")
    title_en = models.CharField(max_length=255, verbose_name="Title (EN)", blank=True, null=True)

    # CloudinaryField for image
    image = CloudinaryField('Image', folder='thon_recipes', blank=True, null=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_thon_recipes"
    )

    class Meta:
        verbose_name = "Thon Recipe"
        verbose_name_plural = "Thon Recipes"
        ordering = ['-created_at']

    @property
    def display_title(self):
        lang = translation.get_language() or 'en'
        if lang.startswith('fr'):
            return self.title_fr or self.title_en or ""
        return self.title_en or self.title_fr or ""

    def __str__(self):
        return self.display_title



from django.db import models
from cloudinary.models import CloudinaryField

class SardineProduct(models.Model):
    title_fr = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    content_fr = models.TextField()
    content_en = models.TextField()
    image = CloudinaryField('image', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title_en


from django.db import models
from cloudinary.models import CloudinaryField

class ThonProduct(models.Model):
    title_fr = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    content_fr = models.TextField()
    content_en = models.TextField()
    image = CloudinaryField('image', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title_en





from django.db import models

class Contact(models.Model):
    CATEGORY_CHOICES = [
        ('commentaire', 'Commentaires et suggestions'),
        ('question', 'Questions générales'),
        ('support', 'Support technique'),
        ('partenariat', 'Partenariat'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"




# models.py
from django.db import models

class Community(models.Model):
    ROLE_CHOICES = [
        ("partenaire", "Partenaire"),
        ("client", "Client"),
        ("fournisseur", "Fournisseur"),
        ("employe", "Employé"),
        ("autres", "Autres"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_replied = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"
