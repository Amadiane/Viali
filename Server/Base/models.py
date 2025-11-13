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