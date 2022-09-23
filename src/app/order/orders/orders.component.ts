import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';
import { OrderAssignDriverDialogComponent } from '../order-assign-driver-dialog/order-assign-driver-dialog.component';
import { OrderUpdateDialogComponent } from '../order-update-dialog/order-update-dialog.component';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css','../../shared/shared-table.css']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'CUSTOMER NAME','DELIVERY DATE', 'DELIVERY ADDRESS',
    'PAYMENT TYPE', 'PAYMENT STATUS', 'STATUS', 'ACTION'];
  orders: [] = null;
  dataSource = null;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private commonService: CommonService,
    private orderService: OrderService, private dialog: MatDialog, private cdRef : ChangeDetectorRef) {
    }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdRef.detectChanges();
    })
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
}
