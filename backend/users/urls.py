from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserProfileViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='userprofile')

urlpatterns = router.urls
