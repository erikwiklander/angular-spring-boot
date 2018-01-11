package com.wiklandia.ui.security;

import org.springframework.boot.autoconfigure.security.Http401AuthenticationEntryPoint;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import lombok.AllArgsConstructor;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final SecurityProperties securityProperties;

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.authorizeRequests().antMatchers("/api/**").authenticated();
		http.authorizeRequests().antMatchers("/**").permitAll();

		http.csrf().disable();

		http.logout().logoutSuccessUrl("/logoutSuccess");

		http.httpBasic().authenticationEntryPoint(new Http401AuthenticationEntryPoint("Wiklandia"));
		http.formLogin().disable();

		if (securityProperties.isRequireSsl()) {
			http.requiresChannel().anyRequest().requiresSecure();
		}

	}

}
