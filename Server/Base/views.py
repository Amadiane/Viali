from django.shortcuts import render


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email") or request.data.get("username")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email et mot de passe requis"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=email, password=password)

        if user is None:
            return Response(
                {"detail": "Identifiants incorrects"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        })








# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Partner
from .serializers import PartnerSerializer

class PartnerViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les partenaires.
    Fournit les endpoints CRUD automatiquement :
    GET /partners/ -> liste
    POST /partners/ -> créer
    GET /partners/<id>/ -> détail
    PUT/PATCH /partners/<id>/ -> modifier
    DELETE /partners/<id>/ -> supprimer
    """
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer

    def get_queryset(self):
        """
        Optionnel : filtrer seulement les partenaires actifs si demandé par paramètre GET
        Ex: /partners/?active=true
        """
        queryset = super().get_queryset()
        active = self.request.query_params.get('active')
        if active is not None:
            if active.lower() in ['true', '1']:
                queryset = queryset.filter(is_active=True)
            elif active.lower() in ['false', '0']:
                queryset = queryset.filter(is_active=False)
        return queryset

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Endpoint personnalisé pour récupérer seulement les partenaires actifs
        GET /partners/active/
        """
        active_partners = Partner.objects.filter(is_active=True)
        serializer = self.get_serializer(active_partners, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)





from rest_framework.decorators import api_view
from rest_framework.response import Response
from Base.models import PartnerStatusHistory
from .serializers import PartnerStatusHistorySerializer

@api_view(['GET'])
def partner_history(request, partner_id):
    try:
        history = PartnerStatusHistory.objects.filter(partner__id=partner_id).order_by('-changed_at')
        serializer = PartnerStatusHistorySerializer(history, many=True)
        return Response(serializer.data)
    except Exception as e:
        # Log complet de l'erreur pour debug
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)




#//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import News, Value, Mission, EquipeMember
# , ProfessionalArea
from .serializers import (
    NewsSerializer,
    MissionSerializer,
    ValueSerializer,
    EquipeMemberSerializer,
    # ProfessionalAreaSerializer
)

# ------------------------------
# News ViewSet
# ------------------------------
from rest_framework import permissions
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]

# ------------------------------
# Mission ViewSet
# ------------------------------
class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.all().order_by('-created_at')
    serializer_class = MissionSerializer

# # ------------------------------
# # Value ViewSet
# # ------------------------------
# views.py
from rest_framework import viewsets
from .models import Value
from .serializers import ValueSerializer

class ValueViewSet(viewsets.ModelViewSet):
    queryset = Value.objects.all().order_by('-created_at')
    serializer_class = ValueSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        active = self.request.query_params.get('active')
        if active is not None:
            queryset = queryset.filter(is_active=(active.lower() in ['true', '1']))
        return queryset


# # ------------------------------
# # EquipeMember ViewSet
# # ------------------------------
# views.py

class EquipeMemberViewSet(viewsets.ModelViewSet):
    queryset = EquipeMember.objects.all()
    serializer_class = EquipeMemberSerializer


# # ------------------------------
# # ProfessionalArea ViewSet
# # ------------------------------
# views.py
from rest_framework import viewsets, permissions
from .models import ProfessionalArea
from .serializers import ProfessionalAreaSerializer

class ProfessionalAreaViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalArea.objects.all()
    serializer_class = ProfessionalAreaSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]













from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import SardineRecipe
from .serializers import SardineRecipeSerializer

# class IsAdminOrReadOnly(permissions.BasePermission):
#     """
#     Read for everyone. Write only for staff users.
#     """
#     def has_permission(self, request, view):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return bool(request.user and request.user.is_authenticated and request.user.is_staff)

from rest_framework import permissions

class SardineRecipeViewSet(viewsets.ModelViewSet):
    queryset = SardineRecipe.objects.all().order_by('-created_at')
    serializer_class = SardineRecipeSerializer
    permission_classes = [permissions.AllowAny]  # <-- plus de login requis

    def perform_create(self, serializer):
        serializer.save(updated_by=None)  # plus de user

    def perform_update(self, serializer):
        serializer.save(updated_by=None)







from rest_framework import viewsets, permissions
from .models import ThonRecipe
from .serializers import ThonRecipeSerializer

