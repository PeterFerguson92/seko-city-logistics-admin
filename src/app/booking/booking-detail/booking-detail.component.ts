import { Component, Input, OnInit } from '@angular/core';
import { BOOK_CUSTOMER_MODE } from 'src/app/constants';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {
  @Input() booking;
  mode
  constructor() { }

  ngOnInit(): void {
    console.log(this.booking)
    this.mode = BOOK_CUSTOMER_MODE
  }

}
