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
