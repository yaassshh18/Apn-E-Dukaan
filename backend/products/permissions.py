from rest_framework import permissions

class IsSellerOrAdminOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow sellers of an object or admins to edit/delete it.
    Assumes the model instance has a `seller` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        is_admin = getattr(request.user, 'role', '') == 'ADMIN' or request.user.is_staff
        return obj.seller == request.user or is_admin
