package com.nomnom.user_service.model;

import com.nomnom.user_service.enums.AdminType;
import lombok.*;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@TypeAlias("ADMIN")
public class Admin extends User {
    private AdminType adminType;
}

