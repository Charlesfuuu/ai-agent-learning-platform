package com.ailearn.exception;

import com.ailearn.dto.ErrorResponse;
import java.time.LocalDateTime;
import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** 全局异常处理器 统一处理应用中的各类异常，返回标准格式的错误响应 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  /** 处理 Bean Validation 异常 */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
      MethodArgumentNotValidException ex, HttpServletRequest request) {

    // 提取第一个字段错误信息
    String message = "请求参数验证失败";
    if (ex.getBindingResult().hasErrors()) {
      FieldError fieldError = ex.getBindingResult().getFieldError();
      if (fieldError != null) {
        message = fieldError.getDefaultMessage();
      }
    }

    log.warn("Validation failed for request to {}: {}", request.getRequestURI(), message);

    ErrorResponse error =
        ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Bad Request")
            .message(message)
            .timestamp(LocalDateTime.now())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  /** 处理约束违反异常 */
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponse> handleConstraintViolationException(
      ConstraintViolationException ex, HttpServletRequest request) {

    String message = ex.getMessage();

    log.warn("Constraint violation for request to {}: {}", request.getRequestURI(), message);

    ErrorResponse error =
        ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Bad Request")
            .message(message)
            .timestamp(LocalDateTime.now())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  /** 处理数据库访问异常 */
  @ExceptionHandler(DataAccessException.class)
  public ResponseEntity<ErrorResponse> handleDatabaseException(
      DataAccessException ex, HttpServletRequest request) {

    log.error("Database error for request to {}: {}", request.getRequestURI(), ex.getMessage(), ex);

    ErrorResponse error =
        ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("数据库操作失败，请稍后重试")
            .timestamp(LocalDateTime.now())
            .path(request.getRequestURI())
            .details(ex.getClass().getSimpleName())
            .build();

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }

  /** 处理运行时异常 */
  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(
      RuntimeException ex, HttpServletRequest request) {

    log.error("Runtime error for request to {}: {}", request.getRequestURI(), ex.getMessage(), ex);

    ErrorResponse error =
        ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("服务器内部错误：" + ex.getMessage())
            .timestamp(LocalDateTime.now())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }

  /** 处理所有未捕获的异常 */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneralException(
      Exception ex, HttpServletRequest request) {

    log.error(
        "Unexpected error for request to {}: {}", request.getRequestURI(), ex.getMessage(), ex);

    ErrorResponse error =
        ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("发生未知错误，请联系管理员")
            .timestamp(LocalDateTime.now())
            .path(request.getRequestURI())
            .details(ex.getClass().getSimpleName())
            .build();

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }
}
