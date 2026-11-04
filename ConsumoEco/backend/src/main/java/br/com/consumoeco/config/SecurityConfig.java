package br.com.consumoeco.config;
import br.com.consumoeco.users.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
@Configuration public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder(12);}
 @Bean UserDetailsService userDetails(UserRepository repo){return email->repo.findByEmail(email).filter(u->u.active)
   .map(u->User.withUsername(u.email).password(u.passwordHash).roles("USER").build())
   .orElseThrow(()->new org.springframework.security.core.userdetails.UsernameNotFoundException("Credenciais inválidas"));}
 @Bean AuthenticationManager authenticationManager(UserDetailsService uds,PasswordEncoder encoder){
  DaoAuthenticationProvider provider=new DaoAuthenticationProvider(uds);provider.setPasswordEncoder(encoder);
  return new ProviderManager(provider);
 }
 @Bean SecurityContextRepository securityContextRepository(){return new HttpSessionSecurityContextRepository();}
 @Bean SecurityFilterChain chain(HttpSecurity http, SecurityContextRepository repo) throws Exception{
  http.csrf(csrf->csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
   .authorizeHttpRequests(a->a.requestMatchers("/api/auth/register","/api/auth/login","/api/auth/csrf","/api/health").permitAll()
      .requestMatchers(HttpMethod.GET,"/api/content/**").permitAll()
      .requestMatchers("/error").permitAll().anyRequest().authenticated())
   .securityContext(ctx->ctx.securityContextRepository(repo))
   .sessionManagement(s->s.sessionFixation(f->f.changeSessionId()).maximumSessions(3))
   .logout(l->l.logoutUrl("/api/auth/logout").invalidateHttpSession(true).deleteCookies("JSESSIONID").logoutSuccessHandler((req,res,auth)->res.setStatus(204)))
   .exceptionHandling(e->e.authenticationEntryPoint((req,res,ex)->res.sendError(401,"Autenticação necessária"))
      .accessDeniedHandler((req,res,ex)->res.sendError(403,"Acesso não autorizado")));
  return http.build();
 }
}
