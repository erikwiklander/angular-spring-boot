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
import com.wiklandia.ui.model.Employee;
import com.wiklandia.ui.model.EmployeeRepository;
import com.wiklandia.ui.model.QEmployee;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class EmployeeController {

	private final PagedResourcesAssembler<Employee> pagedAssembler;
	private final EmployeeRepository employeeRepo;

	@GetMapping(value = "api/searchEmployee")
	public HttpEntity<Object> search(@RequestParam("q") String query,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "20") int size,
			PersistentEntityResourceAssembler entityAssembler, @RequestParam MultiValueMap<String, String> parameters) {

		PageRequest pageRequest = PageRequest.of(page, size, SortUtil.generateSort(parameters.get("sort")));

		Page<Employee> requests;
		if (Strings.isNullOrEmpty(query)) {

			requests = employeeRepo.findAll(pageRequest);

		} else {

			Predicate p = QEmployee.employee.name.containsIgnoreCase(query)
					.or(QEmployee.employee.company.name.containsIgnoreCase(query));

			requests = employeeRepo.findAll(p, pageRequest);
		}

		@SuppressWarnings("rawtypes")
		ResourceAssembler assembler = entityAssembler;
		@SuppressWarnings("unchecked")
		PagedResources<Resource<Employee>> result = pagedAssembler.toResource(requests, assembler);

		return ResponseEntity.ok(result);

	}

}
