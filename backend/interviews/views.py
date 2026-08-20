from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
import random
from .models import InterviewSession, InterviewQuestion, InterviewAnswer
from .serializers import InterviewSessionSerializer, InterviewQuestionSerializer, InterviewAnswerSerializer
from google import genai
import os
import json

def generate_ai_questions(role, tech, difficulty, interview_type="technical", user=None, num_questions=5):
    api_key = os.environ.get("GEMINI_API_KEY", "")
    
    # Random fallback questions
    fallback_qs = [
        f"Tell me about your experience with {tech}?",
        f"How do you handle debugging in {role}?", 
        "What is your greatest strength?",
        f"Can you explain a complex project you built using {tech}?",
        f"What are the best practices for a {role}?"
    ]
    random.shuffle(fallback_qs)

    if not api_key:
        return fallback_qs[:num_questions]
        
    previous_questions_context = ""
    if user:
        prev_qs = InterviewQuestion.objects.filter(
            session__user=user,
            session__job_role=role,
            session__technology=tech
        ).values_list('question_text', flat=True).order_by('-id')[:20]
        
        if prev_qs:
            previous_questions_context = f"\nIMPORTANT: DO NOT generate any of these exact questions. The user has already seen them:\n" + "\n".join(list(prev_qs))
        
    try:
        client = genai.Client(api_key=api_key)
        prompt = f"""
        Generate {num_questions} {interview_type} interview questions for a {role} focusing on {tech} at a {difficulty} difficulty level.
        Ensure the questions are highly unique, randomized, and different from typical boilerplate questions. 
        Random Seed: {random.randint(1, 1000000)}
        {previous_questions_context}
        
        Return ONLY a JSON array of strings containing the questions.
        Example: ["Question 1?", "Question 2?"]
        """
        response = client.models.generate_content(
            model='gemini-3.5-flash', 
            contents=prompt,
            config=genai.types.GenerateContentConfig(temperature=0.9)
        )
        text = response.text.strip()
        if text.startswith("```json"): text = text[7:]
        if text.endswith("```"): text = text[:-3]
        return json.loads(text)
    except Exception as e:
        print("AI Error:", e)
        return [f"Tell me about your experience with {tech}?", "What is your greatest strength?"]

def evaluate_ai_answer(question_text, answer_text):
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        if len(answer_text.strip()) < 15:
            return {
                "score": 10,
                "feedback_strengths": "None identified.",
                "feedback_improvements": "Your answer is too short or appears to be random letters. Please provide a detailed and thoughtful response.",
                "ideal_answer": "A comprehensive explanation covering the core concepts of the question."
            }
        return {
            "score": 75,
            "feedback_strengths": "Good effort in providing a detailed response.",
            "feedback_improvements": "(MOCK AI) To get a real, dynamic AI evaluation of your answer, please configure your GEMINI_API_KEY in the backend .env file.",
            "ideal_answer": "This is a placeholder ideal answer. Add your API key for real AI-generated model answers."
        }
        
    try:
        client = genai.Client(api_key=api_key)
        prompt = f"""
        Evaluate the following interview answer based on technical correctness, relevance, and completeness.
        Question: {question_text}
        Answer: {answer_text}
        
        Provide the output EXACTLY in this JSON format:
        {{
            "score": <0-100>,
            "feedback_strengths": "<what was good>",
            "feedback_improvements": "<what to improve>",
            "ideal_answer": "<a concise model answer>"
        }}
        """
        response = client.models.generate_content(model='gemini-3.5-flash', contents=prompt)
        text = response.text.strip()
        if text.startswith("```json"): text = text[7:]
        if text.endswith("```"): text = text[:-3]
        return json.loads(text)
    except Exception as e:
        print("AI Error:", e)
        return {"score": 50, "feedback_strengths": "Good effort.", "feedback_improvements": "Could be more detailed.", "ideal_answer": "Standard answer."}

class InterviewSessionListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = InterviewSessionSerializer

    def get_queryset(self):
        return InterviewSession.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        session = serializer.save(user=self.request.user)
        # Generate questions
        questions = generate_ai_questions(session.job_role, session.technology, session.difficulty, session.interview_type, user=self.request.user)
        for i, q_text in enumerate(questions):
            InterviewQuestion.objects.create(session=session, question_text=q_text, order=i+1)

class InterviewSessionDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = InterviewSessionSerializer
    
    def get_queryset(self):
        return InterviewSession.objects.filter(user=self.request.user)

class SubmitAnswerView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, question_id):
        question = get_object_or_404(InterviewQuestion, id=question_id, session__user=request.user)
        answer_text = request.data.get('answer_text', '')
        
        if not answer_text:
            return Response({'error': 'Answer text is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        evaluation = evaluate_ai_answer(question.question_text, answer_text)
        
        answer, created = InterviewAnswer.objects.update_or_create(
            question=question,
            defaults={
                'answer_text': answer_text,
                'score': evaluation.get('score', 0),
                'feedback_strengths': evaluation.get('feedback_strengths', ''),
                'feedback_improvements': evaluation.get('feedback_improvements', ''),
                'ideal_answer': evaluation.get('ideal_answer', '')
            }
        )
        
        return Response(InterviewAnswerSerializer(answer).data, status=status.HTTP_200_OK)

