from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('profile').all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    filterset_fields = ['is_active']
    ordering_fields = ['username', 'date_joined']
    ordering = ['username']

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def perform_create(self, serializer):
        user = serializer.save()

        # 'password' is not in UserSerializer fields, so we set it explicitly.
        password = self.request.data.get('password')
        if password:
            user.set_password(password)
            user.save()

        # Create profile with role and department.
        role = self.request.data.get('role', 'viewer')
        profile_data = self.request.data.get('profile', {})
        department = profile_data.get('department', '') if isinstance(profile_data, dict) else ''
        UserProfile.objects.get_or_create(user=user, defaults={'role': role, 'department': department})

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Hash new password if provided.
        password = request.data.get('password')
        if password:
            user.set_password(password)
            user.save()

        # role and department live on UserProfile, not on User —
        # the serializer's role is SerializerMethodField (read-only),
        # so we update the profile explicitly here.
        profile_updates = {}
        role = request.data.get('role')
        profile_data = request.data.get('profile')

        if role:
            profile_updates['role'] = role
        if isinstance(profile_data, dict) and 'department' in profile_data:
            profile_updates['department'] = profile_data['department']

        if profile_updates:
            profile, _ = UserProfile.objects.get_or_create(user=user)
            for key, value in profile_updates.items():
                setattr(profile, key, value)
            profile.save()

        return Response(self.get_serializer(user).data)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.select_related('user').all()
    serializer_class = UserProfileSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username', 'department', 'phone']
    filterset_fields = ['role', 'department']
    ordering_fields = ['role', 'department']
