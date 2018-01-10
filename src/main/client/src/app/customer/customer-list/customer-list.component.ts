import { Subscription } from 'rxjs/Subscription';
import { NavigationComponent } from './../../navigation/navigation.component';
import { CustomerService } from './../customer.service';
import { Component, OnInit, ViewChild, SimpleChanges, Input, OnDestroy } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';
import { Subject } from 'rxjs/Subject';
import { Customer } from '../../model/customer.model';
import { Router, ActivatedRoute } from '@angular/router';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

@Component({
  selector: 'app-customer',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnDestroy {

  allColumns = [
    'name',
    'assignments',
    'createdDate',
    'lastModifiedDate'
  ];

  displayedColumns = [];

  dataSource: CustomerDataSource | null;
  timeout: any;
  query = new Subject<string>();
  mediaWatcher: Subscription;

  @Input()
  searchString: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private media: ObservableMedia) { }

  ngOnInit(): void {
    this.dataSource = new CustomerDataSource(this.paginator, this.sort, this.customerService, this.query);

    this.mediaWatcher = this.media.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm'  || change.mqAlias === 'xs') {
        this.displayedColumns = this.allColumns.slice(0, 2);
      } else {
        this.displayedColumns = this.allColumns;
      }
    });
  }

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }

  onRowClick(customer: Customer) {
    this.router.navigate([customer.id], { relativeTo: this.route });
  }

  onSearchChange(aa: any) {

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.query.next(this.searchString);
    }, 500);

  }

}

export class CustomerDataSource extends DataSource<Customer> {
  resultsLength = 0;
  pageSize = 10;
  isLoadingResults = false;
  queryString = '';

  constructor(private paginator: MatPaginator, private sort: MatSort,
    private customerService: CustomerService, private query: Subject<string>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Customer[]> {

    // reset page when sort is changed
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.query.subscribe(queryString => {
      this.queryString = queryString;
      this.paginator.pageIndex = 0;
    });

    return Observable.merge(this.sort.sortChange, this.paginator.page, this.query)
      .startWith(null)
      .switchMap(() => {
        this.isLoadingResults = true;
        return this.customerService.getCustomers(this.sort.active, this.sort.direction, this.paginator.pageIndex, 10, this.queryString);
      })
      .map(r => {
        this.isLoadingResults = false;
        this.resultsLength = r.page.totalElements;
        this.pageSize = r.page.size;
        return r._embedded ? r._embedded.customers : [];
      });
  }

  disconnect() {}
}
