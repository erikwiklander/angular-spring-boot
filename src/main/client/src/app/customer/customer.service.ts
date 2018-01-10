import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PagedCustomer, Customer } from '../model/customer.model';

@Injectable()
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomers(sort: string, order: string, page: number, size: number, queryString: string): Observable<PagedCustomer> {
    const params = {
      size: '' + size,
      page: '' + page,
      sort: sort + ',' + order,
      q: queryString
    };

    return this.http.get<PagedCustomer>('/api/searchCustomer', { params: params });
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>('api/customers/' + id);
  }

  editCustomer(id: number, customerChanges: any): Observable<Customer> {
    return this.http.post<Customer>('/api/saveCustomer/' + id, customerChanges);
  }

  createCustomer(customer: any): Observable<Customer> {
    return this.http.post<Customer>('/api/createCustomer', customer);
  }

}
