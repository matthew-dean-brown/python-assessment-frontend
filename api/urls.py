from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    me,
    QuestionListView,
    QuestionDetailView,
    SubmissionCreateView,
    MySubmissionsView,
    AllSubmissionsView,  
    SubmissionDetailUpdateView, 
)

urlpatterns = [
    # auth
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/me/", me, name="me"),

    # questions
    path("questions/", QuestionListView.as_view(), name="questions-list"),
    path("questions/<int:pk>/", QuestionDetailView.as_view(), name="questions-detail"),

    # submissions
    path("submissions/", SubmissionCreateView.as_view(), name="submissions-create"),
    path("my-submissions/", MySubmissionsView.as_view(), name="my-submissions"),
    path("submissions/all/", AllSubmissionsView.as_view(), name="submissions-all"),
    path("submissions/<int:pk>/", SubmissionDetailUpdateView.as_view(), name="submission-detail"),

]
