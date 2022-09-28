import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { ICustomer } from '../model';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: [
    './customers.component.css',
    '../../shared/shared-table.css',
    '../../shared/shared-new-form.css',
    '../../shared/common.css']
})
export class CustomersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'NAME', 'ADDRESS', 'POSTCODE', 'TYPE', 'ACTION'];
  customers: [ICustomer] = null;
  dataSource = null;
  selectedCustomer = null;
  isError = false;
  errorMsg = null;
  height = '80%';
  width = '65%';

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private customersService: CustomersService) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    this.spinner.show();
    this.customersService.getSenderCustomers()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          this.isError = false;
          this.customers = result.data.senderCustomers;
          this.dataSource = new MatTableDataSource(result.data.senderCustomers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner.hide();
        },
        error: (error) => {
          this.errorMsg = 'Something went wrong, please contact system support'
          this.isError = true;
          console.log(error.message);
          console.log(error);
          this.spinner.hide()
        }
      }
    )
  }


  bookCustomer(reference) {
    this.router.navigate(['/add-booking', reference]);
  }

  onHistory(reference) {
    this.router.navigate(['/customer-history/bookings', reference]);
  }

  orderCustomer(reference) {
    this.router.navigate(['/add-order', reference]);
  }

  addCustomer() {
    this.router.navigate(['/add-customer'])
  }

  editCustomer(reference) {
    this.router.navigate(['/edit-customer',reference])
  }

  deleteCustomer(reference) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        this.customersService.deleteCustomer(reference).pipe(
          takeUntil(this.componentDestroyed$))
          .subscribe({
            next: () => {
              location.reload()
            },
            error: (error) => {
              this.spinner.hide()
              this.dialog.open(InfoDialogComponent, {
                height: '25%',
                width: '30%',
                data: { message: error.message }
              });
            }
        })
      }
    })
  }

  updateCustomer(customer) {
    this.dataSource.data = this.dataSource.data.unshift(customer);
    this.dataSource = new MatTableDataSource(this.dataSource.data);

  }

  getName(customer: ICustomer) {
    return customer.type === 'PERSONAL' ? customer.fullName : customer.registeredName;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

}
