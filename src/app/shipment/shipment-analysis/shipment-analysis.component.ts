import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { IShipment } from '../model';
import { ShipmentService } from '../service/shipment.service';

@Component({
  selector: 'app-shipment-analysis',
  templateUrl: './shipment-analysis.component.html',
  styleUrls: ['./shipment-analysis.component.css', '../../shared/shared-new-form.css']
})
export class ShipmentAnalysisComponent implements OnInit, OnDestroy {
  shipmentAnalysisForm: FormGroup;
  shipment: IShipment;
  EXCLUSIION_FORM_CONTROL_KEYS = ['loadingCostNotes', 'clearingNotes', 'notes', 'totalAmountCharged',
    'totalExpenses','totalLoadingCost','totalClearingCost', 'reference', 'profit']
  NOTES_FORM_CONTROL_KEYS = ['loadingCostNotes', 'clearingNotes', 'notes'];
  LOADING_FORM_CONTROL_KEYS = ['containerCharge', 'containerExtraCharge', 'loadersCost'];
  CLEARING_FORM_CONTROL_KEYS = ['clearingCharge', 'incentives', 'totalGhDriversFood', 'totalGhDriversTips',
    'thirdyPartyExpenses', 'carToAccraCheckpoint', 'carToKumasiCheckpoint', 'carToOtherCheckpoint'];
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private shipmentService: ShipmentService) { }

  ngOnInit(): void {
    this.buildForm();
    const snapshot = this.activatedRoute.snapshot;
    const reference = snapshot.paramMap.get('reference');
    this.getShipmentByReference(reference);
  }

  buildForm() {
    this.shipmentAnalysisForm = this.formBuilder.group({
      reference: [null],
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
      carToOtherCheckpoint: [0],
      totalClearingCost: [0],
      clearingNotes: [''],
      totalExpenses: [0],
      profit: [0],
      notes: ['']
    })

    this.shipmentAnalysisForm.get('totalLoadingCost').disable();
    this.shipmentAnalysisForm.get('totalClearingCost').disable();
    this.shipmentAnalysisForm.get('totalLoadingCost').disable();
    this.shipmentAnalysisForm.get('totalAmountCharged').disable();
    this.shipmentAnalysisForm.get('totalExpenses').disable();
    this.shipmentAnalysisForm.get('profit').disable();
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
            this.shipmentAnalysisForm.patchValue({
              totalAmountCharged: this.shipment.totalAmountCharged,
              containerCharge: this.shipment.containerCharge,
              containerExtraCharge: this.shipment.containerExtraCharge,
              loadersCost: this.shipment.loadersCost,
              loadingExtraCost: this.shipment.loadingExtraCost,
              totalLoadingCost: this.shipment.totalLoadingCost,
              loadingCostNotes: this.shipment.loadingCostNotes,
              clearingCharge: this.shipment.clearingCharge,
              incentives: this.shipment.incentives,
              totalGhDriversFood: this.shipment.totalGhDriversFood,
              totalGhDriversTips: this.shipment.totalGhDriversTips,
              thirdyPartyExpenses: this.shipment.thirdyPartyExpenses,
              carToAccraCheckpoint: this.shipment.carToAccraCheckpoint,
              carToKumasiCheckpoint: this.shipment.carToKumasiCheckpoint,
              carToOtherCheckpoint: this.shipment.carToOtherCheckpoint,
              totalClearingCost: this.shipment.totalClearingCost,
              clearingNotes: this.shipment.clearingNotes,
              totalExpenses: this.shipment.totalExpenses,
              profit: this.shipment.profit,
              notes: this.shipment.notes,
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
          height: '25%',
          width: '30%',
          data: { message: `Sorry couldn't retrieve shipment with reference ${reference}` }
        });
      }
    })
  }


  isDisabled() { return false; }

  getFormControl(fControlName: string) { return this.shipmentAnalysisForm.get(fControlName) }

  updateTotalExpensesAmount() {
    const totalExpenses = this.getTotal();
    const totalAmountCharged = parseInt(this.shipmentAnalysisForm.get('totalAmountCharged').value, 10);

    this.shipmentAnalysisForm.get('totalLoadingCost').setValue(totalExpenses.totalLoadingCost);
    this.shipmentAnalysisForm.get('totalLoadingCost').markAsDirty();

    this.shipmentAnalysisForm.get('totalClearingCost').setValue(totalExpenses.totalClearingCost);
    this.shipmentAnalysisForm.get('totalClearingCost').markAsDirty();

    this.shipmentAnalysisForm.get('totalExpenses').setValue(totalExpenses.total);
    this.shipmentAnalysisForm.get('totalExpenses').markAsDirty();

    this.shipmentAnalysisForm.get('profit').setValue(totalAmountCharged - totalExpenses.total);
    this.shipmentAnalysisForm.get('profit').markAsDirty()
  }

  getTotal() {
    let total = 0;
    let totalLoadingCost = 0;
    let totalClearingCost = 0;
    Object.keys(this.shipmentAnalysisForm.controls).forEach(key => {
      const formControl = this.shipmentAnalysisForm.controls[key]
      if (!this.EXCLUSIION_FORM_CONTROL_KEYS.includes(key))
      {
        if (this.LOADING_FORM_CONTROL_KEYS.includes(key))
        {
          totalLoadingCost = totalLoadingCost + parseInt(formControl.value, 10);
        }

        if (this.CLEARING_FORM_CONTROL_KEYS.includes(key))
        {
          totalClearingCost = totalClearingCost + parseInt(formControl.value, 10);
        }

        total = total + parseInt(formControl.value, 10);
      }
    });

    return { total, totalLoadingCost, totalClearingCost };
  }

  onSubmit() {
    const updateCustomerFields = []
    Object.keys(this.shipmentAnalysisForm.controls).forEach(key => {
      const formControl = this.shipmentAnalysisForm.controls[key]
      if (!formControl.pristine && formControl.value !== this.shipment[key])
      {
        if (!this.NOTES_FORM_CONTROL_KEYS.includes(key))
        {
          updateCustomerFields.push({ name: key, value:  formControl.value.toString() });
        }
        else
        {
          updateCustomerFields.push({ name: key, value: formControl.value });
        }
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

  onGenerateReport() {
    this.router.navigate(['/shipment-report', this.shipment.reference]);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
