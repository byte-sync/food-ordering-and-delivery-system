package com.nomnom.user_service.model;

import com.nomnom.user_service.enums.DriverStatus;
import lombok.*;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@TypeAlias("DRIVER")
public class Driver extends User {
    private String vehicleTypeId;
    private String vehicleNumber;
    private List<DocumentInfo> vehicleDocuments;
    private DriverStatus driverStatus = DriverStatus.OFFLINE;
    private Point location;
    private boolean isActive = false ;
}
