package com.nomnom.order_service.dto;

import com.nomnom.order_service.model.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private String orderId;
    private String customerId;
    private String restaurantId;
    private CustomerDetailsDTO customerDetails;
    private List<CartItemDTO> cartItems;
    private double orderTotal;
    private double deliveryFee;
    private double totalAmount;
    private String paymentType;
    private String orderStatus;
    private DriverDetailsDTO driverDetails;
    private Date createdAt;
    private Date updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CustomerDetailsDTO {
        private String name;
        private String contact;
        private double longitude; // New field
        private double latitude;  // New field
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CartItemDTO {
        private String itemId;
        private String itemName;
        private int quantity;
        private PotionSize potionSize; // New field
        private double price;
        private double totalPrice;
        private String image; // New field

        // Enum for PotionSize
        public enum PotionSize {
            Small, Medium, Large
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DriverDetailsDTO {
        private String driverId;
        private String driverName;
        private String vehicleNumber;
    }
}