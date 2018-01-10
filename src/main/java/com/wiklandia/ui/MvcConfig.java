package com.wiklandia.ui;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

import lombok.AllArgsConstructor;

/**
 * This config is needed so that we can assemble resources in custom controller
 *
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
@AllArgsConstructor
public class MvcConfig extends WebMvcConfigurerAdapter {

	@Qualifier("repositoryExporterHandlerAdapter")
	private final RequestMappingHandlerAdapter repositoryExporterHandlerAdapter;

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
		List<HandlerMethodArgumentResolver> customArgumentResolvers = repositoryExporterHandlerAdapter
				.getCustomArgumentResolvers();
		argumentResolvers.addAll(customArgumentResolvers);
	}

}
