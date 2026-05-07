from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Customer, Restaurant, Item, Cart


class CustomModelAdmin(ModelAdmin):
    """Custom admin with professional CSS styling"""
    class Media:
        css = {
            'all': ('delivery/admin_custom.css',)
        }


class CustomerAdmin(CustomModelAdmin):
    list_display = ('username', 'email', 'mobile', 'address')
    search_fields = ('username', 'email', 'mobile')
    list_filter = ('email',)


class RestaurantAdmin(CustomModelAdmin):
    list_display = ('name', 'cuisine', 'rating')
    search_fields = ('name', 'cuisine')
    list_filter = ('cuisine', 'rating')
    ordering = ('-rating',)


class ItemAdmin(CustomModelAdmin):
    list_display = ('name', 'restaurant', 'price', 'vegeterian')
    search_fields = ('name', 'description')
    list_filter = ('restaurant', 'vegeterian')
    ordering = ('restaurant',)


class CartAdmin(CustomModelAdmin):
    list_display = ('customer', 'total_price')
    search_fields = ('customer__username',)
    list_filter = ('customer',)
    readonly_fields = ('total_price',)


# Register models with custom admin
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Restaurant, RestaurantAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(Cart, CartAdmin)