import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Customer } from '../../model/customer.model';
import { CustomerService } from '../customer.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { cloneDeep } from 'lodash';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit, OnDestroy {

  @ViewChildren('input') vc;
  @ViewChildren('assignmentInput') assignmentInput;

  customer: Customer;
  assignmentIds: string[];
  customerForm: FormGroup;
  editMode = false;
  createMode = false;
  separatorKeysCodes = [ENTER, COMMA, SPACE];
  customerId: string;
  watcher: Subscription;

  constructor(private customerService: CustomerService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar) {
    this.watcher = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.customerId = this.route.snapshot.url[1].path;
        if (this.customerId === 'reg') {
          this.createMode = true;
          this.customer = new Customer();
          this.customer.assignmentIds = [];
          this.initForm();
        } else {
          this.editMode = false;
          this.createMode = false;
          this.loadCustomer();
        }
      }});
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  ngOnInit() {
  }

  private loadCustomer() {
    this.customerService.getCustomer(this.customerId).subscribe(customer => {
      this.customer = customer;
      this.initForm();
    });
  }

  private initForm() {
    this.assignmentIds = cloneDeep(this.customer.assignmentIds);
    this.customerForm = new FormGroup({
      'name': new FormControl(this.customer.name, Validators.required)
    });
  }

  addAssignmentId(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.assignmentIds.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeAssignmentId(id: string): void {
    const index = this.assignmentIds.indexOf(id);

    if (index >= 0) {
      this.assignmentIds.splice(index, 1);
      this.assignmentInput.first.nativeElement.focus();
    }
  }

  onEditClick(): void {
    this.vc.first.nativeElement.focus();
    this.editMode = true;
  }

  onCancelClick(): void {
    this.editMode = false;
    this.initForm();
  }

  onCreateClick(): void {
    this.customerForm.value['newAssignmentIds'] = this.assignmentIds;
    this.customerService.createCustomer(this.customerForm.value).subscribe((customer) => {
      this.router.navigate(['../' + customer.id], { relativeTo: this.route });
    }, error => {
      this.snackBar.open(error.error.message, 'OK');
    });
  }

  onSaveClick(): void {
    this.customerForm.value['newAssignmentIds'] = this.assignmentIds;
    this.customerService.editCustomer(this.customer.id, this.customerForm.value).subscribe(() => {
      this.editMode = false;
      this.loadCustomer();
    }, error => {
      this.snackBar.open(error.error.message, 'OK');
    });
  }

}
