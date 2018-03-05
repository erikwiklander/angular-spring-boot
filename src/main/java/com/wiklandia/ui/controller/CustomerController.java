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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.base.Strings;
import com.querydsl.core.types.Predicate;
import com.wiklandia.ui.model.Customer;
import com.wiklandia.ui.model.CustomerRepository;
import com.wiklandia.ui.model.QCustomer;
import com.wiklandia.ui.service.CustomerService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class CustomerController {

	private final PagedResourcesAssembler<Customer> pagedAssembler;
	private final CustomerService customerService;
	private final CustomerRepository customerRepo;

	@PostMapping(value = "api/createCustomer")
	public HttpEntity<Object> createCustomer(@RequestBody Customer newCustomer,
			PersistentEntityResourceAssembler entityAssembler) {

		customerService.validate(newCustomer.getNewAssignmentIds(), newCustomer);

		Customer c = customerService.create(newCustomer);

		return ResponseEntity.ok(entityAssembler.toFullResource(c));

	}

	@PostMapping(value = "api/saveCustomer/{id}")
	public HttpEntity<Object> saveCustomer(@PathVariable("id") Customer oldCustomer, @RequestBody Customer newCustomer,
			PersistentEntityResourceAssembler entityAssembler) {

		customerService.validate(newCustomer.getNewAssignmentIds(), oldCustomer);

		Customer c = customerService.save(oldCustomer, newCustomer);

		return ResponseEntity.ok(entityAssembler.toFullResource(c));
	}

	@GetMapping(value = "api/searchCustomer")
	public HttpEntity<Object> search(@RequestParam("q") String query,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "20") int size,
			PersistentEntityResourceAssembler entityAssembler, @RequestParam MultiValueMap<String, String> parameters) {

		PageRequest pageRequest = PageRequest.of(page, size, SortUtil.generateSort(parameters.get("sort")));

		Page<Customer> requests;
		if (Strings.isNullOrEmpty(query)) {

			requests = customerRepo.findAll(pageRequest);

		} else {

			Predicate p = QCustomer.customer.name.containsIgnoreCase(query)
					.or(QCustomer.customer.assignments.any().assignmentId.containsIgnoreCase(query));

			requests = customerRepo.findAll(p, pageRequest);
		}

		@SuppressWarnings("rawtypes")
		ResourceAssembler assembler = entityAssembler;
		@SuppressWarnings("unchecked")
		PagedResources<Resource<Customer>> result = pagedAssembler.toResource(requests, assembler);

		return ResponseEntity.ok(result);

	}

}
