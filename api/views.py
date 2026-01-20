from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Garage, RoadsideRequest
from .serializers import RegisterSerializer, GarageSerializer, RoadsideRequestSerializer
from math import radians, cos, sin, asin, sqrt

# Register
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key})
    return Response(serializer.errors, status=400)


# Login
@api_view(['POST'])
def login_user(request):
    user = authenticate(
        username=request.data.get('username'),
        password=request.data.get('password')
    )

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})

    return Response({"error": "Invalid credentials"}, status=401)


# Add Garage
@api_view(['POST'])
def add_garage(request):
    serializer = GarageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


# List garages
@api_view(['GET'])
def list_garages(request):
    garages = Garage.objects.all()
    serializer = GarageSerializer(garages, many=True)
    return Response(serializer.data)


# Distance calculation
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c


# Nearest garages
@api_view(['GET'])
def nearest_garages(request):
    user_lat = float(request.GET.get('lat'))
    user_lon = float(request.GET.get('lon'))

    garages = Garage.objects.all()
    result = []

    for g in garages:
        distance = haversine(user_lat, user_lon, g.latitude, g.longitude)
        result.append({
            "name": g.name,
            "distance_km": round(distance, 2)
        })

    result.sort(key=lambda x: x['distance_km'])
    return Response(result)


# Roadside request
@api_view(['POST'])
def request_roadside(request):
    serializer = RoadsideRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
