import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-bookings-driver',
  templateUrl: './bookings-driver.component.html',
  styleUrls: ['./bookings-driver.component.css', '../../shared/shared-table.css']
})
export class BookingsDriverComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = null;
  displayedColumns: string[] = ['ID', 'SENDER', 'POSTCODE', 'ADDRESS', 'DATE', 'TIME', 'PHONE', 'STATUS'];
  constructor(private activatedroute: ActivatedRoute, private commonService: CommonService,) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.bookings);
      console.log(data);
    });
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

}
