package com.wiklandia.ui.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;

public class SortUtil {

	private SortUtil() {
	}

	public static Sort generateSort(List<String> orderStrings) {

		if (orderStrings == null || orderStrings.isEmpty()) {
			return new Sort(new Order(Direction.ASC, "id"));
		}

		List<Order> orders = new ArrayList<>();
		for (String orderString : orderStrings) {

			String prop = orderString;
			Direction dir = Direction.ASC;
			if (prop.contains(",")) {
				String[] pp = prop.split(",");
				prop = pp[0];
				if ("desc".equalsIgnoreCase(pp[1])) {
					dir = Direction.DESC;
				}
			}

			orders.add(new Order(dir, prop));

		}

		orders.add(new Order(Direction.ASC, "id"));

		return new Sort(orders);
	}

}
