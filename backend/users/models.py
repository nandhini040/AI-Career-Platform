from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student/Candidate'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return self.username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True) # Could be many-to-many with Skill model, using simple TextField for now to keep it simple, or JSONField
    programming_languages = models.TextField(blank=True, null=True)
    experience_level = models.CharField(max_length=50, blank=True, null=True)
    target_job_role = models.CharField(max_length=100, blank=True, null=True)
    preferred_companies = models.TextField(blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class ResumeAnalysis(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='resume_analysis')
    resume_score = models.IntegerField(default=0)
    skill_summary = models.TextField(blank=True, null=True)
    missing_skills = models.TextField(blank=True, null=True)
    suggested_improvements = models.TextField(blank=True, null=True)
    suitable_job_roles = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resume Analysis for {self.user.username}"

