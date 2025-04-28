package com.nomnom.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private String itemId;
    private String itemName;
    private int quantity;
    private PotionSize potionSize;
    private double price;
    private double totalPrice;
    private String image; // New field

    // Enum for PotionSize
    public enum PotionSize {
        Small, Medium, Large
    }
}