package com.nomnom.user_service.model;

import lombok.*;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@TypeAlias("CUSTOMER")
public class Customer extends User {
    Point location;
}
