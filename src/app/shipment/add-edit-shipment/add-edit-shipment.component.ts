import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PLACES_OF_RECEIPT, PORTS_OF_DISCHARGE, PORTS_OF_LOADING } from 'src/app/constants';
import { IShipment } from '../model';
import { ShipmentService } from '../service/shipment.service';


@Component({
  selector: 'app-add-edit-shipment',
  templateUrl: './add-edit-shipment.component.html',
  styleUrls: ['./add-edit-shipment.component.css', './../../shared/shared-form.css']
})

export class AddEditShipmentComponent implements OnInit {

  addEditShipmentForm: FormGroup;
  shipment: IShipment;
  portsOfLoading = PORTS_OF_LOADING
  portsOfDischarge = PORTS_OF_DISCHARGE;
  placesOfReceipt = PLACES_OF_RECEIPT;

  constructor(private activatedroute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
    private shipmentService: ShipmentService) { }

  ngOnInit() {
    this.activatedroute.data.subscribe(data => {
      this.shipment = this.shipment && this.shipment.reference ? this.shipment : data.shipment;
      this.addEditShipmentForm = this.formBuilder.group({
        reference: [null],
        portOfLoading: [this.portsOfLoading[0]],
        portOfDischarge: [this.portsOfDischarge[0]],
        placeOfReceipt: [this.placesOfReceipt[0]],
        loadingDate: [this.shipment ? this.shipment.loadingDate: '', Validators.required],
        consigneeName: [this.shipment ? this.shipment.consigneeName: ''],
        consigneeAddress: [this.shipment ? this.shipment.consigneeAddress: ''],
        exporterFullName: [this.shipment ? this.shipment.exporterFullName: ''],
        exporterPostcode: [this.shipment ? this.shipment.exporterPostcode: ''],
        exporterAddress: [this.shipment ? this.shipment.exporterAdress : ''],
        exporterArea: [this.shipment ? this.shipment.exporterArea: ''],
        exporterCity: [this.shipment ? this.shipment.exporterCity: ''],
        containerNumber: [this.shipment ? this.shipment.containerNumber: ''],
        blVessel: [this.shipment ? this.shipment.blVessel: ''],
        shipmentDate: [this.shipment ? this.shipment.shipmentDate : ''],
        totalAmountCharged: [0],
        containerCharge: [0],
        containerExtraCharge: [0],
        loadersCost: [0],
        loadingExtraCost: [0],
        totalLoadingCost: [0],
        loadingCostNotes: [''],
        clearingCharge: [0],
        incentives: [0],
        totalGhDriversFood: [0],
        totalGhDriversTips: [0],
        thirdyPartyExpenses: [0],
        carToAccraCheckpoint: [0],
        carToKumasiCheckpoint: [0],
        carToOtherCheckpoint:[0],
        clearingNotes: [''],
        totalExpenses:[0],
        profit: [0],
        notes: ['']


      })
    })
  }

  onSubmit() {
    if (this.router.url.includes('edit-shipment'))
    {
      this.updateShipment()
    } else
    {
      this.createShipment();
    }
  }

  updateShipment() {
    const updateCustomerFields = []
    Object.keys(this.addEditShipmentForm.controls).forEach(key => {
      const formControl = this.addEditShipmentForm.controls[key]
      if (!formControl.pristine && formControl.value !== this.shipment[key])
      {
        updateCustomerFields.push({ name: key, value: formControl.value });
      }
    });

    if (updateCustomerFields.length > 0)
    {
      this.shipmentService.updateShipment(this.shipment.reference, updateCustomerFields).subscribe(
        ({ data }) => {
          location.reload();  // To handle properly
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  createShipment() {
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
    console.log(this.addEditShipmentForm)
    // this.closeDialog.next('closeDialog');
  }

  isDisabled() {
    return !this.addEditShipmentForm.valid;
  }

  getFormControl(fControlName: string) {
    return this.addEditShipmentForm.get(fControlName)
  }

  onInputChange(event, fControlName) {
    const fControl = this.getFormControl(fControlName);
    fControl.setValue(event)
    fControl.markAsDirty();
  }
}
