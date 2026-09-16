package com.studysync.exception;

public class EmailAlreadyRegisteredException extends RuntimeException {

    public EmailAlreadyRegisteredException() {
        super("El correo electrónico ya se encuentra registrado. Por favor, inicia sesión.");
    }
}
