package com.wiklandia.ui.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.wiklandia.ui.model.Assignment;
import com.wiklandia.ui.model.AssignmentRepository;
import com.wiklandia.ui.model.Customer;
import com.wiklandia.ui.model.CustomerRepository;
import com.wiklandia.ui.model.QAssignment;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CustomerService {

	private CustomerRepository customerRepo;
	private AssignmentRepository assignmentRepo;

	/**
	 * Saves the oldCustomer with the new values specified in newCustomer
	 * 
	 * @param oldCustomer
	 * @param newCustomer
	 * @return
	 */
	public Customer save(Customer oldCustomer, Customer newCustomer) {

		oldCustomer.setName(newCustomer.getName());

		// remove assignment ids not used anymore
		for (Assignment assignment : oldCustomer.getAssignments()) {
			if (!newCustomer.getNewAssignmentIds().contains(assignment.getAssignmentId())) {
				oldCustomer.setLastModifiedDate(new Date());
				assignment.setCustomer(null);
				assignmentRepo.save(assignment);
			}
		}

		// add assignments
		for (String assignmentId : newCustomer.getNewAssignmentIds()) {
			if (!oldCustomer.getAssignmentIds().contains(assignmentId)) {

				// first check to see if this assignments exists
				Assignment assignment = assignmentRepo.findOne(QAssignment.assignment.assignmentId.eq(assignmentId))
						.orElse(Assignment.of(assignmentId));
				assignment.setCustomer(oldCustomer);
				assignmentRepo.save(assignment);
				oldCustomer.setLastModifiedDate(new Date());
			}
		}

		return customerRepo.save(oldCustomer);

	}

	public Customer create(Customer newCustomer) {

		Customer c = customerRepo.save(newCustomer);

		// add assignments
		for (String assignmentId : newCustomer.getNewAssignmentIds()) {

			// first check to see if this assignments exists
			Assignment assignment = assignmentRepo.findOne(QAssignment.assignment.assignmentId.eq(assignmentId))
					.orElse(Assignment.of(assignmentId));
			assignment.setCustomer(newCustomer);
			assignmentRepo.save(assignment);
		}

		return c;

	}

}
