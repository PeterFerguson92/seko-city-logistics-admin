import { Component, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from '../shared/service/event/event-emitter.service';


@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.css']
})

export class AddShipmentComponent implements OnInit {

  constructor(private eventEmitterService: EventEmitterService) {}

  ngOnInit() {
  }
}
