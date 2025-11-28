from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, LoginView, NewsViewSet, MissionViewSet, ValueViewSet, EquipeMemberViewSet, ProfessionalAreaViewSet, SardineRecipeViewSet,ThonRecipeViewSet, SardineProductViewSet, ThonProductViewSet, ContactViewSet, CommunityViewSet, NewsletterViewSet, TrackEventView, TrackStatsView

router = DefaultRouter()
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'missions', MissionViewSet, basename='mission')
router.register(r'values', ValueViewSet, basename='value')
router.register(r'equipe-members', EquipeMemberViewSet, basename='equipe_member')
router.register(r'professional-areas', ProfessionalAreaViewSet, basename='professional-area')
router.register(r"sardine-recipes", SardineRecipeViewSet, basename="sardine-recipes")
router.register(r'thon-recipes', ThonRecipeViewSet, basename='thon-recipe')
router.register(r"sardine-products", SardineProductViewSet, basename="sardineproduct")
router.register(r"thon-products", ThonProductViewSet, basename="thonproduct")
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r"community", CommunityViewSet, basename="community")
router.register("newsletter", NewsletterViewSet, basename="newsletter")




urlpatterns = [
    path('', include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path("track/", TrackEventView.as_view(), name="api-track"),
    path("track/stats/", TrackStatsView.as_view(), name="api-track-stats"),
    
    
]