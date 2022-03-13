import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ADD_CUSTOMER_MODE, EDIT_CUSTOMER_MODE } from 'src/app/constants';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { AddEditCustomerDialogComponent } from '../add-edit-customer-dialog/add-edit-customer-dialog.component';
import { ICustomer } from '../domain';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css', '../../shared/shared.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'NAME', 'ADDRESS', 'POSTCODE', 'TYPE', 'ACTION'];
  customers: [ICustomer] = null;
  dataSource = null;
  selectedCustomer = null;

  constructor(
    private router: Router,
    private customersService: CustomersService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCustomers();

  }

  viewCustomer(reference) {
    console.log('view');
    console.log(reference)
    this.router.navigate(['/add-booking', reference]);
  }

  editCustomer(customer) {
    this.selectedCustomer = customer;
    this.dialog.open(AddEditCustomerDialogComponent, {
      data: { customer, mode: EDIT_CUSTOMER_MODE }
    });
  }

  addCustomer() {
    const emptyCustomer: ICustomer = {
      uuid: '',
      fullName: '',
      address: '',
      postcode: '',
      phone: '',
      email: '',
      country: '',
      type: '',
      destination: '',
    };

    this.dialog.open(AddEditCustomerDialogComponent, {
      data: { customer: emptyCustomer, mode: ADD_CUSTOMER_MODE }
    });
  }

  deleteCustomer(reference) {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        this.customersService.deleteCustomer(reference).subscribe(
          ({ data }) => {
            console.log(data)
            location.reload()
          },
          error => {
            console.log(error);
          }
        )
      }
    })
  }

  updateCustomer(customer) {
    this.dataSource.data = this.dataSource.data.unshift(customer);
    this.dataSource = new MatTableDataSource(this.dataSource.data);

  }
  getCustomers() {
    this.customersService.getCustomers().subscribe(
      ({ data }) => {
        this.customers = data.customers;
        this.dataSource = new MatTableDataSource(data.customers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error);
      }
    );
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
