package com.studysync.security.jwt;

import java.io.IOException;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.studysync.model.auth.AuthAccount;
import com.studysync.repository.auth.AuthAccountRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AuthAccountRepository accountRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            AuthAccountRepository accountRepository
    ) {
        this.jwtService = jwtService;
        this.accountRepository = accountRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null
                && header.startsWith("Bearer ")
                && SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            String token = header.substring(7);

            UUID accountId = jwtService.validateToken(token);

            if (accountId != null) {

                AuthAccount account =
                        accountRepository.findById(accountId)
                                .orElse(null);

                if (account != null
                        && Boolean.TRUE.equals(account.getActive())) {

                    var authorities = List.of(
                            new SimpleGrantedAuthority(
                                    "ROLE_" + account.getRole().name()
                            )
                    );

                    var authentication =
                            new UsernamePasswordAuthenticationToken(
                                    account.getId().toString(),
                                    null,
                                    authorities
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}