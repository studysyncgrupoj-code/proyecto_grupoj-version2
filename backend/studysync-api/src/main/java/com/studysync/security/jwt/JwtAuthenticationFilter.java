
package com.studysync.security.jwt;

import com.studysync.model.User;
import com.studysync.repository.UserRepository;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if (authorization != null &&
                authorization.startsWith("Bearer ") &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            String token = authorization.substring(7);

            try {
                Long userId = jwtService.getUserId(token);

                Optional<User> userOptional =
                        userRepository.findById(userId);

                if (userOptional.isPresent()) {
                    User user = userOptional.get();

                    if (Boolean.TRUE.equals(user.getActivo())) {

                        String role = user.getRol() == null
                                ? ""
                                : user.getRol().toUpperCase();

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        role.isBlank()
                                                ? List.of()
                                                : List.of(
                                                        new SimpleGrantedAuthority(
                                                                "ROLE_" + role
                                                        )
                                                )
                                );

                        SecurityContextHolder.getContext()
                                .setAuthentication(authentication);
                    }
                }

            } catch (JwtException | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
