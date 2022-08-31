import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { BOOKING_STATUSES } from 'src/app/constants';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';
import { ShipmentService } from 'src/app/shipment/service/shipment.service';
import { ItemService } from '../../items/item.service';

@Component({
  selector: 'app-assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrls: ['./assign-dialog.component.css', '../../shared/shared.dialog.css']
})
export class AssignDialogComponent implements OnInit {
  itemInfoForm: FormGroup;
  bookingStatuses = BOOKING_STATUSES;

  constructor(private formBuilder: FormBuilder,
    private itemService: ItemService,
    private shipmentService: ShipmentService,
    public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.itemInfoForm = this.formBuilder.group({
      status: [this.data.item.status],
      containerNumber: [null],
    });
  }

  async onSubmit() {
    const updateFields = [];
    if (this.getFormControl('status').dirty)
    {
      updateFields.push({ name: 'status', value: this.getFormControl('status').value });
    }

    if (this.getFormControl('containerNumber').dirty)
    {
      const shipment = await this.getShipmentFromContainerNumber(this.getFormControl('containerNumber').value)
      if (shipment)
      {
        updateFields.push({name:'shipmentReference', value: shipment.reference});
      }
    }
    if (updateFields.length > 0)
    {
         this.itemService.updateItem(this.data.item.id, updateFields).subscribe(
        ({ data }) => {
          this.dialogRef.close();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  onSelectionChange(event: any, fControlName: string) {
      const fControl = this.getFormControl(fControlName);
      fControl.setValue(event.value);
      fControl.markAsDirty();
    }


  getFormControl(fControlName: string) {
    return this.itemInfoForm.get(fControlName)
  }

  async getShipmentFromReference(reference) {
    const shipment = (await lastValueFrom(
      this.shipmentService.getShipmentByReference(reference)))
      .data.shipmentByReference
    return shipment;
  }

  async getShipmentFromContainerNumber(containerNumber) {
    const shipment = (await lastValueFrom(
      this.shipmentService.getShipmentByContainerNumber(containerNumber)))
      .data.shipmentByContainerNumber
    return shipment;
  }


}
