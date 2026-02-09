package com.intern.hrms.configuration;

import com.intern.hrms.filter.AuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration {
    private final AuthenticationFilter authenticationFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfiguration(AuthenticationFilter authenticationFilter, UserDetailsService userDetailsService) {
        this.authenticationFilter = authenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)throws Exception{
        http.csrf(
                csrf -> csrf.disable()
                )
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers("/swagger-ui/**" , "/v3/api-docs/**").permitAll()
                                .requestMatchers("/api/role/**").permitAll()
                                .requestMatchers("/api/employee/login/**", "/api/employee/forget-password/**").permitAll()
                                .requestMatchers("/employee/**").permitAll()
                                .anyRequest().authenticated()
                )
                .addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}
