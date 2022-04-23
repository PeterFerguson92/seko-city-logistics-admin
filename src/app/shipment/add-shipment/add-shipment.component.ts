import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PLACES_OF_RECEIPT, PORTS_OF_DISCHARGE, PORTS_OF_LOADING } from 'src/app/constants';
import { IShipment } from '../model';
import { ShipmentService } from '../service/shipment.service';


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

  constructor(private router: Router, private formBuilder: FormBuilder, private shipmentService: ShipmentService) {}

  ngOnInit() {
    this.newShipmentForm = this.formBuilder.group({
      reference: [null],
      portOfLoading: [this.portsOfLoading[0]],
      portOfDischarge: [this.portsOfDischarge[0]],
      placeOfReceipt: [this.placesOfReceipt[0]],
      loadingDate: ['', Validators.required],
      consigneeName: [''],
      consigneeAddress: [''],
      exporterFullName: [''],
      exporterPostcode: [''],
      exporterAddress: [''],
      exporterArea: [''],
      exporterCity: [''],
      containerNumber:[''],
      blVessel:[''],
      shipmentDate: ['']
    })
  }

  onCreate() {
    const shipment: IShipment = {
      reference: this.getFormControl('reference').value,
      portOfLoading: this.getFormControl('portOfLoading').value,
      portOfDischarge: this.getFormControl('portOfDischarge').value,
      placeOfReceipt: this.getFormControl('placeOfReceipt').value,
      loadingDate: this.getFormControl('loadingDate').value,
      consigneeName: this.getFormControl('consigneeName').value,
      consigneeAddress: this.getFormControl('consigneeAddress').value,
      exporterFullName: this.getFormControl('exporterFullName').value,
      exporterPostcode: this.getFormControl('exporterPostcode').value,
      exporterAdress: this.getFormControl('reference').value,
      exporterArea: this.getFormControl('exporterArea').value,
      exporterCity: this.getFormControl('exporterCity').value,
      containerNumber: this.getFormControl('containerNumber').value,
      blVessel: this.getFormControl('blVessel').value,
      shipmentDate: this.getFormControl('shipmentDate').value
    }

    this.shipmentService.createShipment(shipment).subscribe(
      ({ data }) => {
        this.router.navigate(['/shipments']).then(() => {
          window.location.reload();
        });
      },
      error => {
        console.log(error);
      }
    );


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
