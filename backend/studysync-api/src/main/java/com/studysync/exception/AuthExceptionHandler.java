package com.studysync.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.studysync.controller.auth.RegisterController;
import com.studysync.dto.ApiError;

@RestControllerAdvice(assignableTypes = RegisterController.class)
public class AuthExceptionHandler {

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ApiError> handleEmailAlreadyRegistered(
            EmailAlreadyRegisteredException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiError(HttpStatus.CONFLICT.value(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException ex
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Datos de registro inválidos.");

        return ResponseEntity
                .badRequest()
                .body(new ApiError(HttpStatus.BAD_REQUEST.value(), message));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableBody(
            HttpMessageNotReadableException ex
    ) {
        return ResponseEntity
                .badRequest()
                .body(new ApiError(
                        HttpStatus.BAD_REQUEST.value(),
                        "El cuerpo de la solicitud no es un JSON válido."
                ));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(
            DataIntegrityViolationException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiError(
                        HttpStatus.CONFLICT.value(),
                        new EmailAlreadyRegisteredException().getMessage()
                ));
    }
}
