package com.studysync.security;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studysync.security.jwt.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final ObjectMapper objectMapper;

    public SecurityConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtFilter
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session
                        .sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .exceptionHandling(exceptions -> exceptions

                        // Usuario sin autenticación válida
                        .authenticationEntryPoint(
                                (request, response, authException) ->
                                        writeError(
                                                response,
                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                "UNAUTHENTICATED",
                                                "Autenticación requerida."
                                        )
                        )

                        // Usuario autenticado sin permisos
                        .accessDeniedHandler(
                                (request, response, accessDeniedException) ->
                                        writeError(
                                                response,
                                                HttpServletResponse.SC_FORBIDDEN,
                                                "FORBIDDEN",
                                                "No tienes permiso para realizar esta operación."
                                        )
                        )
                )
                .authorizeHttpRequests(auth -> auth

                        // Endpoints públicos de autenticación
                        .requestMatchers(
                                HttpMethod.POST,
                                "/auth/register",
                                "/auth/login",
                                "/auth/verify-email",
                                "/auth/validate-verification-token",
                                "/auth/forgot-password",
                                "/auth/reset-password",
                                "/auth/validate-reset-token",
                                "/auth/refresh",
                                "/auth/logout"
                        )
                        .permitAll()

                        // Subir y eliminar avatares requiere JWT
                        .requestMatchers(
                                HttpMethod.POST,
                                "/users/*/avatar"
                        )
                        .authenticated()

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/users/*/avatar"
                        )
                        .authenticated()

                        // Idiomas disponibles: acceso público
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/languages"
                        )
                        .permitAll()

                        // Preferencias de idioma: requieren JWT
                        .requestMatchers(
                                "/api/users/me/language"
                        )
                        .authenticated()

                        // Endpoints del usuario autenticado: requieren JWT
                        .requestMatchers(
                                "/users/me",
                                "/users/me/**",
                                "/api/users/me/profile"
                        )
                        .authenticated()

                        // Endpoints de salud
                        .requestMatchers(
                                "/health/**",
                                "/api/health/**"
                        )
                        .permitAll()

                        // Conservamos las demás rutas existentes
                        .anyRequest()
                        .permitAll()
                )
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    private void writeError(
            HttpServletResponse response,
            int status,
            String code,
            String message
    ) throws IOException {

        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> error = Map.of(
                "error",
                Map.of(
                        "code", code,
                        "message", message,
                        "details", ""
                )
        );

        // El contrato exige details: null
        Map<String, Object> errorDetails = new java.util.LinkedHashMap<>();
        errorDetails.put("code", code);
        errorDetails.put("message", message);
        errorDetails.put("details", null);

        objectMapper.writeValue(
                response.getWriter(),
                Map.of("error", errorDetails)
        );
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of("*"));

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}