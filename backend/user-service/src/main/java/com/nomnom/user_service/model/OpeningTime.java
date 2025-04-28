package com.nomnom.user_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpeningTime {
    private DayOfWeek day;
    private String openTime;
    private String closeTime;
    private Boolean isOpen;
}
