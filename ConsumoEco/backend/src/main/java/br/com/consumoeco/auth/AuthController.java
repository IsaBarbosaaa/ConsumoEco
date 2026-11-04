package br.com.consumoeco.auth;
import br.com.consumoeco.users.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final UserRepository users; private final PasswordEncoder encoder; private final AuthenticationManager manager;
 private final SecurityContextRepository contexts;
 public AuthController(UserRepository u,PasswordEncoder e,AuthenticationManager m,SecurityContextRepository c){users=u;encoder=e;manager=m;contexts=c;}
 public record Register(@NotBlank @Size(max=120) String name,@NotBlank @Email String email,@Size(min=10,max=72) String password){}
 public record Login(@NotBlank String email,@NotBlank String password){}
 @GetMapping("/csrf") public Map<String,String> csrf(CsrfToken csrf){return Map.of("token",csrf.getToken());}
 @PostMapping("/register") public ResponseEntity<?> register(@Valid @RequestBody Register body){
  String email=body.email().strip().toLowerCase();
  if(users.existsByEmail(email))throw new ResponseStatusException(HttpStatus.CONFLICT,"E-mail já cadastrado");
  User u=users.save(new User(body.name().strip(),email,encoder.encode(body.password())));
  return ResponseEntity.status(201).body(Map.of("id",u.id,"name",u.name,"email",u.email));
 }
 @PostMapping("/login") public Map<String,String> login(@Valid @RequestBody Login body,HttpServletRequest req,HttpServletResponse res){
  try{
   Authentication auth=manager.authenticate(new UsernamePasswordAuthenticationToken(body.email().strip().toLowerCase(),body.password()));
   var context=SecurityContextHolder.createEmptyContext();context.setAuthentication(auth);SecurityContextHolder.setContext(context);
   req.getSession(true); req.changeSessionId(); contexts.saveContext(context,req,res);
   return Map.of("message","Autenticado");
  }catch(AuthenticationException ex){throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciais inválidas");}
 }
 @GetMapping("/me") public Map<String,Object> me(Authentication auth){
  User u=users.findByEmail(auth.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));
  return Map.of("id",u.id,"name",u.name,"email",u.email);
 }
}
