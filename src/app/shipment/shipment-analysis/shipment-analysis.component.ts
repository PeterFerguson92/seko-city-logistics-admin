import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shipment-analysis',
  templateUrl: './shipment-analysis.component.html',
  styleUrls: ['./shipment-analysis.component.css']
})
export class ShipmentAnalysisComponent implements OnInit {

  constructor(private activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      console.log(data);
    })
  }
}
