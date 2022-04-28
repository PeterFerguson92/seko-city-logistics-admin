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

  constructor(private router: Router, private activatedroute: ActivatedRoute, private commonService:CommonService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.shipments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    })
  }

  onAssign() {
    this.router.navigate(['/assign-bookings']);
  }

  onAddShipment() {
    this.router.navigate(['/add-shipment']);
  }

  onListBookings(reference) {
    this.router.navigate(['/list-bookings', reference]);
  }

  OnEditShipment(reference) {
    this.router.navigate(['/edit-shipment', reference]);
  }

  onDeleteShipment(reference) {
    console.log(reference)
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }
}
