import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BookingsService } from '../booking/service/bookings/bookings.service';
import { ItemService } from '../items/item.service';
import { TaskService } from '../task/service/task.service';
import { takeUntil } from 'rxjs/operators'
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  bookingReportData;
  itemTypeOccurrenceReportData;
  itemQuantityReportData;
  itemAmountReportData;
  activeTasks;
  approachingTasks;
  componentDestroyed$: Subject<boolean> = new Subject();
  bookings;
  includeArchive = true;


  constructor(private router: Router, private bookingService: BookingsService, private itemService: ItemService,
  private taskService: TaskService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.getItemsReportData();
    this.getActiveTasks();
    this.getApproachingTasks();
    this.getTodayBookings();
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

  navigate(url) {
    this.router.navigateByUrl(url)
  }

  getActiveTasks() {
    this.taskService.getActiveTasks().subscribe(
      ({ data }) => {
        this.activeTasks = data.activeTasks
      },
      error => {
        console.log(error);
      }
    )
  }

  getApproachingTasks() {
    this.taskService.getApproachingTasks()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
      ({ data }) => {
        this.approachingTasks = data.approachingTasks
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
        console.log(this.bookings)
      },
      error => {
        console.log(error);
      }
    );
  }

  getFormattedDate(date) {
    return this.commonService.getFormattedDate(date);
  }

  onSeeMoreReport() {

  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
