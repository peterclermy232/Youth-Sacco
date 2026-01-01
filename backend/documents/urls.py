from django.urls import path
from .views import (
    DocumentCategoryListView,
    DocumentListCreateView,
    DocumentDetailView,
    DocumentVerifyView,
    UserDocumentsView
)

urlpatterns = [
    path('categories/', DocumentCategoryListView.as_view(), name='document-categories'),
    path('', DocumentListCreateView.as_view(), name='document-list-create'),
    path('<int:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('<int:pk>/verify/', DocumentVerifyView.as_view(), name='document-verify'),
    path('my-documents/', UserDocumentsView.as_view(), name='user-documents'),
]