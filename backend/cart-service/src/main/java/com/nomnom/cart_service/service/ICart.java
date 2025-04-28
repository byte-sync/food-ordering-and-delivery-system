package com.nomnom.cart_service.service;

import com.nomnom.cart_service.model.Cart;

import java.util.List;

public interface ICart {

    Cart getCart(String customerId, String restaurantId);

    Cart addItemToCart(String customerId, String restaurantId, CartService.CartItemRequest item);

    Cart updateCartItemQuantity(String customerId, String restaurantId, String itemId, int newQuantity);

    Cart removeItemFromCart(String customerId, String restaurantId, String itemId);

    void clearCart(String customerId, String restaurantId);

    List<Cart> getAllCarts();
}