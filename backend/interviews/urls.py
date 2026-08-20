from django.urls import path
from .views import InterviewSessionListCreateView, InterviewSessionDetailView, SubmitAnswerView

urlpatterns = [
    path('sessions/', InterviewSessionListCreateView.as_view(), name='session-list'),
    path('sessions/<int:pk>/', InterviewSessionDetailView.as_view(), name='session-detail'),
    path('question/<int:question_id>/answer/', SubmitAnswerView.as_view(), name='submit-answer'),
]
