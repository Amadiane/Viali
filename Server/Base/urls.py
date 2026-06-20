from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (PartnerViewSet, LoginView, NewsViewSet, MissionViewSet, ValueViewSet, EquipeMemberViewSet, ProfessionalAreaViewSet, 
SardineRecipeViewSet,ThonRecipeViewSet, SardineProductViewSet, CommunityViewSet, NewsletterViewSet, TrackEventView, 
TrackStatsView, partner_history,ContactListCreateView, ContactReplyView, RechercheViewSet, RecherchePartnerViewSet,
ContactProfessionnelViewSet, GlobalSearchView, GammePageListCreateView, GammePageDetailView, RillettePageListCreateView, RillettePageDetailView,
ThonProductListCreateView, ThonProductRetrieveUpdateDestroyView,CapitaineProductListCreateView, CapitaineProductRetrieveUpdateDestroyView,)


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
# router.register(r"thon-products", ThonProductViewSet, basename="thonproduct")
# router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r"community", CommunityViewSet, basename="community")
router.register("newsletter", NewsletterViewSet, basename="newsletter")
router.register("recherche", RechercheViewSet, basename="recherche")
# router.register(r'capitaine-products', CapitaineProductViewSet, basename='capitaine-product')
router.register(r'recherche-partners', RecherchePartnerViewSet, basename='recherche-partner')
router.register(r'contact-professionnel', ContactProfessionnelViewSet, basename='contact-professionnel')



urlpatterns = [

    path('partners/<int:partner_id>/history/', partner_history, name='partner-history'),

    path('', include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path("track/", TrackEventView.as_view(), name="api-track"),
    path("track/stats/", TrackStatsView.as_view(), name="api-track-stats"),
    path("contacts/", ContactListCreateView.as_view(), name="contact-list-create"),
    path("search/", GlobalSearchView.as_view(), name="global-search"),

    path("contacts/<int:pk>/reply/", ContactReplyView.as_view(), name="contact-reply"),
    path("gammes/",          GammePageListCreateView.as_view(), name="gamme-list"),
    path("gammes/<int:pk>/", GammePageDetailView.as_view(),     name="gamme-detail"),
    path("rillettes-page/",          RillettePageListCreateView.as_view(), name="rillette-page-list"),
    path("rillettes-page/<int:pk>/", RillettePageDetailView.as_view(),     name="rillette-page-detail"),   
    path("thon-products/", ThonProductListCreateView.as_view(), name="thon-product-list"),
    path("thon-products/<int:pk>/", ThonProductRetrieveUpdateDestroyView.as_view(), name="thon-product-detail"),
 
    # Capitaine
    path("capitaine-products/", CapitaineProductListCreateView.as_view(), name="capitaine-product-list"),
    path("capitaine-products/<int:pk>/", CapitaineProductRetrieveUpdateDestroyView.as_view(), name="capitaine-product-detail"),
]


