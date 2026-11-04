package br.com.consumoeco.consumption;
import br.com.consumoeco.users.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity @Table(name="registros_consumo", uniqueConstraints=@UniqueConstraint(columnNames={"usuario_id","mes_referencia"}), indexes=@Index(name="idx_usuario_mes",columnList="usuario_id,mes_referencia"))
public class Consumption {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="usuario_id",nullable=false) public User owner;
 @Column(name="mes_referencia",nullable=false) public LocalDate month;
 @Column(nullable=false,precision=10,scale=2) public BigDecimal waterM3;
 @Column(nullable=false,precision=10,scale=2) public BigDecimal waterCost;
 @Column(nullable=false,precision=10,scale=2) public BigDecimal energyKwh;
 @Column(nullable=false,precision=10,scale=2) public BigDecimal energyCost;
 @Column(nullable=false) public Instant createdAt=Instant.now();
 protected Consumption(){}
 public Consumption(User u,LocalDate m,BigDecimal w,BigDecimal wc,BigDecimal e,BigDecimal ec){owner=u;month=m;waterM3=w;waterCost=wc;energyKwh=e;energyCost=ec;}
}
