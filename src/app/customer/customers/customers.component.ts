import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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

  constructor(private customersService: CustomersService,
    private router: Router) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getCustomers();

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
