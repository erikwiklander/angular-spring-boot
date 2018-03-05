package com.wiklandia.ui.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.base.Strings;
import com.querydsl.core.types.Predicate;
import com.wiklandia.ui.model.Customer;
import com.wiklandia.ui.model.QQueryLog;
import com.wiklandia.ui.model.QueryLog;
import com.wiklandia.ui.model.QueryLogRepository;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class QueryLogController {

	private final PagedResourcesAssembler<QueryLog> pagedAssembler;
	private final QueryLogRepository logRepo;

	@GetMapping(value = "api/searchQueryLog")
	public HttpEntity<Object> search(@RequestParam("q") String query,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "20") int size,
			PersistentEntityResourceAssembler entityAssembler, @RequestParam MultiValueMap<String, String> parameters) {

		PageRequest pageRequest = PageRequest.of(page, size, SortUtil.generateSort(parameters.get("sort")));

		Page<QueryLog> requests;
		if (Strings.isNullOrEmpty(query)) {

			requests = logRepo.findAll(pageRequest);

		} else {

			Predicate p = QQueryLog.queryLog.sparCustumerId.containsIgnoreCase(query)
					.or(QQueryLog.queryLog.ucCustomerNumber.containsIgnoreCase(query))
					.or(QQueryLog.queryLog.userId.containsIgnoreCase(query));

			requests = logRepo.findAll(p, pageRequest);
		}

		@SuppressWarnings("rawtypes")
		ResourceAssembler assembler = entityAssembler;
		@SuppressWarnings("unchecked")
		PagedResources<Resource<Customer>> result = pagedAssembler.toResource(requests, assembler);

		return ResponseEntity.ok(result);

	}

}
