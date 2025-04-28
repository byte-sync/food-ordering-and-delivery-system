package com.nomnom.order_service.controller;

import com.nomnom.order_service.dto.OrderDTO;
import com.nomnom.order_service.request.*;
import com.nomnom.order_service.response.*;
import com.nomnom.order_service.service.IOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final IOrderService orderService;

    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<CancelOrderResponse> cancelOrder(@PathVariable String orderId) {
        orderService.cancelOrder(orderId);
        OrderDTO updatedOrder = orderService.getOrderById(orderId);
        CancelOrderResponse response = new CancelOrderResponse("Order has been successfully canceled", updatedOrder);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/assign-driver/{orderId}")
    public ResponseEntity<AssignDriverResponse> assignDriver(@PathVariable String orderId, @RequestBody AssignDriverRequest request) {
        orderService.assignDriver(orderId, request);
        OrderDTO updatedOrder = orderService.getOrderById(orderId);
        AssignDriverResponse response = new AssignDriverResponse("Driver has been successfully assigned to the order", updatedOrder);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/apply-discount/{orderId}")
    public ResponseEntity<ApplyDiscountResponse> applyDiscount(@PathVariable String orderId, @RequestBody ApplyDiscountRequest request) {
        orderService.applyDiscount(orderId, request);
        OrderDTO updatedOrder = orderService.getOrderById(orderId);
        ApplyDiscountResponse response = new ApplyDiscountResponse("Discount has been successfully applied to the order", updatedOrder);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-status/{orderId}")
    public ResponseEntity<UpdateOrderStatusResponse> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
        OrderDTO updatedOrder = orderService.getOrderById(orderId);
        UpdateOrderStatusResponse response = new UpdateOrderStatusResponse("Order status has been successfully updated", updatedOrder);
        return ResponseEntity.ok(response);
    }
}