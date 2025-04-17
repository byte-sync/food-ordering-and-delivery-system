package com.nomnom.user_service.model;


import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class RestaurantOwner extends User {
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantLicenseNumber;
    private List<RestaurantDocument> restaurantDocuments;
}
