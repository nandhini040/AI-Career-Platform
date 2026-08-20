from coding.models import CodingProblem, TestCase

problems = [
    {
        "title": "Reverse a String",
        "topic": "Strings",
        "difficulty": "beginner",
        "problem_statement": "Write a function that reverses a string. The input string is given as an array of characters.",
        "input_format": "A single string representing the text to reverse.",
        "output_format": "A single string which is the reversed version of the input."
    },
    {
        "title": "Find Maximum in Array",
        "topic": "Arrays",
        "difficulty": "beginner",
        "problem_statement": "Given an array of integers, find the maximum element in the array.",
        "input_format": "A list of integers.",
        "output_format": "A single integer which is the maximum."
    },
    {
        "title": "Two Sum",
        "topic": "Arrays / Hash Table",
        "difficulty": "medium",
        "problem_statement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "input_format": "First line contains array of integers. Second line contains target.",
        "output_format": "Indices of the two numbers."
    },
    {
        "title": "Valid Palindrome",
        "topic": "Strings",
        "difficulty": "medium",
        "problem_statement": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
        "input_format": "A string containing alphanumeric characters and spaces.",
        "output_format": "True or False."
    },
    {
        "title": "Merge K Sorted Lists",
        "topic": "Linked Lists / Heap",
        "difficulty": "advanced",
        "problem_statement": "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        "input_format": "K sorted lists.",
        "output_format": "One single sorted list."
    },
    {
        "title": "Trapping Rain Water",
        "topic": "Dynamic Programming / Two Pointers",
        "difficulty": "advanced",
        "problem_statement": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        "input_format": "Array of integers representing heights.",
        "output_format": "Total units of trapped water."
    }
]

for p in problems:
    CodingProblem.objects.get_or_create(
        title=p['title'],
        defaults={
            'topic': p['topic'],
            'difficulty': p['difficulty'],
            'problem_statement': p['problem_statement'],
            'input_format': p['input_format'],
            'output_format': p['output_format']
        }
    )

print("Database seeded with coding problems!")
