package com.nomnom.order_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverDetails {
    private String driverId;
    private String driverName;
    private String vehicleNumber;
}