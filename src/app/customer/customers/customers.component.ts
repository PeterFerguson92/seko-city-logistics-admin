import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ICustomer } from '../domain';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css', '../../shared/shared.css']
})
export class CustomersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['ID', 'NAME', 'ADDRESS', 'POSTCODE', 'TYPE', 'ACTION'];
  customers: [ICustomer] = null;
  dataSource = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ADD_CUSTOMER_URL = '/add-customer';

  constructor(private customersService: CustomersService, private router: Router) { }

  ngAfterViewInit(): void {
    this.customersService.getCustomers().subscribe(
      ({ data }) => {
        this.customers = data.customers;
        this.dataSource = new MatTableDataSource(data.customers);
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {

  }

  addCustomer() {
    this.router.navigateByUrl(this.ADD_CUSTOMER_URL)
  }

  viewCustomer(reference) {
    console.log('view');
    console.log(reference)
  }

  editCustomer(reference) {
    console.log('edit');
    console.log(reference);
  }

  deleteCustomer(reference) {
    console.log('delete');

    console.log(reference)
  }

}
