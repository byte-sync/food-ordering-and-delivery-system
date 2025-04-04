package com.nomnom.session_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CreateSessionRequest {

    @NotBlank(message = "User ID is required")
    private String userId;
    private String deviceInfo;

}