class ThonRecipeViewSet(viewsets.ModelViewSet):
    queryset = ThonRecipe.objects.all().order_by('-created_at')
    serializer_class = ThonRecipeSerializer
    permission_classes = [permissions.AllowAny]  # plus besoin de login pour test

    def perform_create(self, serializer):
        serializer.save(updated_by=None)

    def perform_update(self, serializer):
        serializer.save(updated_by=None)


from rest_framework import viewsets, permissions
from .models import SardineProduct
from .serializers import SardineProductSerializer

class SardineProductViewSet(viewsets.ModelViewSet):
    queryset = SardineProduct.objects.all().order_by("-created_at")
    serializer_class = SardineProductSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]


from rest_framework import viewsets, permissions
from .models import ThonProduct
from .serializers import ThonProductSerializer

class ThonProductViewSet(viewsets.ModelViewSet):
    queryset = ThonProduct.objects.all().order_by("-created_at")
    serializer_class = ThonProductSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

from rest_framework import viewsets
from .models import CapitaineProduct
from .serializers import CapitaineProductSerializer

class CapitaineProductViewSet(viewsets.ModelViewSet):
    """
    API endpoints pour les produits Capitaine
    """
    queryset = CapitaineProduct.objects.all().order_by("-created_at")
    serializer_class = CapitaineProductSerializer




# from rest_framework import viewsets, permissions
# from .models import Contact
# from .serializers import ContactSerializer

# class ContactViewSet(viewsets.ModelViewSet):
#     queryset = Contact.objects.all().order_by("-created_at")
#     serializer_class = ContactSerializer
#     permission_classes = [permissions.AllowAny]  # Ou IsAuthenticated si tu veux sécuriser l'accès
# from rest_framework import generics, status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django.core.mail import send_mail
# from django.conf import settings
# from .models import Contact
# from .serializers import ContactSerializer

# # 📬 Liste & création des messages de contact
# class ContactListCreateView(generics.ListCreateAPIView):
#     queryset = Contact.objects.all().order_by('-created_at')
#     serializer_class = ContactSerializer

#     def perform_create(self, serializer):
#         contact = serializer.save()

#         # 📨 Email de confirmation à l’utilisateur
#         subject_user = f"Confirmation de votre message - {contact.subject}"
#         message_user = (
#             f"Bonjour {contact.name},\n\n"
#             f"Merci de nous avoir contactés via Viali.\n"
#             f"Nous avons bien reçu votre message :\n\n"
#             f"---\n"
#             f"{contact.message}\n"
#             f"---\n\n"
#             f"Notre équipe vous répondra dès que possible.\n\n"
#             f"Cordialement,\n"
#             f"L’équipe Tekacom"
#         )

#         send_mail(
#             subject_user,
#             message_user,
#             settings.DEFAULT_FROM_EMAIL,
#             [contact.email],
#             fail_silently=False,  # on veut voir les erreurs en dev
#         )

#         # 📩 Notification à l’administrateur
#         subject_admin = f"Nouveau message de contact : {contact.subject}"
#         message_admin = (
#             f"Nom : {contact.name}\n"
#             f"Email : {contact.email}\n"
#             f"Catégorie : {contact.get_category_display()}\n\n"
#             f"Message :\n{contact.message}"
#         )

#         send_mail(
#             subject_admin,
#             message_admin,
#             settings.DEFAULT_FROM_EMAIL,
#             [settings.CONTACT_ADMIN_EMAIL],
#             fail_silently=False,
#         )


# # 📬 Détail / modification / suppression d'un message
# class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Contact.objects.all()
#     serializer_class = ContactSerializer


# # 📨 Répondre à un message de contact
# class ContactReplyView(APIView):
#     def post(self, request, pk):
#         try:
#             contact = Contact.objects.get(pk=pk)
#         except Contact.DoesNotExist:
#             return Response({'error': 'Contact introuvable'}, status=status.HTTP_404_NOT_FOUND)

#         reply_message = request.data.get('reply', '').strip()
#         if not reply_message:
#             return Response({'error': 'Le message de réponse est vide'}, status=status.HTTP_400_BAD_REQUEST)

