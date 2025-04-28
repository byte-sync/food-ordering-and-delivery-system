package com.nomnom.cart_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow CORS for all endpoints
                        .allowedOrigins("http://localhost:3000") // Allow requests from the frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow specific HTTP methods
                        .allowedHeaders("Content-Type", "Authorization") // Allow specific headers
                        .allowCredentials(true); // Allow cookies or authentication headers if needed
            }
        };
    }
}