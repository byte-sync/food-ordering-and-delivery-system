package com.nomnom.cart_service.model;

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
    public enum PotionSize {
        Small, Medium, Large
    }
    private PotionSize potionSize;
    private double price;
    private double totalPrice;
    private String image; // New field for the image URL

    // Constructor with all fields, including the new `image` field
    public CartItem(String itemId, String itemName, int quantity, PotionSize potionSize, double price, String image) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.quantity = quantity;
        this.potionSize = potionSize;
        this.price = price;
        this.image = image; // Set the image URL
        this.updateTotalPrice(); // Recalculate total price
    }

    // Method to recalculate the total price
    public void updateTotalPrice() {
        this.totalPrice = this.price * this.quantity;
    }
}