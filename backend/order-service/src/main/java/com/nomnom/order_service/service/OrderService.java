package com.nomnom.order_service.service;

import com.nomnom.order_service.dto.CartDTO;
import com.nomnom.order_service.dto.CartItemDTO;
import com.nomnom.order_service.dto.OrderDTO;
import com.nomnom.order_service.model.Order;
import com.nomnom.order_service.repository.OrderRepository;
import com.nomnom.order_service.request.*;
import com.nomnom.order_service.shared.enums.PotionSize;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.nomnom.order_service.shared.enums.PotionSize.*;

@Service
public class OrderService implements IOrderService {

    @Value("${cart.service.url}")
    private String cartServiceUrl;

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    public OrderService(OrderRepository orderRepository, RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public OrderDTO createOrder(CreateOrderRequest request) {
        // Fetch cart items from Cart Service
        String cartUrl = cartServiceUrl + "/" + request.getCustomerId() + "/" + request.getRestaurantId();
        ResponseEntity<CartDTO> response = restTemplate.getForEntity(cartUrl, CartDTO.class);
        if (response.getBody() == null || response.getBody().getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        CartDTO cartDTO = response.getBody();

        // Calculate order total
        double orderTotal = cartDTO.getItems().stream()
                .mapToDouble(item -> item.getTotalPrice())
                .sum();

        // Create order
        Order order = new Order();
        order.setOrderId(UUID.randomUUID().toString());
        order.setCustomerId(request.getCustomerId());
        order.setRestaurantId(request.getRestaurantId());
        order.setCustomerDetails(new Order.CustomerDetails(
                request.getCustomerName(),
                request.getCustomerContact(),
                request.getLongitude(), // Updated field
                request.getLatitude()   // Updated field
        ));
        order.setCartItems(cartDTO.getItems().stream()
                .map(item -> new Order.CartItem(
                        item.getItemId(),
                        item.getItemName(),
                        item.getQuantity(),
                        mapPotionSize(item.getPotionSize()), // Map PotionSize
                        item.getPrice(),
                        item.getTotalPrice(),
                        item.getImage()
                )).toList());
        order.setOrderTotal(orderTotal);
        order.setDeliveryFee(5.0); // Example fixed delivery fee
        order.setTotalAmount(orderTotal + 5.0);
        order.setPaymentType(request.getPaymentType());
        order.setOrderStatus("Pending");

        // Map driver details
        if (request.getDriverDetails() != null) {
            order.setDriverDetails(new Order.DriverDetails(
                    request.getDriverDetails().getDriverId(),
                    request.getDriverDetails().getDriverName(),
                    request.getDriverDetails().getVehicleNumber()
            ));
        }
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());

        // Save order
        Order savedOrder = orderRepository.save(order);
        return mapToOrderDTO(savedOrder);
    }

    private Order.CartItem.PotionSize mapPotionSize(PotionSize potionSize) {
        // Handle null potionSize by assigning a default value
        if (potionSize == null) {
            return Order.CartItem.PotionSize.Small; // Default to "Small"
        }
        return switch (potionSize) {
            case Small -> Order.CartItem.PotionSize.Small;
            case Medium -> Order.CartItem.PotionSize.Medium;
            case Large -> Order.CartItem.PotionSize.Large;
        };
    }

    private OrderDTO mapToOrderDTO(Order order) {
        return new OrderDTO(
                order.getOrderId(),
                order.getCustomerId(),
                order.getRestaurantId(),
                new OrderDTO.CustomerDetailsDTO(
                        order.getCustomerDetails().getName(),
                        order.getCustomerDetails().getContact(),
                        order.getCustomerDetails().getLongitude(),
                        order.getCustomerDetails().getLatitude()
                ),
                order.getCartItems().stream()
                        .map(item -> new OrderDTO.CartItemDTO(
                                item.getItemId(),
                                item.getItemName(),
                                item.getQuantity(),
                                mapPotionSizeToDTO(item.getPotionSize()), // Map PotionSize
                                item.getPrice(),
                                item.getTotalPrice(),
                                item.getImage()
                        )).toList(),
                order.getOrderTotal(),
                order.getDeliveryFee(),
                order.getTotalAmount(),
                order.getPaymentType(),
                order.getOrderStatus(),
                order.getDriverDetails() != null ? new OrderDTO.DriverDetailsDTO(
                        order.getDriverDetails().getDriverId(),
                        order.getDriverDetails().getDriverName(),
                        order.getDriverDetails().getVehicleNumber()
                ) : null,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    private OrderDTO.CartItemDTO.PotionSize mapPotionSizeToDTO(Order.CartItem.PotionSize potionSize) {
        // Handle null potionSize by assigning a default value
        if (potionSize == null) {
            return OrderDTO.CartItemDTO.PotionSize.Small; // Default to "Small"
        }
        return switch (potionSize) {
            case Small -> OrderDTO.CartItemDTO.PotionSize.Small;
            case Medium -> OrderDTO.CartItemDTO.PotionSize.Medium;
            case Large -> OrderDTO.CartItemDTO.PotionSize.Large;
        };
    }

    @Override
    public OrderDTO getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderDTO(order);
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(status);
        order.setUpdatedAt(new Date());
        orderRepository.save(order);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getOrderStatus().equals("Pending")) {
            throw new RuntimeException("Cannot cancel an order that is not Pending");
        }
        order.setOrderStatus("Cancelled");
        order.setUpdatedAt(new Date());
        orderRepository.save(order);
    }

    @Override
    public void assignDriver(String orderId, AssignDriverRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setDriverDetails(new Order.DriverDetails(
                request.getDriverId(),
                request.getDriverName(),
                request.getVehicleNumber()
        ));
        order.setOrderStatus("Out for Delivery");
        order.setUpdatedAt(new Date());
        orderRepository.save(order);
    }

    @Override
    public void applyDiscount(String orderId, ApplyDiscountRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        double discountedAmount = order.getTotalAmount() - request.getDiscountAmount();
        order.setTotalAmount(discountedAmount < 0 ? 0 : discountedAmount);
        order.setUpdatedAt(new Date());
        orderRepository.save(order);
    }
}