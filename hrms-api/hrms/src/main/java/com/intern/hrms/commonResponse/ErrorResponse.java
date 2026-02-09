package com.intern.hrms.commonResponse;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ErrorResponse {
    private int status;
    private LocalDateTime timestamp;
    private String message;
    private List<String> details;

    public ErrorResponse(int status, LocalDateTime timestamp, String message) {
        this.status = status;
        this.timestamp = timestamp;
        this.message = message;
        this.details = null;
    }

    public ErrorResponse(int status, LocalDateTime timestamp, String message, List<String> details) {
        this.status = status;
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
    }

    public static ErrorResponse errorResponse(int status, String message){
        return new ErrorResponse(status, LocalDateTime.now(), message);
    }
    public static ErrorResponse detailErrorResponse(int status, String message, List<String> details){
        return new ErrorResponse(status, LocalDateTime.now(), message, details);
    }
}
