from rest_framework.routers import DefaultRouter
from .views import DecommissionViewSet

router = DefaultRouter()
router.register(r'', DecommissionViewSet, basename='decommission')

urlpatterns = router.urls
