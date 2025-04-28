package com.nomnom.order_service.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {
    private String customerId;
    private String restaurantId;
    private String customerName;
    private String customerContact;
    private double longitude; // Updated field
    private double latitude;  // Updated field
    private String paymentType;
    private DriverDetails driverDetails;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DriverDetails {
        private String driverId;
        private String driverName;
        private String vehicleNumber;
    }
}