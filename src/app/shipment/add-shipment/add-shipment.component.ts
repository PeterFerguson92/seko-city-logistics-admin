import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PLACES_OF_RECEIPT, PORTS_OF_DISCHARGE, PORTS_OF_LOADING } from 'src/app/constants';


@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.css', './../../shared/shared-form.css']
})

export class AddShipmentComponent implements OnInit {

  newShipmentForm: FormGroup;
  portsOfLoading = PORTS_OF_LOADING
  portsOfDischarge = PORTS_OF_DISCHARGE;
  placesOfReceipt = PLACES_OF_RECEIPT;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.newShipmentForm = this.formBuilder.group({
      portOfLoading: [this.portsOfLoading[0]],
      portOfDischarge: [this.portsOfDischarge[0]],
      placeOfReceipt: [this.placesOfReceipt[0]],
      loadingDate: ['', Validators.required],
      consigneeExporter: ['', Validators.required],
      containerNumber: ['', Validators.required],
      shipmentDate: ['', Validators.required],
    })
  }
}
