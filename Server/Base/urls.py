from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, LoginView, NewsViewSet, MissionViewSet, ValueViewSet, EquipeMemberViewSet, ProfessionalAreaViewSet
# , ProfessionalAreaViewSet

router = DefaultRouter()
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'missions', MissionViewSet, basename='mission')
router.register(r'values', ValueViewSet, basename='value')
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')
router.register(r'professional-areas', ProfessionalAreaViewSet, basename='professional-area')



urlpatterns = [
    path('', include(router.urls)),
    path("login/", LoginView.as_view(), name="login")
]