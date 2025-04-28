package com.nomnom.order_service.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplyDiscountRequest {
    private double discountAmount;
}