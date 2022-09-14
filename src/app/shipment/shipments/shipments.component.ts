import { AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { ConfirmDialogComponent } from 'src/app/shared/elements/confirm-dialog/confirm-dialog.component';
import { IShipment } from '../model';
import { ShipmentService } from '../service/shipment.service';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.css', '../../shared/shared-table.css']
})
export class ShipmentsComponent implements OnInit, AfterContentInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'LOADING DATE', 'CONTAINER NUMBER', 'BL VESSEL', 'STATUS', 'ACTION'];
  shipments: [IShipment] = null;
  dataSource = null;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private commonService: CommonService,
  private shipmentService: ShipmentService, private dialog: MatDialog, private cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {}

  ngAfterContentInit() {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.shipments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdRef.detectChanges();
    })
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
        this.shipmentService.deleteShipment(reference).subscribe(
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

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }
}
