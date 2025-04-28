package com.nomnom.order_service.service;

import com.nomnom.order_service.dto.OrderDTO;
import com.nomnom.order_service.request.CreateOrderRequest;
import com.nomnom.order_service.request.ApplyDiscountRequest;
import com.nomnom.order_service.request.AssignDriverRequest;

import java.util.List;


public interface IOrderService {
    OrderDTO createOrder(CreateOrderRequest request);
    OrderDTO getOrderById(String orderId);
    void updateOrderStatus(String orderId, String status);
    List<OrderDTO> getAllOrders();
    List<OrderDTO> getOrdersByCustomer(String customerId);
    void cancelOrder(String orderId);
    void assignDriver(String orderId, AssignDriverRequest request);
    void applyDiscount(String orderId, ApplyDiscountRequest request);

}