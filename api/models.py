from django.db import models
from django.contrib.auth.models import User

class Garage(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name


class RoadsideRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=200)
    problem = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

