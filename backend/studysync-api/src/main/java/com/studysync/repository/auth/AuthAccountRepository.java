package com.studysync.repository.auth;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.studysync.model.auth.AuthAccount;

public interface AuthAccountRepository extends JpaRepository<AuthAccount, UUID> {

    Optional<AuthAccount> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    /**
     * Trae la cuenta de autenticación junto con su perfil de usuario en una sola consulta.
     * Ideal para el flujo de inicio de sesión (Login) donde necesitas validar credenciales 
     * y de una vez retornar el nombre y apellido del usuario.
     */
    @Query("SELECT a FROM AuthAccount a JOIN FETCH a.userProfile WHERE LOWER(a.email) = LOWER(:email)")
    Optional<AuthAccount> findByEmailWithProfile(@Param("email") String email);
}