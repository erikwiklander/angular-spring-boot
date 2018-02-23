package com.wiklandia.ui.model;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.NaturalId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Assignment extends BasicEntity {

    private static final long serialVersionUID = 1L;

    @NaturalId
    private String assignmentId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public static Assignment of(String assignmentId) {
        Assignment a = new Assignment();
        a.setAssignmentId(assignmentId);
        return a;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (!(o instanceof Assignment)) {
            return false;
        }

        return Objects.equals(assignmentId, ((Assignment) o).assignmentId);

    }

    @Override
    public int hashCode() {
        return Objects.hashCode(assignmentId);
    }

}
