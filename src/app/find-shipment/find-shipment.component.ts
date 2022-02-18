import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-find-shipment',
  templateUrl: './find-shipment.component.html',
  styleUrls: ['./find-shipment.component.css']
})
export class FindShipmentComponent implements OnInit {

  isVisible = true;

  constructor() { }

  ngOnInit(): void {
  }

  onSearch() {
    this.isVisible = !this.isVisible;
  }

}
