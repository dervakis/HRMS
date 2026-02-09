package com.intern.hrms.filter;

import com.intern.hrms.security.JwtService;
import com.intern.hrms.security.SpringUserDetail;
import com.intern.hrms.security.SpringUserDetailService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.logging.Logger;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private Logger logger = Logger.getLogger(AuthenticationFilter.class.getName());
    private final UserDetailsService userDetailsService;

    public AuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        logger.info("Authentication Filter : Request Arrived "+path);

        //remainging bypass logick here
        if(path.startsWith("/api/employee/login") || path.startsWith("/api/role" ) || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.startsWith("/api/employee/forget-password/")){
            logger.info("Authentication Filter : Bypassing Authentication for Path " + path);
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if(header == null || !header.startsWith("Bearer ")){
            logger.warning("Authentication Filter : No Token found inside Header");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized Request : No token found");
        }
        String token = header.substring(7);
        String username = jwtService.extractUsername(token);

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if(jwtService.ValidateToken(token, userDetails)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        }
        filterChain.doFilter(request, response);


    }
}
