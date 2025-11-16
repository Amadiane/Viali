from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, LoginView

router = DefaultRouter()
router.register(r'partners', PartnerViewSet, basename='partner')


urlpatterns = [
    path('', include(router.urls)),
    path("login/", LoginView.as_view(), name="login")
]