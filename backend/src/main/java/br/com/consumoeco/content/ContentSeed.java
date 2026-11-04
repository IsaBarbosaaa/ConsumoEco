package br.com.consumoeco.content;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration public class ContentSeed {
 @Bean CommandLineRunner seedContent(ContentRepository repo){return args->{if(repo.count()==0){
  repo.save(new EducationalContent("Banhos mais curtos","Diminuir alguns minutos do banho pode reduzir o consumo de água e de energia do aquecimento.","Água"));
  repo.save(new EducationalContent("Atenção a vazamentos","Verifique torneiras, descargas e tubulações. Pequenos vazamentos podem aumentar a conta mensal.","Água"));
  repo.save(new EducationalContent("Iluminação eficiente","Prefira lâmpadas LED e aproveite a luz natural sempre que possível.","Energia"));
  repo.save(new EducationalContent("Desligue da tomada","Evite manter aparelhos desnecessários em modo de espera por longos períodos.","Energia"));
  repo.save(new EducationalContent("Separe resíduos","Separe os recicláveis limpos e secos de acordo com a coleta disponível na sua região.","Reciclagem"));
  repo.save(new EducationalContent("Compre com planejamento","Faça listas de compras e evite adquirir itens sem necessidade.","Consumo consciente"));
 } };}
}
