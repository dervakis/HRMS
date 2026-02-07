package com.intern.hrms.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiry}")
    private int expireyInMinute;
    private <T> T extractClaims(String token, Function<Claims, T> ClaimResolver){
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();

        return ClaimResolver.apply(claims);
    }

    public String generateToken(String Email, String Password){
        Map<String, Object> Claims = new HashMap<>();
        Claims.put("username", Email);
        Claims.put("password",Password);

        return Jwts.builder()
                .setClaims(Claims)
                .setSubject(Email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expireyInMinute*60*1000))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }
    public String extractUsername(String token){
        return extractClaims(token, Claims::getSubject);
    }
    public boolean isTokenExpired(String token){
        Date expiryTime = extractClaims(token, Claims::getExpiration);
        return expiryTime.before(new Date());
    }
    public boolean ValidateToken(String token, UserDetails springUserDetail){
        Claims claims = extractClaims(token, claim -> claim);
        String username = claims.get("username", String.class);
        String password = claims.get("password", String.class);
        return username.equals(springUserDetail.getUsername()) && password.equals(springUserDetail.getPassword()) && (!isTokenExpired(token));
    }






}
