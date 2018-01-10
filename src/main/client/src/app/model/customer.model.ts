import { Page } from './page.model';

export class Customer {
    id: number;
    name: string;
    createdDate: Date;
    lastModifiedDate: Date;
    assignmentIds: string[];
}

export interface PagedCustomer {
    _embedded: {
        customers: Customer[];
    };
    page: Page;
}
