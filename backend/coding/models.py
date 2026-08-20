from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CodingProblem(models.Model):
    title = models.CharField(max_length=200)
    topic = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20)
    problem_statement = models.TextField()
    constraints = models.TextField(blank=True, null=True)
    input_format = models.TextField(blank=True, null=True)
    output_format = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class TestCase(models.Model):
    problem = models.ForeignKey(CodingProblem, on_delete=models.CASCADE, related_name='test_cases')
    input_data = models.TextField()
    expected_output = models.TextField()
    is_hidden = models.BooleanField(default=False)

    def __str__(self):
        return f"Test Case for {self.problem.title}"

class CodeSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='code_submissions')
    problem = models.ForeignKey(CodingProblem, on_delete=models.CASCADE, related_name='submissions')
    language = models.CharField(max_length=50)
    code_content = models.TextField()
    status = models.CharField(max_length=50) # e.g., Passed, Failed, Syntax Error
    score = models.IntegerField(default=0)
    ai_feedback = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.problem.title} ({self.status})"
