import { PagedEntity } from './../model/entity.model';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { HttpClient } from '@angular/common/http';
import { TableConfig, tableConfigs } from './table-configs';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit, OnDestroy {

  dataSource: EntityDataSource | null;
  query = new Subject<string>();
  allColumns = [];
  displayedColumns = [];
  config: TableConfig;
  timeout: any;
  mediaWatcher: Subscription;

  @Input()
  searchString: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private media: ObservableMedia,
    private http: HttpClient) { }

  ngOnInit() {
    const configName = this.route.snapshot.url[0].path;
    this.config = tableConfigs[configName];
    this.dataSource = new EntityDataSource(this.http, this.paginator, this.sort, this.query, this.config);

    this.allColumns = this.config.columns.map(e => e.field);
    this.mediaWatcher = this.media.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm') {
        this.displayedColumns = this.allColumns.slice(0, 3);
      } else if (change.mqAlias === 'xs')  {
        this.displayedColumns = this.allColumns.slice(0, 2);
      } else {
        this.displayedColumns = this.allColumns;
      }
    });
  }

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }

  onSearchChange() {

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.query.next(this.searchString);
    }, 500);

  }

}

export class EntityDataSource extends DataSource<any> {
  resultsLength = 0;
  pageSize = 10;
  isLoadingResults = false;
  queryString = '';

  constructor(private http: HttpClient, private paginator: MatPaginator,
    private sort: MatSort, private query: Subject<string>, private config: TableConfig) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {

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
        const params = {
          size: '' + this.paginator.pageSize,
          page: '' + this.paginator.pageIndex,
          sort: this.sort.active + ',' + this.sort.direction,
          q: this.queryString
        };
        return this.http.get<PagedEntity>(this.config.url, { params: params });
      })
      .map(r => {
        this.isLoadingResults = false;
        this.resultsLength = r.page.totalElements;
        this.pageSize = r.page.size;
        return r._embedded ? r._embedded[this.config.collectionName] : [];
      });
  }

  disconnect() { }
}
