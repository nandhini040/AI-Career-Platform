from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, UserProfileView, ResumeUploadView, ResumeAnalysisView, AnalyticsView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('resume/upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('resume/analysis/', ResumeAnalysisView.as_view(), name='resume-analysis'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]
