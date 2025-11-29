from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Partner, PartnerStatusHistory

@receiver(pre_save, sender=Partner)
def track_partner_status(sender, instance, **kwargs):
    if not instance.pk:  # nouveau partenaire
        return
    old_instance = Partner.objects.get(pk=instance.pk)
    if old_instance.is_active != instance.is_active:
        PartnerStatusHistory.objects.create(
            partner=instance,
            is_active=instance.is_active
        )
