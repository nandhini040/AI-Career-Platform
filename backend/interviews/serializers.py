from rest_framework import serializers
from .models import InterviewSession, InterviewQuestion, InterviewAnswer

class InterviewAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewAnswer
        fields = '__all__'

class InterviewQuestionSerializer(serializers.ModelSerializer):
    answer = InterviewAnswerSerializer(read_only=True)

    class Meta:
        model = InterviewQuestion
        fields = '__all__'

class InterviewSessionSerializer(serializers.ModelSerializer):
    questions = InterviewQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSession
        fields = '__all__'
        read_only_fields = ('user', 'overall_score', 'completed')
