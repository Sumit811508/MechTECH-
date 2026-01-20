from rest_framework import serializers

from django.contrib.auth.models import User
from .models import Garage, RoadsideRequest

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class GarageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garage
        fields = '__all__'


class RoadsideRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadsideRequest
        fields = '__all__'
