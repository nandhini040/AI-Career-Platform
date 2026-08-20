from django.urls import path
from .views import CodingProblemListView, CodingProblemDetailView, SubmitCodeView, GenerateCodingProblemsView

urlpatterns = [
    path('problems/', CodingProblemListView.as_view(), name='problem-list'),
    path('problems/generate/', GenerateCodingProblemsView.as_view(), name='problem-generate'),
    path('problems/<int:pk>/', CodingProblemDetailView.as_view(), name='problem-detail'),
    path('problems/<int:problem_id>/submit/', SubmitCodeView.as_view(), name='submit-code'),
]
