package br.com.consumoeco.users;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="usuarios", uniqueConstraints=@UniqueConstraint(columnNames="email"))
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false,length=120) public String name;
 @Column(nullable=false,length=150) public String email;
 @Column(nullable=false,name="senha_hash") public String passwordHash;
 @Column(nullable=false) public Instant createdAt=Instant.now();
 @Column(nullable=false) public boolean active=true;
 protected User(){}
 public User(String n,String e,String h){name=n;email=e;passwordHash=h;}
}
