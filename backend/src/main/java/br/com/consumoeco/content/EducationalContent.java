package br.com.consumoeco.content;
import jakarta.persistence.*;
@Entity @Table(name="conteudos_educativos") public class EducationalContent {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false,length=150) public String title;
 @Column(nullable=false,columnDefinition="TEXT") public String description;
 @Column(nullable=false,length=50) public String category;
 @Column(nullable=false) public boolean active=true;
 protected EducationalContent(){}
 public EducationalContent(String t,String d,String c){title=t;description=d;category=c;}
}
