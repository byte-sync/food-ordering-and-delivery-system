package com.nomnom.cart_service.response;

import com.nomnom.cart_service.dto.CartDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private String message;
    private CartDTO cart;
}