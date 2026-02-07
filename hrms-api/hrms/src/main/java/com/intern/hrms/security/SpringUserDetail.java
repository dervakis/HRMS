package com.intern.hrms.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public class SpringUserDetail implements UserDetails {
    private String username;
    private String password;
    private List<GrantedAuthority> authorities;

    public SpringUserDetail(String email, String password, String roleName){
        this.username = email;
        this.password = password;
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_"+roleName));
    }
    @Override
    public List<GrantedAuthority> getAuthorities() {
        return authorities;
    }
    @Override
    public String getUsername() {
        return username;
    }
    @Override
    public String getPassword() {
        return password;
    }
}
