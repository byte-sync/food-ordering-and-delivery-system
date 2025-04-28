package com.nomnom.cart_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "carts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cart {

    @Id
    private String id;
    private String customerId;
    private String restaurantId;
    private List<CartItem> items = new ArrayList<>();
    private double totalPrice;
    private Date createdAt = new Date();
    private Date updatedAt = new Date();

    // Helper method to recalculate the total price of the cart
    public void recalculateTotalPrice() {
        this.totalPrice = items.stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
    }
}