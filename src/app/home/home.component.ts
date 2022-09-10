import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BookingsService } from '../booking/service/bookings/bookings.service';
import { ItemService } from '../items/item.service';
import { TaskService } from '../task/service/task.service';
import { takeUntil } from 'rxjs/operators'
import { CommonService } from '../service/common.service';
import { OrderService } from '../order/service/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  activeTasks;
  approachingTasks;
  bookings;
  bookingReportData;
  itemAmountReportData;
  itemQuantityReportData;
  includeArchive = true;
  itemTypeOccurrenceReportData;

  totalBookings;
  totalBookingsAmount;
  currentMonthTotalBookings;
  currentMonthTotalBookingsAmount;
  yearBookingsAmountReportData

  totalOrders;
  totalOrdersAmount;
  currentMonthTotalOrders;
  currentMonthTotalOrdersAmount;

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private bookingService: BookingsService, private itemService: ItemService,
    private taskService: TaskService, private commonService: CommonService, private orderService: OrderService) {
      if (!localStorage.getItem('foo'))
      {
        localStorage.setItem('foo', 'no reload')
        location.reload()
      }
    }

  ngOnInit(): void {
    this.getBookingsReport();
    this.getOrdersReport();
    this.getItemsReportData();
    this.getTodayBookings();
    this.getDisplayTasks()
    }

  getItemsReportData() {
    this.itemService.getItemsReport().subscribe(
      ({ data }) => {
        const result = this.buildItemData(data.itemsDestinationReport)
        this.itemTypeOccurrenceReportData = result.typeData
        this.itemQuantityReportData = result.quantityData
        this.itemAmountReportData = result.amountData
      },
      error => {
        console.log(error);
      }
    )
  }

  buildItemData(destinationReportData) {
    const typeData = [];
    const quantityData = [];
    const amountData = []
    destinationReportData.forEach((entry) => {
      typeData.push({ name: entry.type, value: entry.occurrence })
      quantityData.push({ name: entry.type, value: entry.quantity })
      amountData.push({name: entry.type, value: entry.amount})
    });
    return { typeData, quantityData, amountData };
  }

  getBookingsReport() {
    const currentMonthId = new Date().getMonth() + 1;
    this.bookingService.getBookingsReport()
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe(
      ({ data }) => {
        this.totalBookings = data.bookingsReport.total;
        this.totalBookingsAmount = data.bookingsReport.totalAmount;
        const current = data.bookingsReport.monthly.find(x => x.monthId === currentMonthId);
        this.currentMonthTotalBookings = current.total;
        this.currentMonthTotalBookingsAmount = current.totalAmount;
        this.yearBookingsAmountReportData = this.buildActivityReportData(data.bookingsReport.monthly).yearAmountReportData;
      },
      error => {
        console.log(error);
      }
    )
  }

  getOrdersReport() {
    const currentMonthId = new Date().getMonth() + 1;
    this.orderService.getOrdersReport()
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe(
      ({ data }) => {
        this.totalOrders = data.ordersReport.total;
        this.totalOrdersAmount = data.ordersReport.totalAmount;
        const current = data.ordersReport.monthly.find(x => x.monthId === currentMonthId);
        this.currentMonthTotalOrders = current.total;
        this.currentMonthTotalOrdersAmount = current.totalAmount;
      },
      error => {
        console.log(error);
      }
    )
  }

  buildActivityReportData(reportData) {
    const yearAmountReportData = []
    reportData.forEach((entry) => {
      yearAmountReportData.push({ name: entry.monthName, value: entry.totalAmount })
    });
    return { yearAmountReportData };
  }

  getDisplayTasks() {
    this.taskService.getDisplayTasks()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        ({ data }) => {
          this.activeTasks = data.displayTask.active;
          this.approachingTasks = data.displayTask.approaching;
      },
      error => {
        console.log(error);
      }
    )
  }

  getTodayBookings() {
    const today: any = new Date();
    this.bookingService.filterBookings({ name: 'pickUpDate', value: this.commonService.getFormattedIsoDate(today) })
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
      ({ data }) => {
        // tslint:disable-next-line:no-string-literal
        this.bookings = data['filterBookings'];
      },
      error => {
        console.log(error);
      }
    );
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
