package com.wiklandia.ui.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Employee extends BasicEntity {

	private static final long serialVersionUID = 1L;

	private String name;

	private String role;

	@ManyToOne
	private Customer company;

	public String getCompanyName() {
		return company == null ? "" : company.getName();
	}

}
