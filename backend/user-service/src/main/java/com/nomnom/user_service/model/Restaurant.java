package com.nomnom.user_service.model;


import com.nomnom.user_service.enums.RestaurantStatus;
import lombok.*;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@TypeAlias("RESTAURANT")
public class Restaurant extends User {
    private String restaurantName;
    private String restaurantLicenseNumber;
    private String restaurantTypeId;
    private String[] cuisineTypeIds;
    private List<DocumentInfo> restaurantDocuments;
    private List<OpeningTime> openingTimes;
    private RestaurantStatus restaurantStatus;
    private Point location;
    private String restaurantAddress;
    private boolean isActive = false;
}
