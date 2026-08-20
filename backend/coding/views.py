import os
import json
# pyrefly: ignore [missing-import]
import requests
# pyrefly: ignore [missing-import]
from google import genai
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
import random
from .models import CodingProblem, CodeSubmission
from .serializers import CodingProblemSerializer, CodeSubmissionSerializer

class GenerateCodingProblemsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        difficulty = request.data.get('difficulty', 'beginner')
        num_questions = int(request.data.get('num_questions', 2))
        
        existing_titles = list(CodingProblem.objects.filter(difficulty=difficulty).values_list('title', flat=True))
        api_key = os.environ.get("GEMINI_API_KEY", "")
        
        if not api_key:
            return Response({"error": "No API key"}, status=status.HTTP_400_BAD_REQUEST)
            
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
        Generate {num_questions} completely unique coding problems for {difficulty} difficulty level.
        Do NOT generate any problem that is similar to the following titles:
        {existing_titles}
        
        Return ONLY a JSON array of objects with the following keys:
        - "title": (string)
        - "topic": (string)
        - "problem_statement": (string)
        - "input_format": (string)
        - "output_format": (string)
        - "test_cases": (array of exactly 2 objects containing "input_data" and "expected_output" strings)
        
        Ensure randomness using seed {random.randint(1,1000000)}.
        No markdown, just valid JSON array.
        """
        try:
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt,
                config=genai.types.GenerateContentConfig(temperature=0.9)
            )
            text = response.text.strip()
            if text.startswith("```json"): text = text[7:]
            if text.endswith("```"): text = text[:-3]
            problems_data = json.loads(text)
            
            created_problems = []
            from .models import TestCase
            for p in problems_data:
                cp = CodingProblem.objects.create(
                    title=p.get('title', 'Untitled'),
                    topic=p.get('topic', 'General'),
                    difficulty=difficulty,
                    problem_statement=p.get('problem_statement', ''),
                    input_format=p.get('input_format', ''),
                    output_format=p.get('output_format', '')
                )
                test_cases = p.get('test_cases', [])
                for tc in test_cases:
                    TestCase.objects.create(
                        problem=cp,
                        input_data=str(tc.get('input_data', '')),
                        expected_output=str(tc.get('expected_output', ''))
                    )
                created_problems.append(cp)
                
            return Response(CodingProblemSerializer(created_problems, many=True).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CodingProblemListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = CodingProblem.objects.all().order_by('-created_at')
    serializer_class = CodingProblemSerializer


class CodingProblemDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = CodingProblem.objects.all()
    serializer_class = CodingProblemSerializer


def evaluate_code_with_ai(problem, language, code_content):
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", ""))
    prompt = f"""
    Evaluate this code for the problem: "{problem.title}".
    Problem statement: {problem.problem_statement}
    Language: {language}
    Code:
    {code_content}
    
    Provide EXACTLY this JSON structure without markdown formatting or backticks:
    {{
        "status": "<Passed, Failed, or Syntax Error>",
        "score": <0-100>,
        "ai_feedback": "<Detailed feedback on time/space complexity and optimization>"
    }}
    """
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text)
    except Exception as e:
        print("AI Evaluation Error:", e)
        return {
            "status": "Evaluation Failed",
            "score": 0,
            "ai_feedback": "Could not evaluate code."
        }


LANGUAGE_MAPPING = {
    'python': 71,
    'javascript': 63,
    'java': 62,
    'cpp': 54
}


def execute_code_with_judge0(language, code_content, test_cases):
    rapidapi_key = os.environ.get("RAPIDAPI_KEY")
    if not rapidapi_key:
        return {"error": "RAPIDAPI_KEY not set for Judge0 execution"}

    lang_id = LANGUAGE_MAPPING.get(language, 71)
    url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true"
    headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": rapidapi_key,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
    }

    results = []
    for tc in test_cases:
        payload = {
            "language_id": lang_id,
            "source_code": code_content,
            "stdin": tc.input_data,
            "expected_output": tc.expected_output
        }
        try:
            response = requests.post(url, json=payload, headers=headers)
            results.append(response.json())
        except Exception as e:
            print("Judge0 Error:", e)
            results.append({"status": {"description": "Execution Failed"}})

    # Check if all passed
    all_passed = all(
        r.get("status", {}).get("description") == "Accepted" for r in results
    )

    # Get first failed test case output or standard output
    stdout = ""
    compile_output = ""
    for r in results:
        if r.get("status", {}).get("description") != "Accepted":
            stdout = r.get("stdout") or r.get("stderr") or r.get("message") or ""
            compile_output = r.get("compile_output", "")
            break

    if all_passed and results:
        stdout = results[0].get("stdout", "")

    return {
        "all_passed": all_passed,
        "stdout": stdout,
        "compile_output": compile_output
    }


class SubmitCodeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, problem_id):
        problem = get_object_or_404(CodingProblem, id=problem_id)
        language = request.data.get('language')
        code_content = request.data.get('code_content')

        if not language or not code_content:
            return Response(
                {"error": "Language and code content are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        test_cases = problem.test_cases.all()
        judge0_result = execute_code_with_judge0(language, code_content, test_cases)

        if judge0_result.get("error"):
            # Fallback to AI evaluation if Judge0 is not configured
            evaluation = evaluate_code_with_ai(problem, language, code_content)
            status_text = evaluation.get('status', 'Failed')
            score = evaluation.get('score', 0)
            ai_feedback = evaluation.get('ai_feedback', '')
        else:
            # Code was executed via Judge0
            status_text = "Passed" if judge0_result["all_passed"] else "Failed"
            score = 100 if judge0_result["all_passed"] else 0

            # Use Gemini to give qualitative feedback regardless of pass/fail
            evaluation = evaluate_code_with_ai(problem, language, code_content)
            judge_stdout = judge0_result.get('stdout', '')
            judge_compile = judge0_result.get('compile_output', '')
            ai_feedback = (
                f"Judge0 Output: {judge_stdout}\n"
                f"Compile Output: {judge_compile}\n\n"
                f"AI Review:\n{evaluation.get('ai_feedback', '')}"
            )

        submission = CodeSubmission.objects.create(
            user=request.user,
            problem=problem,
            language=language,
            code_content=code_content,
            status=status_text,
            score=score,
            ai_feedback=ai_feedback
        )

        return Response(
            CodeSubmissionSerializer(submission).data,
            status=status.HTTP_201_CREATED
        )
