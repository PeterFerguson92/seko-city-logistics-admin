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
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { IShipment } from '../model';
import { ShipmentService } from '../service/shipment.service';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.css',
    '../../shared/shared-table.css',
    '../../shared/common.css'
  ]
})
export class ShipmentsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'LOADING DATE', 'CONTAINER NUMBER', 'BL VESSEL', 'STATUS', 'ACTION'];
  shipments: [IShipment] = null;
  dataSource = null;
  isError = false;
  errorMsg = null;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private shipmentService: ShipmentService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.shipmentService.getShipments()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (data) => {
          this.isError = false;
          this.dataSource = new MatTableDataSource(data.data.shipments);
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

  onEligibleItems() {
    this.router.navigate(['/eligible-items']);
  }

  onAddShipment() {
    this.router.navigate(['/add-shipment']);
  }

  onListBookings(reference) {
    this.router.navigate(['/shipment-items', reference]);
  }

  OnEditShipment(reference) {
    this.router.navigate(['/edit-shipment', reference]);
  }

  OnShipmentAnalysis(reference) {
    this.router.navigate(['/shipment-analysis', reference]);
  }

  onDeleteShipment(reference) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '25%',
      width: '30%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true')
      {
        this.spinner.show();
        this.shipmentService.deleteShipment(reference)
          .pipe(
            takeUntil(this.componentDestroyed$),)
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

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

}
