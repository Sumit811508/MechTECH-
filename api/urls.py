from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register_user),
    path('login/', login_user),
    path('garage/add/', add_garage),
    path('garages/', list_garages),
    path('garages/nearest/', nearest_garages),
    path('roadside/', request_roadside),
]
