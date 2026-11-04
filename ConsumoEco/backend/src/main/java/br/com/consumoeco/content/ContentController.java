package br.com.consumoeco.content;
import java.util.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/content") public class ContentController {
 private final ContentRepository repo;public ContentController(ContentRepository r){repo=r;}
 public record Item(Long id,String title,String description,String category){}
 @GetMapping public List<Item> list(){return repo.findAllByActiveTrueOrderByCategoryAscTitleAsc().stream().map(c->new Item(c.id,c.title,c.description,c.category)).toList();}
}
