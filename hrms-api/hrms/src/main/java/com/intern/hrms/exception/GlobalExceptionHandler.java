package com.intern.hrms.exception;

import com.intern.hrms.commonResponse.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> globalExceptionHandler(Exception exception, WebRequest request){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponse.errorResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage())
        );
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validatorExceptionHandler(MethodArgumentNotValidException exception, WebRequest request){
        List<String> details =exception.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.toUnmodifiableList());
        String name = exception.getBindingResult().getObjectName();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
          ErrorResponse.detailErrorResponse(HttpStatus.BAD_REQUEST.value(), name, details)
        );
    }
}
