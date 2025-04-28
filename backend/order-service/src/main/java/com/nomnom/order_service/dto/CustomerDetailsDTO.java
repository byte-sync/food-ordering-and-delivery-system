package com.nomnom.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDetailsDTO {
    private String name;
    private String contact;
    private String location;
}