#         # ✉️ Envoi de la réponse à l'utilisateur
#         send_mail(
#             subject=f"Réponse à votre message - {contact.subject}",
#             message=f"Bonjour {contact.name},\n\n{reply_message}\n\nCordialement,\nL’équipe Tekacom",
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             recipient_list=[contact.email],
#             fail_silently=False,
#         )

#         return Response({'success': 'Email envoyé avec succès'}, status=status.HTTP_200_OK)
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer
import logging

logger = logging.getLogger(__name__)


class ContactListCreateView(generics.ListCreateAPIView):
    queryset = Contact.objects.all().order_by('-created_at')
    serializer_class = ContactSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        contact = serializer.save()
        try:
            self._send_emails(contact)
        except Exception as e:
            logger.error(f"Erreur envoi email contact: {e}")

    def _send_emails(self, contact):
        nom      = contact.name    or ""
        email    = contact.email   or ""
        sujet    = contact.subject or "—"
        message  = contact.message or ""
        try:
            categorie = contact.get_category_display()
        except Exception:
            categorie = contact.category or "—"

        # ══════════════════════════════
        # 1. Email à l'admin VIALI
        # ══════════════════════════════
        html_admin = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <div style="background:linear-gradient(135deg,#FFC107,#FF8C00);padding:20px;border-radius:8px;margin-bottom:24px;">
            <h2 style="color:white;margin:0;">&#128268; Nouveau message de contact</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px;font-weight:bold;color:#555;width:130px;">Nom</td>
              <td style="padding:8px;">{nom}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="padding:8px;font-weight:bold;color:#555;">Email</td>
              <td style="padding:8px;"><a href="mailto:{email}" style="color:#FF8C00;">{email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px;font-weight:bold;color:#555;">Sujet</td>
              <td style="padding:8px;">{sujet}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="padding:8px;font-weight:bold;color:#555;">Cat&#233;gorie</td>
              <td style="padding:8px;">{categorie}</td>
            </tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#fff8f0;border-left:4px solid #FF8C00;border-radius:4px;">
            <p style="font-weight:bold;color:#FF8C00;margin:0 0 8px;">Message :</p>
            <p style="margin:0;line-height:1.6;white-space:pre-wrap;">{message}</p>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:{email}?subject=Re: {sujet}"
               style="background:linear-gradient(135deg,#FFC107,#FF8C00);color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
              &#9993; R&#233;pondre &#224; {nom}
            </a>
          </div>
          <p style="margin-top:24px;color:#aaa;font-size:12px;text-align:center;">
            Message re&#231;u depuis le formulaire Contact &#8212; viali-gn.com
          </p>
        </div>
        """

        try:
            msg_admin = EmailMultiAlternatives(
                subject=f"[Contact] {sujet} — {nom}",
                body=f"Nouveau message de {nom} ({email}) :\n\nCatégorie : {categorie}\n\n{message}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_ADMIN_EMAIL],
                reply_to=[email],
            )
            msg_admin.attach_alternative(html_admin, "text/html")
            msg_admin.send(fail_silently=False)
        except Exception as e:
            logger.error(f"Erreur email admin contact: {e}")

        # ══════════════════════════════
        # 2. Email de confirmation au visiteur
        # ══════════════════════════════
        html_visiteur = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <div style="background:linear-gradient(135deg,#FFC107,#FF8C00);padding:20px;border-radius:8px;margin-bottom:24px;">
            <h2 style="color:white;margin:0;">&#10003; Message bien re&#231;u !</h2>
          </div>
          <p style="font-size:16px;">Bonjour <strong>{nom}</strong>,</p>
          <p style="color:#555;line-height:1.7;">
            Merci de nous avoir contact&#233;s. Notre &#233;quipe a bien re&#231;u votre message
            et vous r&#233;pondra dans les plus brefs d&#233;lais.
          </p>
          <div style="margin:20px 0;padding:16px;background:#fff8f0;border-left:4px solid #FF8C00;border-radius:4px;">
            <p style="font-weight:bold;color:#FF8C00;margin:0 0 12px;">R&#233;capitulatif de votre message :</p>
            <p style="margin:4px 0;"><strong>Sujet :</strong> {sujet}</p>
            <p style="margin:4px 0;"><strong>Cat&#233;gorie :</strong> {categorie}</p>
            <p style="margin:8px 0 4px;"><strong>Message :</strong></p>
            <p style="margin:0;color:#555;white-space:pre-wrap;line-height:1.6;">{message}</p>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#888;font-size:13px;line-height:1.6;">
            Cordialement,<br>
            <strong style="color:#333;">L'&#233;quipe VIALI</strong><br>
            <a href="mailto:contact@viali-gn.com" style="color:#FF8C00;">contact@viali-gn.com</a><br>
            <a href="https://www.viali-gn.com" style="color:#FF8C00;">www.viali-gn.com</a>
          </p>
        </div>
        """

        try:
            msg_visiteur = EmailMultiAlternatives(
                subject=f"Confirmation — {sujet}",
                body=f"Bonjour {nom},\n\nMerci pour votre message. Nous vous répondrons bientôt.\n\nCordialement,\nL'équipe VIALI",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email],
            )
            msg_visiteur.attach_alternative(html_visiteur, "text/html")
            msg_visiteur.send(fail_silently=False)
        except Exception as e:
            logger.error(f"Erreur email visiteur contact: {e}")


class ContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]


class ContactReplyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            contact = Contact.objects.get(pk=pk)
        except Contact.DoesNotExist:
            return Response({'error': 'Contact introuvable'}, status=status.HTTP_404_NOT_FOUND)

        reply_message = request.data.get('reply', '').strip()
        if not reply_message:
            return Response({'error': 'Message de réponse vide'}, status=status.HTTP_400_BAD_REQUEST)

        nom   = contact.name  or ""
        email = contact.email or ""
        sujet = contact.subject or "—"

        html_reply = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <div style="background:linear-gradient(135deg,#FFC107,#FF8C00);padding:20px;border-radius:8px;margin-bottom:24px;">
            <h2 style="color:white;margin:0;">&#9993; R&#233;ponse VIALI</h2>
          </div>
          <p style="font-size:16px;">Bonjour <strong>{nom}</strong>,</p>
          <div style="margin:20px 0;padding:16px;background:#fff8f0;border-left:4px solid #FF8C00;border-radius:4px;">
            <p style="margin:0;line-height:1.7;white-space:pre-wrap;">{reply_message}</p>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#888;font-size:13px;line-height:1.6;">
            Cordialement,<br>
            <strong style="color:#333;">L'&#233;quipe VIALI</strong><br>
            <a href="mailto:contact@viali-gn.com" style="color:#FF8C00;">contact@viali-gn.com</a>
          </p>
        </div>
        """

        try:
            msg = EmailMultiAlternatives(
                subject=f"Réponse à votre message — {sujet}",
                body=f"Bonjour {nom},\n\n{reply_message}\n\nCordialement,\nL'équipe VIALI",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email],
                reply_to=[settings.CONTACT_ADMIN_EMAIL],
            )
            msg.attach_alternative(html_reply, "text/html")
            msg.send(fail_silently=False)
        except Exception as e:
            logger.error(f"Erreur email reply: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'success': 'R&#233;ponse envoy&#233;e avec succ&#232;s'}, status=status.HTTP_200_OK)





# views.py
from rest_framework import viewsets, permissions
from .models import Community
from .serializers import CommunitySerializer

class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all().order_by("-created_at")
    serializer_class = CommunitySerializer
    permission_classes = [permissions.AllowAny]  # accessible sans authentification




from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Newsletter
from .serializers import NewsletterSerializer

class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all().order_by("-created_at")
    serializer_class = NewsletterSerializer

    # Confirmer un email
    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        newsletter = self.get_object()
        newsletter.is_confirmed = True
        newsletter.save()
        return Response({"message": "Email confirmed"}, status=status.HTTP_200_OK)

    # Marquer comme répondu
    @action(detail=True, methods=["post"])
    def reply(self, request, pk=None):
        newsletter = self.get_object()
        newsletter.is_replied = True
        newsletter.save()
        return Response({"message": "Email marked as replied"}, status=status.HTTP_200_OK)

















from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Count, DateField
from django.db.models.functions import TruncDate
from django.utils import timezone
from .models import Activity
from .serializers import ActivitySerializer
from datetime import timedelta

class TrackEventView(APIView):
    permission_classes = [permissions.AllowAny]  # called from client

    def post(self, request):
        data = request.data
        action_type = data.get("action_type")
        if not action_type:
            return Response({"detail": "action_type is required"}, status=status.HTTP_400_BAD_REQUEST)

        activity = Activity.objects.create(
            action_type=action_type,
            page=data.get("page") or data.get("path") or "",
            label=data.get("label"),
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT"),
            referrer=request.META.get("HTTP_REFERER"),
            meta=data.get("meta", None),
            user=request.user if request.user.is_authenticated else None,
        )
        return Response({"ok": True, "id": activity.id}, status=status.HTTP_201_CREATED)


class TrackStatsView(APIView):
    """
    Returns aggregated stats for the dashboard.
    Query params:
      - days=30 (default 30)
    """
    # permission_classes = [permissions.IsAuthenticated]  # admin-only
    def get(self, request):
        days = int(request.query_params.get("days", 30))
        since = timezone.now() - timedelta(days=days)

        qs = Activity.objects.filter(created_at__gte=since)

        # totals per action type
        by_action = qs.values("action_type").annotate(total=Count("id")).order_by("-total")

        # top pages
        top_pages = qs.values("page").annotate(total=Count("id")).order_by("-total")[:20]

        # timeseries (daily)
        daily_qs = qs.annotate(day=TruncDate("created_at")).values("day").annotate(count=Count("id")).order_by("day")
        timeseries = [{"day": item["day"].isoformat(), "count": item["count"]} for item in daily_qs]

        # contact submits and mails
        contacts_count = qs.filter(action_type="contact_submit").count()
        mails_count = qs.filter(action_type="mail_sent").count()
        visits_count = qs.filter(action_type="visit").count()
        clicks_count = qs.filter(action_type="click").count()

        data = {
            "period_days": days,
            "totals": {
                "visits": visits_count,
                "clicks": clicks_count,
                "contacts": contacts_count,
                "mails": mails_count,
                "total_actions": qs.count(),
            },
            "by_action": list(by_action),
            "top_pages": list(top_pages),
            "timeseries": timeseries,
        }
        return Response(data)



from .models import Recherche, RecherchePartner, ContactProfessionnel
from .serializers import RechercheSerializer, RecherchePartnerSerializer, ContactProfessionnelSerializer

from rest_framework import viewsets, permissions

class RecherchePartnerViewSet(viewsets.ModelViewSet):
    queryset = RecherchePartner.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = RecherchePartnerSerializer
    permission_classes =  [permissions.AllowAny]

class RechercheViewSet (viewsets.ModelViewSet):
    queryset = Recherche.objects.all()
    serializer_class = RechercheSerializer
    permission_classes = [permissions.AllowAny]






# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework import permissions

# class ContactProfessionnelViewSet(viewsets.ModelViewSet):
#     queryset = ContactProfessionnel.objects.all().order_by('-created_at')
#     serializer_class = ContactProfessionnelSerializer
    
#     # Forcer explicitement JWT même si settings.py n'est pas bon
#     authentication_classes = [JWTAuthentication]

#     def get_permissions(self):
#         if self.action == 'create':
#             return [permissions.AllowAny()]
#         return [permissions.IsAuthenticated()]
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import ContactProfessionnel
from .serializers import ContactProfessionnelSerializer
import logging

logger = logging.getLogger(__name__)


class ContactProfessionnelViewSet(viewsets.ModelViewSet):
    queryset = ContactProfessionnel.objects.all().order_by('-created_at')
    serializer_class = ContactProfessionnelSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        instance = serializer.save()
        try:
            self._send_emails(instance)
        except Exception as e:
            # L'email échoue mais le message est quand même sauvegardé
            logger.error(f"Erreur envoi email contact pro: {e}")

    def _send_emails(self, instance):
        nom        = instance.nom        or ""
        email      = instance.email      or ""
        entreprise = instance.entreprise or "—"
        poste      = instance.poste      or "—"
        sujet      = instance.sujet      or "—"
        message    = instance.message    or ""

        # ══════════════════════════════
        # 1. Email à l'admin VIALI
        # ══════════════════════════════
        html_admin = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <div style="background:linear-gradient(135deg,#FFC107,#FF8C00);padding:20px;border-radius:8px;margin-bottom:24px;">
            <h2 style="color:white;margin:0;">&#128268; Nouveau contact professionnel</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;font-weight:bold;color:#555;width:130px;">Nom</td><td style="padding:8px;">{nom}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555;">Email</td><td style="padding:8px;"><a href="mailto:{email}">{email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#555;">Entreprise</td><td style="padding:8px;">{entreprise}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#555;">Poste</td><td style="padding:8px;">{poste}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#555;">Sujet</td><td style="padding:8px;">{sujet}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#fff8f0;border-left:4px solid #FF8C00;border-radius:4px;">
            <p style="font-weight:bold;color:#FF8C00;margin:0 0 8px;">Message :</p>
            <p style="margin:0;line-height:1.6;white-space:pre-wrap;">{message}</p>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:{email}?subject=Re: {sujet}"
               style="background:linear-gradient(135deg,#FFC107,#FF8C00);color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
              &#9993; R&#233;pondre &#224; {nom}
            </a>
          </div>
          <p style="margin-top:24px;color:#aaa;font-size:12px;text-align:center;">
            Message re&#231;u depuis le formulaire Espace Professionnel — viali-gn.com
          </p>
        </div>
        """

        try:
            msg_admin = EmailMultiAlternatives(
                subject=f"[Contact Pro] {sujet} — {nom}",
                body=f"Nouveau message de {nom} ({email}) :\n\n{message}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_ADMIN_EMAIL],
                reply_to=[email],
            )
            msg_admin.attach_alternative(html_admin, "text/html")
            msg_admin.send(fail_silently=False)
        except Exception as e:
            logger.error(f"Erreur email admin: {e}")

        # ══════════════════════════════
        # 2. Email de confirmation au prospect
        # ══════════════════════════════
        html_prospect = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <div style="background:linear-gradient(135deg,#FFC107,#FF8C00);padding:20px;border-radius:8px;margin-bottom:24px;">
            <h2 style="color:white;margin:0;">&#10003; Message bien re&#231;u !</h2>
          </div>
          <p style="font-size:16px;">Bonjour <strong>{nom}</strong>,</p>
          <p style="color:#555;line-height:1.7;">
            Merci pour votre message. Notre &#233;quipe l'a bien re&#231;u et vous r&#233;pondra dans les plus brefs d&#233;lais.
          </p>
          <div style="margin:20px 0;padding:16px;background:#fff8f0;border-left:4px solid #FF8C00;border-radius:4px;">
            <p style="font-weight:bold;color:#FF8C00;margin:0 0 12px;">R&#233;capitulatif de votre demande :</p>
            <p style="margin:4px 0;"><strong>Sujet :</strong> {sujet}</p>
            <p style="margin:4px 0;"><strong>Message :</strong></p>
            <p style="margin:4px 0;color:#555;white-space:pre-wrap;">{message}</p>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#888;font-size:13px;line-height:1.6;">
            Cordialement,<br>
            <strong style="color:#333;">L'&#233;quipe VIALI</strong><br>
            <a href="mailto:contact@viali-gn.com" style="color:#FF8C00;">contact@viali-gn.com</a><br>
            <a href="https://www.viali-gn.com" style="color:#FF8C00;">www.viali-gn.com</a>
          </p>
        </div>
        """

        try:
            msg_prospect = EmailMultiAlternatives(
                subject="Votre message a bien été reçu — VIALI",
                body=f"Bonjour {nom},\n\nMerci pour votre message. Notre équipe vous répondra bientôt.\n\nCordialement,\nL'équipe VIALI",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email],
            )
            msg_prospect.attach_alternative(html_prospect, "text/html")
            msg_prospect.send(fail_silently=False)
        except Exception as e:
            logger.error(f"Erreur email prospect: {e}")







from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Q

class GlobalSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        q = request.query_params.get("q", "").strip()
        if len(q) < 2:
            return Response([])

        results = []

        try:
            from .models import (
                SardineProduct, ThonProduct, CapitaineProduct,
                News, Mission, Value, Partner, EquipeMember,
                SardineRecipe, ThonRecipe, Recherche, RecherchePartner
            )

            # ── Sardines produits ──
            for p in SardineProduct.objects.filter(
                Q(title_fr__icontains=q) | Q(title_en__icontains=q) |
                Q(content_fr__icontains=q) | Q(ingredient_fr__icontains=q),
                is_active=True
            )[:3]:
                results.append({"title": p.title_fr or p.title_en, "path": "/rillettes", "type": "Produit Sardine"})

            # ── Thon produits ──
            for p in ThonProduct.objects.filter(
                Q(title_fr__icontains=q) | Q(title_en__icontains=q) |
                Q(content_fr__icontains=q),
                is_active=True
            )[:3]:
                results.append({"title": p.title_fr or p.title_en, "path": "/sauces", "type": "Produit Thon"})

            # ── Capitaine produits ──
            for p in CapitaineProduct.objects.filter(
                Q(title_fr__icontains=q) | Q(title_en__icontains=q) |
                Q(content_fr__icontains=q),
                is_active=True
            )[:3]:
                results.append({"title": p.title_fr or p.title_en, "path": "/sauces", "type": "Produit Capitaine"})

            # ── News ──
            for n in News.objects.filter(
                Q(title_fr__icontains=q) | Q(title_en__icontains=q) |
                Q(content_fr__icontains=q),
                is_active=True
            )[:3]:
                results.append({"title": n.title_fr or n.title_en, "path": "/actualites", "type": "Actualité"})

            # ── Missions ──
            for m in Mission.objects.filter(
                Q(title_fr__icontains=q) | Q(title_en__icontains=q) |
                Q(content_mission_fr__icontains=q) | Q(content_valeur_fr__icontains=q),
                is_active=True
            )[:2]:
                results.append({"title": m.title_fr or m.title_en, "path": "/nosMissions", "type": "Mission"})

            # ── Valeurs ──
            for v in Value.objects.filter(
                Q(title_fr__icontains=q) | Q(title_en__icontains=q) |
                Q(content_fr__icontains=q),
                is_active=True
            )[:2]:
                results.append({"title": v.title_fr or v.title_en, "path": "/nosMissions", "type": "Valeur"})

            # ── Partenaires ──
            for p in Partner.objects.filter(
                Q(name_fr__icontains=q) | Q(name_en__icontains=q),
                is_active=True
            )[:3]:
                results.append({"title": p.name_fr or p.name_en, "path": "/partner", "type": "Partenaire"})

            # ── Équipe ──
            for e in EquipeMember.objects.filter(
                Q(full_name__icontains=q) | Q(position_fr__icontains=q) |
                Q(bio_fr__icontains=q),
                is_active=True
            )[:2]:
                results.append({"title": e.full_name, "path": "/notreEquipe", "type": "Équipe"})

            # ── Recettes Sardine ──
            for r in SardineRecipe.objects.filter(
                Q(title_fr__icontains=q) | Q(title_en__icontains=q),
                is_active=True
            )[:2]:
                results.append({"title": r.title_fr or r.title_en, "path": "/rillettes", "type": "Recette Sardine"})

            # ── Recettes Thon ──
            for r in ThonRecipe.objects.filter(
                Q(title_fr__icontains=q) | Q(title_en__icontains=q),
                is_active=True
            )[:2]:
                results.append({"title": r.title_fr or r.title_en, "path": "/sauces", "type": "Recette Thon"})

            # ── Recherche R&D ──
            for r in Recherche.objects.filter(
                Q(title1_fr__icontains=q) | Q(title2_fr__icontains=q) |
                Q(title3_fr__icontains=q) | Q(content1_fr__icontains=q)
            )[:2]:
                title = r.title1_fr or r.title2_fr or "Recherche & Développement"
                results.append({"title": title, "path": "/professionalArea", "type": "R&D"})

            # ── Partenaires Recherche ──
            for p in RecherchePartner.objects.filter(
                Q(name__icontains=q),
                is_active=True
            )[:2]:
                results.append({"title": p.name, "path": "/professionalArea", "type": "Partenaire R&D"})

        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Search error: {e}")

        return Response(results[:10])


    