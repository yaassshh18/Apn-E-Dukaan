import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Category
from users.models import User

def seed():
    print("Seeding Categories...")
    categories = [
        ("Electronics", "electronics"),
        ("Fashion & Clothing", "fashion"),
        ("Home & Garden", "home-garden"),
        ("Vehicles", "vehicles"),
        ("Toys & Games", "toys-games"),
        ("Handmade Crafts", "handmade"),
    ]
    for name, slug in categories:
        Category.objects.get_or_create(name=name, slug=slug)

    print("Checking Admin User...")
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin_password')
        print("Created superuser: admin / admin_password")

    print("Database seeding complete!")

if __name__ == '__main__':
    seed()
