import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { IShipment } from '../model';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.css']
})
export class ShipmentsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'SHIPMENT DATE', 'CONTAINER NUMBER', 'BL VESSEL', 'STATUS', 'ACTION'];
  shipments: [IShipment] = null;
  dataSource = null;

  constructor(private router: Router,
    private activatedroute: ActivatedRoute,
    private commonService:CommonService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.shipments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    })
  }

  onAddShipment() {
    this.router.navigate(['/add-shipments']);
  }

  onAssignBooking(reference) {
    this.router.navigate(['/assign-bookings', reference]);
  }

  onDeleteShipment(reference) {
    console.log(reference)
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }
}
