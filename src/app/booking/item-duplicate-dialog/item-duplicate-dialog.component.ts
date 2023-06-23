import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/elements/dialog/dialog.component';

@Component({
    selector: 'app-item-duplicate-dialog',
    templateUrl: './item-duplicate-dialog.component.html',
    styleUrls: ['./item-duplicate-dialog.component.css', '../../shared/shared.dialog.css'],
})
export class ItemDuplicateDialogComponent implements OnInit {
    itemsDuplicateForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.itemsDuplicateForm = this.formBuilder.group({
            quantity: [1],
        });
    }

    onSubmit() {
        const value = +this.itemsDuplicateForm.get('quantity').value;
        if (value > 1) {
            this.dialogRef.close({ data: +this.itemsDuplicateForm.get('quantity').value - 1 });
        }
    }

    getFormControl(fControlName: string) {
        return this.itemsDuplicateForm.get(fControlName);
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
