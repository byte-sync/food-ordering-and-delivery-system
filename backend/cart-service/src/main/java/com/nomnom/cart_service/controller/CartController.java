package com.nomnom.cart_service.controller;

import com.nomnom.cart_service.dto.CartDTO;
import com.nomnom.cart_service.model.Cart;
import com.nomnom.cart_service.request.AddItemToCartRequest;
import com.nomnom.cart_service.response.CartResponse;
import com.nomnom.cart_service.service.ICart;
import com.nomnom.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {

    private final ICart cartService;

    @GetMapping("/{customerId}/{restaurantId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable String customerId, @PathVariable String restaurantId) {
        return ResponseEntity.ok(mapToCartDTO(cartService.getCart(customerId, restaurantId)));
    }

    @PostMapping("/add/{customerId}/{restaurantId}")
    public ResponseEntity<CartDTO> addItemToCart(
            @PathVariable String customerId,
            @PathVariable String restaurantId,
            @RequestBody AddItemToCartRequest request) {
        try {
            // Validate potion size
            if (request.getPotionSize() == null) {
                throw new IllegalArgumentException("Invalid potion size");
            }

            CartService.CartItemRequest cartItemRequest = new CartService.CartItemRequest();
            cartItemRequest.setItemId(request.getItemId());
            cartItemRequest.setItemName(request.getItemName());
            cartItemRequest.setQuantity(request.getQuantity());
            cartItemRequest.setPotionSize(request.getPotionSize());
            cartItemRequest.setUnitPrice(request.getUnitPrice());
            cartItemRequest.setImage(request.getImage());

            return ResponseEntity.ok(mapToCartDTO(cartService.addItemToCart(customerId, restaurantId, cartItemRequest)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/update/{customerId}/{restaurantId}/{itemId}")
    public ResponseEntity<Cart> updateCartItemQuantity(
            @PathVariable String customerId,
            @PathVariable String restaurantId,
            @PathVariable String itemId,
            @RequestBody Map<String, Integer> requestBody
    ) {
        int newQuantity = requestBody.get("newQuantity");
        Cart updatedCart = cartService.updateCartItemQuantity(customerId, restaurantId, itemId, newQuantity);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/remove/{customerId}/{restaurantId}/{itemId}")
    public ResponseEntity<Void> removeItemFromCart(
            @PathVariable String customerId,
            @PathVariable String restaurantId,
            @PathVariable String itemId) {
        cartService.removeItemFromCart(customerId, restaurantId, itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear/{customerId}/{restaurantId}")
    public ResponseEntity<Void> clearCart(@PathVariable String customerId, @PathVariable String restaurantId) {
        cartService.clearCart(customerId, restaurantId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<CartDTO>> getAllCarts(){
        List<CartDTO> cartDTOs = cartService.getAllCarts().stream()
                .map(this::mapToCartDTO)
                .toList();
        return ResponseEntity.ok(cartDTOs);
    }


    private CartDTO mapToCartDTO(com.nomnom.cart_service.model.Cart cart) {
        return new CartDTO(
                cart.getId(),
                cart.getCustomerId(),
                cart.getRestaurantId(),
                cart.getItems().stream().map(item -> new CartDTO.CartItemDTO(
                        item.getItemId(),
                        item.getItemName(),
                        item.getQuantity(),
                        item.getPotionSize() != null ? CartDTO.CartItemDTO.PotionSize.valueOf(item.getPotionSize().name()) : null, // Map potion size
                        item.getPrice(),
                        item.getTotalPrice(),
                        item.getImage()
                )).toList(),
                cart.getTotalPrice(),
                cart.getCreatedAt(),
                cart.getUpdatedAt()
        );
    }
}