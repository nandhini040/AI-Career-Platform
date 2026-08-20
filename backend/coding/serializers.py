from rest_framework import serializers
from .models import CodingProblem, TestCase, CodeSubmission

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        exclude = ('expected_output',) 

class CodingProblemSerializer(serializers.ModelSerializer):
    test_cases = serializers.SerializerMethodField()

    class Meta:
        model = CodingProblem
        fields = '__all__'
    
    def get_test_cases(self, obj):
        test_cases = obj.test_cases.filter(is_hidden=False)
        return TestCaseSerializer(test_cases, many=True).data

class CodeSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSubmission
        fields = '__all__'
        read_only_fields = ('user', 'status', 'score', 'ai_feedback')
