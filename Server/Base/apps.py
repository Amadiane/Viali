from django.apps import AppConfig


class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Base'

    def ready(self):
        import Base.signals  # <- ici on importe ton fichier signals
