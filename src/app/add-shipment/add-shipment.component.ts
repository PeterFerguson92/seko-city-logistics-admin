import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.css']
})

export class AddShipmentComponent implements OnInit {

  newShipmentForm: FormGroup;
  departures = ['London Gateway'];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.newShipmentForm = this.formBuilder.group({
      departure: ['', [Validators.required]]
    })
  }
}
