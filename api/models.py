from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Question(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    starter_code = models.TextField(blank=True)
    max_marks = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Submission(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='submissions')
    code = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(null=True, blank=True)   # for autograding / manual marking

    class Meta:
        # 👇 ensure one submission per student per question
        unique_together = ('student', 'question')

    def __str__(self):
        return f"{self.student.username} - {self.question.title}"
