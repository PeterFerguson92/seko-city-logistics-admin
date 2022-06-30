import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IShipment } from '../model';
import { ShipmentService } from '../service/shipment.service';

@Component({
  selector: 'app-shipment-analysis',
  templateUrl: './shipment-analysis.component.html',
  styleUrls: ['./shipment-analysis.component.css', '../../shared/shared-form.css']
})
export class ShipmentAnalysisComponent implements OnInit {
  shipmentAnalysisForm: FormGroup;
  shipment: IShipment;
  EXCLUSIION_FORM_CONTROL_KEYS = ['loadingCostNotes', 'clearingNotes', 'notes', 'totalAmountCharged',
    'totalExpenses','totalLoadingCost','totalClearingCost', 'reference', 'profit']
  NOTES_FORM_CONTROL_KEYS = ['loadingCostNotes', 'clearingNotes', 'notes'];
  LOADING_FORM_CONTROL_KEYS = ['containerCharge', 'containerExtraCharge', 'loadersCost'];
  CLEARING_FORM_CONTROL_KEYS = ['clearingCharge', 'incentives', 'totalGhDriversFood', 'totalGhDriversTips',
    'thirdyPartyExpenses', 'carToAccraCheckpoint', 'carToKumasiCheckpoint', 'carToOtherCheckpoint'];

  constructor(private router: Router, private activatedroute: ActivatedRoute, private formBuilder: FormBuilder,
    private shipmentService: ShipmentService) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.shipment = this.shipment && this.shipment.reference ? this.shipment : data.shipment;
      this.shipmentAnalysisForm = this.formBuilder.group({
        reference: [null],
        totalAmountCharged: [this.shipment ? this.shipment.totalAmountCharged : 0],
        containerCharge: [this.shipment ? this.shipment.containerCharge : 0],
        containerExtraCharge: [this.shipment ? this.shipment.containerExtraCharge : 0],
        loadersCost: [this.shipment ? this.shipment.loadersCost : 0],
        loadingExtraCost: [this.shipment ? this.shipment.loadingExtraCost : 0],
        totalLoadingCost: [this.shipment ? this.shipment.totalLoadingCost : 0],
        loadingCostNotes: [this.shipment ? this.shipment.loadingCostNotes : ''],
        clearingCharge: [this.shipment ? this.shipment.clearingCharge: 0],
        incentives: [this.shipment ? this.shipment.incentives : 0],
        totalGhDriversFood: [this.shipment ? this.shipment.totalGhDriversFood : 0],
        totalGhDriversTips: [this.shipment ? this.shipment.totalGhDriversTips : 0],
        thirdyPartyExpenses: [this.shipment ? this.shipment.thirdyPartyExpenses : 0],
        carToAccraCheckpoint: [this.shipment ? this.shipment.carToAccraCheckpoint : 0],
        carToKumasiCheckpoint: [this.shipment ? this.shipment.carToKumasiCheckpoint : 0],
        carToOtherCheckpoint: [this.shipment ? this.shipment.carToOtherCheckpoint : 0],
        totalClearingCost: [this.shipment ? this.shipment.totalClearingCost : 0],
        clearingNotes: [this.shipment ? this.shipment.clearingNotes : ''],
        totalExpenses: [this.shipment ? this.shipment.totalExpenses : 0],
        profit: [this.shipment ? this.shipment.profit : 0],
        notes: [this.shipment ? this.shipment.notes : '']
      })
    })

    this.shipmentAnalysisForm.get('totalLoadingCost').disable();
    this.shipmentAnalysisForm.get('totalClearingCost').disable();
    this.shipmentAnalysisForm.get('totalLoadingCost').disable();
    this.shipmentAnalysisForm.get('totalAmountCharged').disable();
    this.shipmentAnalysisForm.get('totalExpenses').disable();
    this.shipmentAnalysisForm.get('profit').disable();
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
    console.log(this.shipment.reference)
    this.router.navigate(['/shipment-report', this.shipment.reference]);

  }
}
