import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css','../../shared/shared-table.css']
})
export class OrdersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ID', 'CUSTOMER NAME', 'DELIVERY ADDRESS',
    'PAYMENT TYPE', 'PAYMENT STATUS', 'STATUS', 'ACTION'];
  orders: [] = null;
  dataSource = null;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private commonService: CommonService,
    private orderService: OrderService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    })
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

}
