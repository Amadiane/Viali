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
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer

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




from rest_framework import viewsets, permissions
from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by("-created_at")
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]  # Ou IsAuthenticated si tu veux sécuriser l'accès




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
    # permission_classes = [permissions.AllowAny]  # called from client

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
