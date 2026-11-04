package br.com.consumoeco.common;
import java.util.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@RestControllerAdvice public class ApiErrors {
 @ExceptionHandler(ResponseStatusException.class) ResponseEntity<?> status(ResponseStatusException ex){return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message",Objects.toString(ex.getReason(),"Solicitação inválida")));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> invalid(MethodArgumentNotValidException ex){return ResponseEntity.badRequest().body(Map.of("message","Verifique os campos informados"));}
 @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<?> duplicate(DataIntegrityViolationException ex){return ResponseEntity.status(409).body(Map.of("message","Registro duplicado ou inválido"));}
 @ExceptionHandler(Exception.class) ResponseEntity<?> generic(Exception ex){return ResponseEntity.status(500).body(Map.of("message","Não foi possível concluir a operação"));}
}
