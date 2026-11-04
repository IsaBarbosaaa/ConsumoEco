package br.com.consumoeco.content;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ContentRepository extends JpaRepository<EducationalContent,Long> {List<EducationalContent> findAllByActiveTrueOrderByCategoryAscTitleAsc();}
