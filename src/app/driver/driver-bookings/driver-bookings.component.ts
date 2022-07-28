import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-driver-bookings',
  templateUrl: './driver-bookings.component.html',
  styleUrls: ['./driver-bookings.component.css', '../../shared/shared-table.css']
})
export class DriverBookingsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = null;
  displayedColumns: string[] = ['ID', 'SENDER', 'POSTCODE', 'ADDRESS', 'DATE', 'TIME', 'PHONE', 'STATUS', 'ACTION'];
  constructor(private activatedroute: ActivatedRoute, private commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.bookings);
    });
  }

  onViewBooking(reference) {
    this.router.navigate(['/booking-summary', reference]);
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

}
