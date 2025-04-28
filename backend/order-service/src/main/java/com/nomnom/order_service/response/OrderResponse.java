package com.nomnom.order_service.response;

import com.nomnom.order_service.dto.OrderDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private String message;
    private OrderDTO order;
}