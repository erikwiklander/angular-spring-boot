// this contains all table definitions
export const tableConfigs = {
    employee: {
        title: 'Employees',
        collectionName: 'employees',
        url: 'api/searchEmployee',
        sortActive: 'lastModifiedDate',
        searchVisible: true,
        columns: [
            {
                field: 'name',
                label: 'Name',
                sort: true
            },
            {
                field: 'companyName',
                label: 'Company',
                sort: false
            },
            {
                field: 'createdDate',
                label: 'Created Date',
                dateFormat: 'yyyy-MM-dd HH:mm:ss',
                type: 'DATE',
                sort: true
            },
            {
                field: 'lastModifiedDate',
                label: 'Last Modified Date',
                dateFormat: 'yyyy-MM-dd HH:mm:ss',
                type: 'DATE',
                sort: true
            }
        ]
    }
};

export interface TableConfig {
    title: string;
    collectionName: string;
    url: string;
    sortActive: string;
    columns: TableColumn[];
    searchVisible: boolean;
}

export interface TableColumn {
    field: string;
    label: string;
    dateFormat: string;
    sort: boolean;
}

