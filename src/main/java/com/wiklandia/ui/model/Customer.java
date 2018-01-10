package com.wiklandia.ui.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Customer extends BasicEntity {

	private static final long serialVersionUID = 1L;

	private String name;

	@OneToMany(mappedBy = "customer")
	private List<Assignment> assignments = new ArrayList<>();

	/**
	 * This is set by front-end only when saving
	 */
	@Transient
	private List<String> newAssignmentIds = new ArrayList<>();

	public List<String> getAssignmentIds() {
		List<String> res = assignments.stream().map(Assignment::getAssignmentId).collect(Collectors.toList());
		Collections.sort(res);
		return res;
	}

}
