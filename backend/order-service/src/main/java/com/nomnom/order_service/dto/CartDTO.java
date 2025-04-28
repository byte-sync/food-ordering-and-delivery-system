package com.nomnom.order_service.dto;

import com.nomnom.order_service.shared.enums.PotionSize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    private String id;
    private String customerId;
    private String restaurantId;
    private List<CartItemDTO> items;
    private double totalPrice;
    private Date createdAt;
    private Date updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartItemDTO {
        private String itemId;
        private String itemName;
        private int quantity;
        private PotionSize potionSize;
        private double price;
        private double totalPrice;
        private String image; // New field

    }
}