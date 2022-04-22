import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PLACES_OF_RECEIPT, PORTS_OF_DISCHARGE, PORTS_OF_LOADING } from 'src/app/constants';
import { IShipment } from '../model';


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
      blVessel: [''],
      consigneeExporter: [''],
      containerNumber: [''],
      loadingDate: ['', Validators.required],
      shipmentDate: [''],
    })
  }

  onCreate() {
    const shipment: IShipment = {
      portOfLoading: this.getFormControl('portOfLoading').value,
      portOfDischarge: this.getFormControl('portOfDischarge').value,
      placeOfReceipt: this.getFormControl('placeOfReceipt').value,
      consigneeExporter: this.getFormControl('consigneeExporter').value,
      containerNumber: this.getFormControl('containerNumber').value,
      blVessel: this.getFormControl('blVessel').value,
      loadingDate: this.getFormControl('loadingDate').value,
      shipmentDate: this.getFormControl('shipmentDate').value
    }
  }

  onCancel() {
    console.log(this.newShipmentForm)
    // this.closeDialog.next('closeDialog');
  }

  isDisabled() {
    return !this.newShipmentForm.valid;
  }

  getFormControl(fControlName: string) {
    return this.newShipmentForm.get(fControlName)
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }
}
