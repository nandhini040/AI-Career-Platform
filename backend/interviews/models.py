from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class InterviewSession(models.Model):
    INTERVIEW_TYPES = (
        ('technical', 'Technical Interview'),
        ('hr', 'HR Interview'),
        ('behavioral', 'Behavioral Interview'),
    )
    DIFFICULTY_LEVELS = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interviews')
    job_role = models.CharField(max_length=100)
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    technology = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    overall_score = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.job_role} ({self.created_at.date()})"

class InterviewQuestion(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    order = models.IntegerField(default=1)

    def __str__(self):
        return self.question_text[:50]

class InterviewAnswer(models.Model):
    question = models.OneToOneField(InterviewQuestion, on_delete=models.CASCADE, related_name='answer')
    answer_text = models.TextField()
    audio_file = models.FileField(upload_to='answers/audio/', blank=True, null=True)
    score = models.IntegerField(default=0)
    feedback_strengths = models.TextField(blank=True, null=True)
    feedback_improvements = models.TextField(blank=True, null=True)
    ideal_answer = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer to: {self.question.question_text[:30]}"
