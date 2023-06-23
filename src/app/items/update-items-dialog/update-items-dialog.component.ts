import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ITEM_STATUSES } from 'src/app/constants';
import { ItemService } from '../item.service';

@Component({
    selector: 'app-update-items-dialog',
    templateUrl: './update-items-dialog.component.html',
    styleUrls: ['./update-items-dialog.component.css', '../../shared/shared.dialog.css'],
})
export class UpdateItemsDialogComponent implements OnInit, OnDestroy {
    itemInfoForm: FormGroup;
    itemStatuses = ITEM_STATUSES;
    updatedStatus;
    componentDestroyed$: Subject<boolean> = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private itemService: ItemService,
        private dialogRef: MatDialogRef<UpdateItemsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {}

    ngOnInit(): void {
        this.itemInfoForm = this.formBuilder.group({
            status: [this.itemStatuses[0]],
        });
    }

    getFormControl(fControlName: string) {
        return this.itemInfoForm.get(fControlName);
    }

    onSelectionChange(event: any, fControlName: string) {
        const fControl = this.getFormControl(fControlName);
        fControl.setValue(event.value);
        fControl.markAsDirty();
    }

    onSubmit() {
        const fieldToUpdate = { name: 'status', value: this.getFormControl('status').value };
        if (this.data.allItems) {
            this.updateItemsByBookingReference(fieldToUpdate);
        } else {
            this.updateItemsById(fieldToUpdate);
        }
    }
    updateItemsById(fieldToUpdate: any) {
        this.itemService
            .updateItemsById(this.data.itemsIds, fieldToUpdate)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
                next: () => {
                    this.updatedStatus = this.getFormControl('status').value;
                    this.dialogRef.close({ updatedStatus: this.updatedStatus });
                },
                error: (error) => {
                    console.log(error);
                    console.log(error.message);
                },
            });
    }

    updateItemsByBookingReference(fieldToUpdate: any) {
        this.itemService
            .updateItemsByBookingReference(this.data.reference, fieldToUpdate)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
                next: () => {
                    this.updatedStatus = this.getFormControl('status').value;
                    this.dialogRef.close({ updatedStatus: this.updatedStatus });
                },
                error: (error) => {
                    console.log(error);
                    console.log(error.message);
                },
            });
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
