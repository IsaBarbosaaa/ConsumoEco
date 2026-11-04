package br.com.consumoeco.consumption;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ConsumptionRepository extends JpaRepository<Consumption,Long> {
 List<Consumption> findAllByOwnerIdOrderByMonthAsc(Long id);
 boolean existsByOwnerIdAndMonth(Long id,LocalDate month);
 java.util.Optional<Consumption> findByIdAndOwnerId(Long id,Long ownerId);
}
