package com.nomnom.order_service.model;

import com.nomnom.order_service.shared.enums.PotionSize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    private String itemId;
    private String itemName;
    private int quantity;
    private PotionSize potionSize; // New field
    private double price;
    private double totalPrice;
    private String image; // New field

    // Method to recalculate total price
    public void updateTotalPrice() {
        this.totalPrice = this.price * this.quantity;
    }
}