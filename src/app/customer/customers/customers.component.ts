import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { ICustomer } from '../model';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css', '../../shared/shared-table.css', '../../shared/shared-new-form.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'NAME', 'ADDRESS', 'POSTCODE', 'TYPE', 'ACTION'];
  customers: [ICustomer] = null;
  dataSource = null;
  selectedCustomer = null;
  height =  '80%'
  width = '65%'
  constructor(private router: Router, private customersService: CustomersService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  bookCustomer(reference) {
    this.router.navigate(['/add-booking', reference]);
  }

  addCustomer() {
    this.router.navigate(['/add-customer'])

  }

  editCustomer(reference) {
    this.router.navigate(['/edit-customer',reference])
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
    this.customersService.getSenderCustomers().subscribe(
      ({ data }) => {
        this.customers = data.senderCustomers;
        this.dataSource = new MatTableDataSource(data.senderCustomers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error);
      }
    );
  }

  getName(customer: ICustomer) {
    return customer.type === 'PERSONAL' ? customer.fullName : customer.registeredName;
  }


  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
