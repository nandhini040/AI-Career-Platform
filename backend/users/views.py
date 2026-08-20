import os
import json
# pyrefly: ignore [missing-import]
import PyPDF2
# pyrefly: ignore [missing-import]
from google import genai
from django.contrib.auth import get_user_model
from django.db.models import Avg
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import UserProfile, ResumeAnalysis
from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    UserProfileSerializer,
    ResumeAnalysisSerializer
)
from interviews.models import InterviewAnswer
from coding.models import CodeSubmission

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user.profile


class ResumeUploadView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ResumeAnalysisSerializer

    def post(self, request, *args, **kwargs):
        profile = request.user.profile
        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response(
                {'error': 'No resume provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.resume = resume_file
        profile.save()

        text = ""
        try:
            pdf_reader = PyPDF2.PdfReader(resume_file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        except Exception:
            return Response(
                {'error': 'Could not parse PDF'},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = os.environ.get("GEMINI_API_KEY", "")
        
        if not api_key:
            # Fallback mock data if API key is not configured yet
            data = {
                "resume_score": 82,
                "skill_summary": "Python, React, JavaScript, HTML, CSS (MOCK DATA - Configure GEMINI_API_KEY in .env for real analysis)",
                "missing_skills": "Docker, Kubernetes, AWS, CI/CD",
                "suggested_improvements": "Include more quantified metrics in your experience section. Highlight leadership roles.",
                "suitable_job_roles": "Software Engineer, Full Stack Developer, Frontend Developer"
            }
        else:
            client = genai.Client(api_key=api_key)

            prompt = f"""
            Analyze the following resume and extract the key details in a structured JSON format.
            Resume Text:
            {text[:5000]}
            
            Provide the output EXACTLY in this JSON format without markdown wrapping or backticks:
            {{
                "resume_score": <number between 0 and 100>,
                "skill_summary": "<summary of skills>",
                "missing_skills": "<comma separated missing skills based on general tech roles>",
                "suggested_improvements": "<suggestions>",
                "suitable_job_roles": "<comma separated job roles>"
            }}
            """

            try:
                response = client.models.generate_content(
                    model='gemini-3.5-flash',
                    contents=prompt,
                )
                result_text = response.text.strip()

                if result_text.startswith("```json"):
                    result_text = result_text[7:]
                if result_text.endswith("```"):
                    result_text = result_text[:-3]

                data = json.loads(result_text)
            except Exception as e:
                print("AI Parsing Error:", e)
                return Response(
                    {'error': 'AI processing failed'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        analysis, created = ResumeAnalysis.objects.update_or_create(
            user=request.user,
            defaults={
                'resume_score': data.get('resume_score', 0),
                'skill_summary': data.get('skill_summary', ''),
                'missing_skills': data.get('missing_skills', ''),
                'suggested_improvements': data.get('suggested_improvements', ''),
                'suitable_job_roles': data.get('suitable_job_roles', '')
            }
        )

        return Response(
            ResumeAnalysisSerializer(analysis).data,
            status=status.HTTP_200_OK
        )


class ResumeAnalysisView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ResumeAnalysisSerializer

    def get_object(self):
        try:
            return self.request.user.resume_analysis
        except ResumeAnalysis.DoesNotExist:
            return None


class AnalyticsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user

        interview_answers = InterviewAnswer.objects.filter(question__session__user=user)
        avg_int_score = interview_answers.aggregate(Avg('score'))['score__avg'] or 0
        total_interviews = interview_answers.values('question__session').distinct().count()

        coding_submissions = CodeSubmission.objects.filter(user=user)
        avg_cod_score = coding_submissions.aggregate(Avg('score'))['score__avg'] or 0
        total_coding_problems = coding_submissions.values('problem').distinct().count()

        recent_ints = list(
            interview_answers.order_by('-submitted_at')[:5].values('submitted_at', 'score')
        )
        recent_cods = list(
            coding_submissions.order_by('-submitted_at')[:5].values('submitted_at', 'score')
        )

        # Reverse them so oldest is first for charting
        recent_ints.reverse()
        recent_cods.reverse()

        interview_chart_data = [
            {"name": f"Q{i+1}", "score": item['score']}
            for i, item in enumerate(recent_ints)
        ]
        coding_chart_data = [
            {"name": f"Sub {i+1}", "score": item['score']}
            for i, item in enumerate(recent_cods)
        ]

        return Response({
            "summary": {
                "avg_interview_score": round(avg_int_score, 1),
                "total_interviews": total_interviews,
                "avg_coding_score": round(avg_cod_score, 1),
                "total_coding_problems": total_coding_problems
            },
            "interview_chart_data": interview_chart_data,
            "coding_chart_data": coding_chart_data
        })
