package com.wiklandia.ui.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class QueryLog extends BasicEntity {

    private static final long serialVersionUID = 1L;
    /**
     * End customer number in spar
     */
    private String sparCustumerId;
    /**
     * End user id
     */
    private String userId;
    /**
     * Customer number assigned by UC
     */
    private String ucCustomerNumber;

    /**
     * The query in XML format
     */
    @Column(columnDefinition = "text")
    private String query;

    @Enumerated(EnumType.STRING)
    private QueryType type;

    /**
     * If query was done with extended access
     */
    private boolean relationQuery;

}
