from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError

from .models import Question, Submission
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    QuestionSerializer,
    SubmissionSerializer,
)

# ---------- Auth ----------

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# ---------- Questions ----------

class QuestionListView(generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class QuestionDetailView(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


# ---------- Submissions ----------

class SubmissionCreateView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        student = self.request.user
        question = serializer.validated_data["question"]

        # 👇 Check if this student already submitted for this question
        exists = Submission.objects.filter(student=student, question=question).exists()
        if exists:
            raise ValidationError("You have already submitted an answer for this question.")

        serializer.save(student=student)


class MySubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Submission.objects.filter(student=self.request.user).order_by("-created_at")
        question_id = self.request.query_params.get("question")
        if question_id:
            qs = qs.filter(question_id=question_id)
        return qs

class AllSubmissionsView(generics.ListAPIView):
    queryset = Submission.objects.select_related("student", "question").order_by("-created_at")
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]  # later you can change to IsAdminUser

class SubmissionDetailUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Submission.objects.select_related("student", "question")
    serializer_class = SubmissionSerializer
    # for now: only admin/staff can edit marks
    permission_classes = [permissions.IsAdminUser]