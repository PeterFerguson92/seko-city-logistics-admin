import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { IBooking } from 'src/app/booking/model';
import { ItemService } from 'src/app/items/item.service';
import { CommonService } from 'src/app/service/common.service';
import { InfoDialogComponent } from 'src/app/shared/elements/info-dialog/info-dialog.component';
import { ShipmentService } from '../service/shipment.service';

@Component({
    selector: 'app-eligible-items',
    templateUrl: './eligible-items.component.html',
    styleUrls: [
        './eligible-items.component.css',
        '../../shared/shared-table.css',
        '../../shared/shared-new-form.css',
    ],
})
export class EligibleItemsComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() bookings: [IBooking] = null;
    displayedColumns: string[] = [
        'ASSIGNED',
        'SENDER FULL NAME',
        'DESTINATION',
        'PICK-UP DATE',
        'TYPE',
        'DESCRIPTION',
        'VALUE',
        'LABEL NUMBER',
        'ACTION',
    ];
    selection = new SelectionModel<IBooking>(true, []);
    selectedShipmentForm: FormGroup;
    shipments;
    shipmentsObjs;
    dataSource = null;
    height = '80%';
    width = '65%';
    shipmentList = [];
    loadingDate = null;
    isAllSelected = false;
    isError = false;
    errorMsg = null;
    SHIPMENT_SELECTION_MESSAGE = 'Please select shipment';
    componentDestroyed$: Subject<boolean> = new Subject();

    constructor(
        private router: Router,
        private activatedroute: ActivatedRoute,
        private itemService: ItemService,
        private formBuilder: FormBuilder,
        private commonService: CommonService,
        private shipmentService: ShipmentService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getEligibleItems();
        this.getShipments();
        this.selectedShipmentForm = this.formBuilder.group({
            selectedShipment: [''],
            loadingDate: [''],
        });
        this.getFormControl('loadingDate').disable();
    }

    getEligibleItems() {
        this.spinner.show();
        this.itemService
            .getEligibleItems()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
                next: (result) => {
                    const items = result.data.eligibleItems;
                    console.log(items);
                    this.dataSource =
                        items.length > 0
                            ? new MatTableDataSource(this.buildItemsData(items))
                            : new MatTableDataSource(null);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.spinner.hide();
                },
                error: () => {
                    this.spinner.hide();
                    this.dialog.open(InfoDialogComponent, {
                        height: '25%',
                        width: '30%',
                        data: { message: `Sorry couldn't retrieve eligible items` },
                    });
                },
            });
    }

    getShipments() {
        this.shipmentService
            .getShipments()
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe({
                next: (result) => {
                    this.shipmentsObjs = result.data.shipments;
                    this.shipments = this.getShipmentsDetailsList(this.shipmentsObjs);
                    this.getFormControl('selectedShipment').setValue(this.shipmentList[0]);
                    this.getFormControl('loadingDate').setValue(
                        this.getFormattedDate(this.shipmentList[0].loadingDate)
                    );
                },
                error: () => {
                    this.spinner.hide();
                    this.dialog.open(InfoDialogComponent, {
                        height: '25%',
                        width: '30%',
                        data: { message: `Sorry couldn't retrieve shipments` },
                    });
                },
            });
    }

    getFormattedDate(date) {
        return this.commonService.getFormattedDate(date);
    }

    isSelected(element) {
        this.selection.isSelected(element);
        return element.shipmentReference === this.activatedroute.snapshot.params.reference;
    }

    isDisabled() {
        return this.SHIPMENT_SELECTION_MESSAGE === this.getFormControl('selectedShipment').value;
    }

    onAssign() {
        const itemsIdsToAssign = [];
        this.dataSource.data.forEach((row) => {
            if (row.selected) {
                itemsIdsToAssign.push(row.itemId);
            }
        });
        this.assignItemsToShipment(itemsIdsToAssign);
    }

    assignItemsToShipment(itemsIdsToAssign) {
        const shipmentReference = this.getShipmentReferenceFromSelection();
        if (shipmentReference) {
            const fieldToUpdate = { name: 'shipmentReference', value: shipmentReference };
            this.itemService.updateItemsById(itemsIdsToAssign, fieldToUpdate).subscribe(
                ({ data }) => {
                    location.reload(); // TODO handle properly
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    getShipmentReferenceFromSelection() {
        const shipmentSelection = this.getFormControl('selectedShipment').value;
        return this.shipmentsObjs.find(
            (shipment) => shipment.containerNumber === shipmentSelection.containerNumber
        ).reference;
    }

    getShipmentsDetailsList(shipments) {
        const shipmentsDetails: string[] = [];
        shipmentsDetails.push(this.SHIPMENT_SELECTION_MESSAGE);
        shipments.forEach((shipment) => {
            if (shipment.containerNumber.length > 0) {
                this.shipmentList.push({
                    containerNumber: shipment.containerNumber,
                    loadingDate: shipment.loadingDate,
                });
            }
        });
        return shipmentsDetails;
    }

    onSelectionChange(event: any) {
        this.getFormControl('loadingDate').setValue(this.getFormattedDate(event.value.loadingDate));
    }

    getFormControl(fControlName: string) {
        return this.selectedShipmentForm.get(fControlName);
    }

    onViewBooking(reference) {
        this.router.navigate(['/booking-summary', reference]);
    }

    buildItemsData(results) {
        const resultData = [];
        for (const result of results) {
            resultData.push(this.mergeData(result.item, result.booking));
        }
        return resultData;
    }

    mergeData(item, booking) {
        const itemCopy = { ...item };
        itemCopy.itemId = item.id;
        itemCopy.selected = false;
        return { ...itemCopy, ...booking };
    }

    selectAll() {
        if (this.dataSource && this.dataSource.data) {
            this.isAllSelected = !this.isAllSelected;
            this.dataSource = new MatTableDataSource(
                this.dataSource.data.map((obj) => ({ ...obj, selected: this.isAllSelected }))
            );
        }
    }

    isMultipleEnabled() {
        return (
            this.dataSource &&
            this.dataSource.data &&
            this.dataSource.data.filter((u: any) => u.selected).length > 0
        );
    }

    isAllChecked() {
        const result =
            this.dataSource &&
            this.dataSource.data &&
            this.dataSource.data.filter((u: any) => u.selected).length === this.dataSource.data.length;
        this.isAllSelected = result;
        return result;
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
