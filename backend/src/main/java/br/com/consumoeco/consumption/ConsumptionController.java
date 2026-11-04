package br.com.consumoeco.consumption;
import br.com.consumoeco.users.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.*;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/api/consumptions")
public class ConsumptionController {
 private final ConsumptionRepository records;private final UserRepository users;
 public ConsumptionController(ConsumptionRepository r,UserRepository u){records=r;users=u;}
 public record Input(@NotNull LocalDate month,@NotNull @DecimalMin("0.0") BigDecimal waterM3,
   @NotNull @DecimalMin("0.0") BigDecimal waterCost,@NotNull @DecimalMin("0.0") BigDecimal energyKwh,
   @NotNull @DecimalMin("0.0") BigDecimal energyCost){}
 public record Output(Long id,LocalDate month,BigDecimal waterM3,BigDecimal waterCost,BigDecimal energyKwh,BigDecimal energyCost) {
  public static Output from(Consumption c){return new Output(c.id,c.month,c.waterM3,c.waterCost,c.energyKwh,c.energyCost);}
 }
 private User owner(Authentication auth){return users.findByEmail(auth.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));}
 private LocalDate cleanMonth(LocalDate month){
  if(month.getDayOfMonth()!=1)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Informe o primeiro dia do mês");
  if(month.isAfter(LocalDate.now().withDayOfMonth(1)))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Não é permitido mês futuro");
  return month;
 }
 @GetMapping @Transactional(readOnly=true) public List<Output> list(Authentication auth){return records.findAllByOwnerIdOrderByMonthAsc(owner(auth).id).stream().map(Output::from).toList();}
 @PostMapping @Transactional public ResponseEntity<Output> create(@Valid @RequestBody Input input,Authentication auth){
  User u=owner(auth);LocalDate m=cleanMonth(input.month());
  if(records.existsByOwnerIdAndMonth(u.id,m))throw new ResponseStatusException(HttpStatus.CONFLICT,"Já existe registro para este mês");
  Consumption c=records.save(new Consumption(u,m,input.waterM3(),input.waterCost(),input.energyKwh(),input.energyCost()));
  return ResponseEntity.status(201).body(Output.from(c));
 }
 @PutMapping("/{id}") @Transactional public Output update(@PathVariable Long id,@Valid @RequestBody Input input,Authentication auth){
  User u=owner(auth);Consumption c=records.findByIdAndOwnerId(id,u.id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  LocalDate m=cleanMonth(input.month());
  if(!c.month.equals(m)&&records.existsByOwnerIdAndMonth(u.id,m))throw new ResponseStatusException(HttpStatus.CONFLICT,"Já existe registro para este mês");
  c.month=m;c.waterM3=input.waterM3();c.waterCost=input.waterCost();c.energyKwh=input.energyKwh();c.energyCost=input.energyCost();
  return Output.from(records.save(c));
 }
 @DeleteMapping("/{id}") @Transactional public ResponseEntity<Void> delete(@PathVariable Long id,Authentication auth){
  User u=owner(auth);Consumption c=records.findByIdAndOwnerId(id,u.id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
  records.delete(c);return ResponseEntity.noContent().build();
 }
}
