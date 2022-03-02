import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomersService } from '../service/customers/customers.service';
import { Customer } from '../service/customers/requests';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css', '../shared/shared.css']
})
export class CustomersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['ID', 'NAME', 'ADDRESS', 'POSTCODE','TYPE', 'ACTION'];
  customers: [Customer] = null;
  dataSource = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private customersService: CustomersService) { }

  ngAfterViewInit(): void {
    this.customersService.getCustomers().subscribe(
      ({ data }) => {
        this.customers = data.customers;
        console.log(this.customers);
        this.dataSource = new MatTableDataSource(data.customers);

      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {

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
