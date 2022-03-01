import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'ORIGIN', 'DESTINATION', 'DATE', 'ACTION'];

  constructor() { }

  ngOnInit(): void {
  }

}
