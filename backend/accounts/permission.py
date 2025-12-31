
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users to access the view.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow users to access their own data or admins to access all data.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can access all objects
        if request.user.role == 'ADMIN':
            return True
        
        # Check if the object has a 'member' or 'user' attribute
        if hasattr(obj, 'member'):
            return obj.member == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Default: object is the user itself
        return obj == request.user


class IsMemberOwner(permissions.BasePermission):
    """
    Custom permission to only allow members to access their own data.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Members can only access their own data
        if hasattr(obj, 'member'):
            return obj.member == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user