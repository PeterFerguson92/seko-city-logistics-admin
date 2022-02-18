import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-shipments',
  templateUrl: './all-shipments.component.html',
  styleUrls: ['./all-shipments.component.css']
})
export class AllShipmentsComponent implements OnInit, OnDestroy {
  options = [
    { date: '12/02/2022', Origin: 'LU459FG', Destination: 'Accra' },
    {date: '15/01/2022', Origin: 'MK11OPX', Destination: 'Accra'},
    {date: '11/03/2022', Origin: 'MK109LF', Destination: 'Kumasi'},
    {date: '22/12/2022', Origin: 'MK79LE', Destination: 'Other'},

  ];


  constructor() { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

}
