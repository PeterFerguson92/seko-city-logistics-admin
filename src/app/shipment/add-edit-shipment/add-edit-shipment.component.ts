import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { PLACES_OF_RECEIPT, PORTS_OF_DISCHARGE, PORTS_OF_LOADING } from 'src/app/constants';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { IShipment } from '../model';
import { ShipmentService } from '../service/shipment.service';

@Component({
  selector: 'app-add-edit-shipment',
  templateUrl: './add-edit-shipment.component.html',
  styleUrls: ['./add-edit-shipment.component.css', './../../shared/shared-new-form.css']
})

export class AddEditShipmentComponent implements OnInit, OnDestroy {

  errorText;
  shipment: IShipment;
  showErrorText = false;
  addEditShipmentForm: FormGroup;
  portsOfLoading = PORTS_OF_LOADING
  placesOfReceipt = PLACES_OF_RECEIPT;
  portsOfDischarge = PORTS_OF_DISCHARGE;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private shipmentService: ShipmentService) { }

  ngOnInit() {
    this.buildForm();
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    if (snapshot.routeConfig.path !== 'add-shipment')
    {
      this.getShipmentByReference(reference);
    }
  }

  buildForm() {
    this.addEditShipmentForm = this.formBuilder.group({
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
      containerNumber: [''],
      blVessel: [''],
      shipmentDate: [''],
    })
  }

  getShipmentByReference(reference) {
    this.spinner.show();
    this.shipmentService.getShipmentByReference(reference)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
      next: (result) => {
          this.shipment = result.data ? result.data.shipmentByReference : null;
          if (this.shipment)
          {
            this.addEditShipmentForm.patchValue({
              loadingDate: this.shipment.loadingDate,
              consigneeName: this.shipment.consigneeName,
              consigneeAddress: this.shipment.consigneeAddress,
              exporterFullName: this.shipment.exporterFullName,
              exporterPostcode: this.shipment.exporterPostcode,
              exporterAddress: this.shipment.exporterAdress,
              exporterArea: this.shipment.exporterArea,
              exporterCity: this.shipment.exporterCity,
              containerNumber: this.shipment.containerNumber,
              blVessel: this.shipment.blVessel,
              shipmentDate: this.shipment.shipmentDate,
            });
          } else
          {
            this.router.navigate(['/not-found']);
          }
          this.spinner.hide()
      },
      error: () => {
        this.spinner.hide()
        this.dialog.open(InfoDialogComponent, {
          height: '30%',
          width: '30%',
          data: { message: `Sorry couldn't retrieve shipment with reference ${reference}` }
        });
      }
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
    this.spinner.show();
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
      this.shipmentService.updateShipment(this.shipment.reference, updateCustomerFields)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
        next: () => { this.redirectToShipments(); },
        error: (error) => {
        console.log(error.message);
        console.log(error)
        this.showErrorText = true
        this.errorText = `Operation failed: Please contact system support`;
        this.clearNotification();
        this.spinner.hide()
        }
      })
    }
  }

  createShipment() {
    this.spinner.show();
    const shipment = {
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

    this.shipmentService.createShipment(shipment)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
      next: () => { this.redirectToShipments(); },
      error: (error) => {
        console.log(error.message);
        console.log(error)
        this.showErrorText = true
        this.errorText = `Operation failed: Please contact system support`;
        this.clearNotification();
        this.spinner.hide()
      }
    })
  }

  redirectToShipments() {
    this.router.navigate(['/shipments']).then(() => {
      window.location.reload();
    });
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

  clearNotification() {
    setTimeout(function() {
      this.showErrorText = false;
      this.errorText = null;
    }.bind(this), 3000);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
