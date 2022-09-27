import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';
import { OrderAssignDriverDialogComponent } from '../order-assign-driver-dialog/order-assign-driver-dialog.component';
import { OrderUpdateDialogComponent } from '../order-update-dialog/order-update-dialog.component';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: [
    './orders.component.css',
    '../../shared/shared-table.css',
    '../../shared/common.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'CUSTOMER NAME','DATE', 'POSTCODE',
    'PAYMENT TYPE', 'PAYMENT STATUS', 'STATUS', 'ACTION'];
  orders: [] = null;
  dataSource = null;
  isError = false;
  errorMsg = null;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private orderService: OrderService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.orderService.getOrders()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (result) => {
          this.isError = false;
          this.dataSource = new MatTableDataSource(result.data.orders);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner.hide();
        },
        error: (error) => {
          this.errorMsg = error.message
          this.isError = true;
          console.log(error);
          this.spinner.hide()
        }
      }
    )
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  onAddOrder() {
    this.router.navigate(['/add-order']);
  }

  editOrder(element) {
    this.router.navigate(['/edit-order', element.reference, element.customerReference]);
  }

  viewOrder(reference) {
    this.router.navigate(['/order-summary', reference]);
  }

  updateOrder(order) {
    const dialogRef = this.dialog.open(OrderUpdateDialogComponent, {
      // height: '80%',
      width: '25%',
      data: { order }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  onAssignDriver(reference, assignedDriverReference) {
    const dialogRef = this.dialog.open(OrderAssignDriverDialogComponent, {
      height: '43%',
      width: '35%',
      data: { reference, assignedDriverReference }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

  deleteOrder(reference) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '25%',
      width: '30%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        this.orderService.deleteOrder(reference).subscribe(
          ({ data }) => {
            location.reload()
          },
          error => {
            console.log(error);
          }
        )
      }
    })
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
